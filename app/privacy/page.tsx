import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Your Firm Name',
  description:
    'Review the privacy policy template for Your Firm Name. Replace placeholders with your firm-specific details.',
}

/**
 * PrivacyPolicyPage — Template privacy policy page.
 *
 * AI customization notes:
 * - Replace placeholders like [YOUR FIRM NAME] and [YOUR STATE/COUNTRY] before launch.
 * - Confirm legal requirements with qualified counsel for your jurisdiction and industry.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">Effective Date: [MONTH DAY, YEAR]</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Template compliance notice: keep visible until legal review is complete. */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
              <h2 className="text-xl font-semibold mb-2">Template Notice (Required)</h2>
              <p className="text-base">
                This privacy policy is a template and must be reviewed and customized by legal counsel
                before use. Do not publish without confirming compliance in your jurisdiction.
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>
                [YOUR FIRM NAME] ("we," "us," or "our") values your privacy. This policy explains
                how we collect, use, disclose, and safeguard your information when you visit
                [YOUR WEBSITE URL] or engage with our services.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We may collect information that you provide directly, such as when you fill out a
                contact form, schedule a consultation, or request resources.
              </p>
              <ul>
                <li>
                  <strong>Contact details:</strong> name, email, phone number, company, role.
                </li>
                <li>
                  <strong>Inquiry details:</strong> service needs, goals, and project notes.
                </li>
                <li>
                  <strong>Usage data:</strong> device information, browser type, IP address, and
                  analytics events.
                </li>
              </ul>

              <h2>How We Use Information</h2>
              <p>We use collected data to:</p>
              <ul>
                <li>Respond to inquiries and provide services.</li>
                <li>Improve the website experience and performance.</li>
                <li>Send updates you requested or consented to receive.</li>
                <li>Comply with legal and contractual obligations.</li>
              </ul>

              <h2>How We Share Information</h2>
              <p>
                We do not sell your personal information. We may share data with trusted service
                providers who assist with analytics, hosting, CRM, or communications, under
                confidentiality obligations.
              </p>

              <h2>Data Retention</h2>
              <p>
                We retain personal information only as long as needed for the purposes described
                here, unless a longer retention period is required by law.
              </p>

              <h2>Your Rights and Choices</h2>
              <p>
                Depending on your location (for example, [YOUR STATE/COUNTRY]), you may have rights
                to access, correct, or delete your personal information. Contact us using the details
                below to exercise your rights.
              </p>

              <h2>Cookies and Analytics</h2>
              <p>
                We use cookies and similar technologies to understand site usage and improve our
                services. You can control cookies through your browser settings. If you use
                third-party analytics tools, list them here (e.g., Google Analytics, Plausible).
              </p>

              <h2>Security</h2>
              <p>
                We implement reasonable technical and organizational measures to protect your
                information. No method of transmission or storage is completely secure, so we
                cannot guarantee absolute security.
              </p>

              <h2>Third-Party Links</h2>
              <p>
                Our website may link to third-party sites. We are not responsible for their privacy
                practices and encourage you to review their policies.
              </p>

              <h2>Contact Us</h2>
              {/* Placeholder block: replace with firm-specific contact details. */}
              <p>
                If you have questions about this policy, contact us at:
                <br />
                <strong>[YOUR FIRM NAME]</strong>
                <br />
                [YOUR STREET ADDRESS]
                <br />
                [YOUR CITY, STATE/REGION, POSTAL CODE]
                <br />
                [YOUR CONTACT EMAIL]
                <br />
                [YOUR PHONE NUMBER]
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
