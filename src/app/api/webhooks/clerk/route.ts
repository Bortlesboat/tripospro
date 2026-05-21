import type { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/db";
import { triposPartTable } from "@/db/schema/tripos";
import { userSettingsTable, usersTable } from "@/db/schema/user";
import { env } from "@/env";
import {
  extractCollege,
  extractTriposPartCode,
  lookupPerson
} from "@/lib/cambridge-lookup";
import { getPostHogClient } from "@/lib/posthog-server";

async function syncLookupData(userId: number, crsid: string) {
  try {
    const person = await lookupPerson(crsid);
    if (!person) return;

    const college = extractCollege(person.institutions);
    const partCode = extractTriposPartCode(person.groups);

    await db
      .update(usersTable)
      .set({
        college,
        lookupData: {
          groups: person.groups,
          institutions: person.institutions,
          lastFetched: new Date().toISOString()
        },
        updatedAt: new Date()
      })
      .where(eq(usersTable.id, userId));

    if (partCode) {
      const part = await db.query.triposPartTable.findFirst({
        where: eq(triposPartTable.code, partCode)
      });
      if (part) {
        const settings = await db.query.userSettingsTable.findFirst({
          where: eq(userSettingsTable.userId, userId)
        });
        if (settings && !settings.triposPartId) {
          await db
            .update(userSettingsTable)
            .set({ triposPartId: part.id })
            .where(eq(userSettingsTable.userId, userId));
        }
      }
    }
  } catch (err) {
    console.error(`Failed to sync lookup data for ${crsid}:`, err);
  }
}

export async function POST(req: Request) {
  const SIGNING_SECRET = env.CLERK_SIGNING_SECRET;

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

  if (eventType === "user.created") {
    const email =
      evt.data.email_addresses.find(
        (e) => e.id === evt.data.primary_email_address_id
      )?.email_address ?? evt.data.email_addresses[0].email_address;
    const crsid = email?.split("@")[0];

    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.crsid, crsid)
    });

    if (existingUser) {
      await db
        .update(usersTable)
        .set({
          clerkId: evt.data.id,
          name: `${evt.data.first_name} ${evt.data.last_name}`,
          email: email,
          picture: evt.data.image_url,
          crsid: crsid
        })
        .where(eq(usersTable.id, existingUser.id));

      await syncLookupData(existingUser.id, crsid);
      return new Response("User already exists", { status: 200 });
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        clerkId: evt.data.id,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        email: email,
        picture: evt.data.image_url,
        crsid: crsid
      })
      .returning();

    await db.insert(userSettingsTable).values({
      userId: user.id
    });

    await syncLookupData(user.id, crsid);

    const posthog = getPostHogClient();
    posthog.identify({
      distinctId: evt.data.id,
      properties: {
        email,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        crsid
      }
    });
    posthog.capture({
      distinctId: evt.data.id,
      event: "user_signed_up",
      properties: { email, crsid }
    });
    await posthog.flush();
  }

  if (eventType === "session.created") {
    const userId = evt.data.user_id;
    if (!userId) return new Response("No user_id", { status: 200 });

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, userId)
    });

    if (user?.crsid) {
      const lastFetched = user.lookupData?.lastFetched;
      const staleThreshold = Date.now() - 24 * 60 * 60 * 1000;
      if (!lastFetched || new Date(lastFetched).getTime() < staleThreshold) {
        await syncLookupData(user.id, user.crsid);
      }
    }
  }

  return new Response("Webhook received", { status: 200 });
}
