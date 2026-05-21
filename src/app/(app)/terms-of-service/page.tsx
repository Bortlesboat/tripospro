import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";

export default function TermsOfServicePage() {
  return (
    <PageLayout header={<h1>Terms of Service</h1>}>
      <div className="prose prose-sm dark:prose-invert max-w-2xl">
        <p className="text-muted-foreground text-xs">
          Last updated: 21 May 2026
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using TriposPro (&quot;the Service&quot;), you agree
          to be bound by these Terms of Service. The Service is available
          exclusively to members of the University of Cambridge who authenticate
          via Cambridge University SSO.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          TriposPro is a study tool for Cambridge Computer Science Tripos
          students. It provides access to past exam questions, mark statistics,
          AI-powered search and chat, discussion threads, college leaderboards,
          and related academic resources. The Service also exposes an MCP
          (Model Context Protocol) API for integration with external AI tools.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must hold a valid University of Cambridge identity (CRSid) to use
          this Service. Access is restricted to current students, staff, and
          alumni who can authenticate through Cambridge Microsoft Entra ID.
        </p>

        <h2>4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Share exam solutions in violation of university regulations</li>
          <li>
            Use the Service to facilitate academic dishonesty or plagiarism
          </li>
          <li>Harass other users through comments or voting</li>
          <li>
            Attempt to access accounts or data belonging to other users
          </li>
          <li>
            Scrape, crawl, or bulk-download content from the Service
          </li>
          <li>
            Interfere with or disrupt the Service or its infrastructure
          </li>
          <li>
            Abuse the voting system (e.g. targeted downvoting)
          </li>
        </ul>

        <h2>5. User Content</h2>
        <p>
          You retain ownership of content you post (comments, answer notes). By
          posting, you grant TriposPro a non-exclusive licence to display that
          content within the Service. You may delete your comments at any time
          (they will be hidden from view). Administrators may remove content that
          violates these terms.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          Exam questions and examiner reports are the property of the University
          of Cambridge. TriposPro displays this content for educational purposes
          under fair dealing provisions. The Service itself (code, design,
          AI-generated content) is the property of its developers.
        </p>

        <h2>7. AI Features</h2>
        <p>
          The RAG chatbot, AI-generated topic tags, course insights, and similar
          questions are provided for informational purposes only. They may
          contain errors and should not be relied upon as authoritative academic
          guidance. Chat messages you send are processed by OpenAI.
        </p>

        <h2>8. Availability</h2>
        <p>
          The Service is provided &quot;as is&quot; without warranty. We do not
          guarantee uptime, accuracy of data, or preservation of user content.
          We reserve the right to modify or discontinue the Service at any time.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate your access for violation of these terms.
          You may stop using the Service at any time and request deletion of your
          data.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We may update these terms. Continued use of the Service after changes
          constitutes acceptance. Material changes will be communicated via the
          Service.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these terms, contact{" "}
          <a href="mailto:of284@cam.ac.uk">of284@cam.ac.uk</a>.
        </p>

        <div className="mt-8 border-t pt-4">
          <Link
            href="/privacy-policy"
            className="text-primary text-sm hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
