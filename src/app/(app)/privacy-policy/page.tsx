import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";

export default function PrivacyPolicyPage() {
  return (
    <PageLayout header={<h1>Privacy Policy</h1>}>
      <div className="prose prose-sm dark:prose-invert max-w-2xl">
        <p className="text-muted-foreground text-xs">
          Last updated: 21 May 2026
        </p>

        <h2>1. Data Controller</h2>
        <p>
          TriposPro is operated by Oliver Fogelin (of284@cam.ac.uk). This policy
          explains how we collect, use, and protect your personal data.
        </p>

        <h2>2. Legal Basis for Processing</h2>
        <p>
          We process your data on the basis of contract performance (providing
          the Service you signed up for) and legitimate interests (improving the
          Service and maintaining security).
        </p>

        <h2>3. Data We Collect</h2>

        <h3>From Cambridge SSO (on sign-in)</h3>
        <ul>
          <li>
            <strong>CRSid</strong> — your Cambridge username (e.g. of284)
          </li>
          <li>
            <strong>Name</strong> — as registered with the university
          </li>
          <li>
            <strong>Email address</strong> — your @cam.ac.uk email
          </li>
          <li>
            <strong>Profile picture</strong> — from your Clerk account
          </li>
        </ul>

        <h3>From Cambridge Lookup Service (automated, on sign-in)</h3>
        <ul>
          <li>
            <strong>College</strong> — your college membership
          </li>
          <li>
            <strong>Tripos year</strong> — your current year group (Part IA, IB,
            II)
          </li>
          <li>
            <strong>Group memberships</strong> — university groups you belong to
            (used to determine college and year)
          </li>
        </ul>

        <h3>From your use of the Service</h3>
        <ul>
          <li>
            <strong>Answer logs</strong> — questions attempted, time taken,
            marks, and personal notes
          </li>
          <li>
            <strong>Comments</strong> — content you post in discussions
          </li>
          <li>
            <strong>Votes</strong> — upvotes/downvotes on comments
          </li>
          <li>
            <strong>Bookmarks</strong> — starred courses and flagged questions
          </li>
          <li>
            <strong>Chat history</strong> — RAG bot conversations (your messages
            are sent to OpenAI for processing)
          </li>
          <li>
            <strong>Settings</strong> — selected tripos part and preferences
          </li>
        </ul>

        <h3>Analytics</h3>
        <ul>
          <li>
            <strong>PostHog</strong> (EU-hosted) — page views, feature usage,
            search queries, and interaction events, linked to your account
          </li>
          <li>
            <strong>Vercel Analytics</strong> — page views and web performance
            metrics
          </li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>
            Providing the Service (displaying your profile, tracking progress)
          </li>
          <li>
            Aggregated leaderboards (college rankings by activity)
          </li>
          <li>
            Improving the Service (understanding which features are used)
          </li>
          <li>
            Displaying your name and college on your profile to other
            authenticated users
          </li>
          <li>
            Powering AI features (search, RAG bot, question recommendations)
          </li>
        </ul>

        <h2>5. Data Sharing</h2>
        <p>We do not sell your data. Data is processed by:</p>
        <ul>
          <li>
            <strong>Clerk</strong> (authentication) — handles sign-in sessions
            and stores account data
          </li>
          <li>
            <strong>Neon</strong> (database, EU) — stores your data encrypted at
            rest
          </li>
          <li>
            <strong>Vercel</strong> (hosting, US) — processes requests and
            collects web analytics
          </li>
          <li>
            <strong>PostHog</strong> (analytics, EU) — receives identified usage
            events
          </li>
          <li>
            <strong>OpenAI</strong> (AI, US) — receives your RAG bot chat
            messages for generating responses; no account data (name/email) is
            sent
          </li>
          <li>
            <strong>Pinecone</strong> (vector search, US) — stores question
            embeddings and processes search queries for semantic matching
          </li>
          <li>
            <strong>Cambridge Lookup API</strong> — receives your CRSid to fetch
            college and group memberships
          </li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>
          Your data is retained for as long as you have an active account.
          Comments you delete are soft-deleted (hidden from view but retained in
          the database). You can request full deletion of your account and all
          associated data by contacting us.
        </p>

        <h2>7. Your Rights</h2>
        <p>Under UK GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing</li>
          <li>Data portability</li>
        </ul>
        <p>
          To exercise these rights, contact{" "}
          <a href="mailto:of284@cam.ac.uk">of284@cam.ac.uk</a>. We will respond
          within 30 days.
        </p>

        <h2>8. Security</h2>
        <p>
          All data is transmitted over HTTPS. Database storage is encrypted at
          rest. Authentication is handled by Clerk with industry-standard
          security practices. Access to production systems is restricted.
        </p>

        <h2>9. Cookies</h2>
        <p>We use the following cookies:</p>
        <ul>
          <li>
            <strong>Essential</strong> — Clerk session cookie (required for
            authentication)
          </li>
          <li>
            <strong>Functional</strong> — theme preference and selected tripos
            part (localStorage)
          </li>
          <li>
            <strong>Analytics</strong> — PostHog first-party cookie for usage
            tracking
          </li>
        </ul>
        <p>No third-party advertising cookies are used.</p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this policy. Changes will be noted by updating the
          &quot;last updated&quot; date. Continued use of the Service constitutes
          acceptance of the updated policy.
        </p>

        <h2>11. Contact</h2>
        <p>
          For privacy-related questions, contact{" "}
          <a href="mailto:of284@cam.ac.uk">of284@cam.ac.uk</a>.
        </p>

        <div className="mt-8 border-t pt-4">
          <Link
            href="/terms-of-service"
            className="text-primary text-sm hover:underline"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
