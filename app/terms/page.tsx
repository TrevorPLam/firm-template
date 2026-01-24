import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `Terms of Service | ${siteConfig.name}`,
  description:
    'Review the terms of service template for Your Firm Name. Replace placeholders with your firm-specific details.',
}

/**
 * TermsOfServicePage — Template terms of service page.
 *
 * AI customization notes:
 * - Replace placeholders like [YOUR FIRM NAME], [YOUR STATE/COUNTRY], and [BILLING TERMS].
 * - Confirm service-specific clauses with legal counsel before publishing.
 */
export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
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
                These terms are a template and must be reviewed and customized by legal counsel
                before use. Do not publish without confirming compliance in your jurisdiction.
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>
                These Terms of Service ("Terms") govern your use of [YOUR WEBSITE URL] and services
                provided by [YOUR FIRM NAME] ("we," "us," or "our"). By accessing or using our site,
                you agree to these Terms.
              </p>

              <h2>Services</h2>
              <p>
                We provide professional services as outlined in proposals, statements of work, or
                service agreements. Specific deliverables, timelines, and scope are defined in those
                documents.
              </p>

              <h2>Client Responsibilities</h2>
              <ul>
                <li>Provide accurate and timely information required for services.</li>
                <li>Review and approve deliverables within agreed timelines.</li>
                <li>Use deliverables in accordance with applicable laws and regulations.</li>
              </ul>

              <h2>Fees and Payment</h2>
              <p>
                Fees are described in your proposal or agreement. Payment terms are [BILLING TERMS],
                unless otherwise specified in writing. Late payments may be subject to [LATE FEE POLICY].
              </p>

              <h2>Intellectual Property</h2>
              <p>
                Unless stated otherwise, [YOUR FIRM NAME] retains ownership of pre-existing materials,
                templates, and tooling. Upon full payment, the client receives a license to use
                deliverables for their intended business purposes.
              </p>

              <h2>Confidentiality</h2>
              <p>
                Both parties agree to maintain the confidentiality of non-public information disclosed
                during the engagement, subject to any written confidentiality agreement.
              </p>

              <h2>Warranties and Disclaimers</h2>
              <p>
                Services are provided on an "as-is" basis. We disclaim all warranties, express or
                implied, to the fullest extent permitted by law.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, [YOUR FIRM NAME] will not be liable for any
                indirect, incidental, special, or consequential damages arising from your use of our
                services.
              </p>

              <h2>Termination</h2>
              <p>
                Either party may terminate an engagement with written notice, subject to the terms
                in the applicable agreement. Fees for work completed remain payable.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms are governed by the laws of [YOUR STATE/COUNTRY], without regard to
                conflict of law principles.
              </p>

              <h2>Contact Us</h2>
              {/* Placeholder block: replace with firm-specific contact details. */}
              <p>
                If you have questions about these Terms, contact us at:
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
