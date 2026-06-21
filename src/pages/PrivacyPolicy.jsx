import SEO from "../components/seo/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Beeston Hill Community Association."
      />

      <div className="bg-white">
        <section className="bg-[#5e17eb] py-24 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-5xl font-black md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 text-lg text-white/80">
              Last updated: June 2026
            </p>
          </div>
        </section>

        <section className="py-24">
          <div
  className="
    mx-auto
    max-w-4xl
    px-6
    text-gray-700

    [&_h2]:mt-10
    [&_h2]:mb-4
    [&_h2]:text-3xl
    [&_h2]:font-black
    [&_h2]:text-[#171717]

    [&_h3]:mt-8
    [&_h3]:mb-3
    [&_h3]:text-xl
    [&_h3]:font-black
    [&_h3]:text-[#171717]

    [&_p]:mb-6
    [&_p]:leading-relaxed

    [&_ul]:mb-6
    [&_ul]:list-disc
    [&_ul]:pl-6

    [&_li]:mb-2
  "
>
            <h2>Who we are</h2>
            <p>
              Beeston Hill Community Association (BHCA) is a community
              organisation serving residents of Beeston Hill, Leeds.
            </p>

            <p>
              This Privacy Policy explains how we collect, use and protect your
              personal information when you use our website.
            </p>

            <h2>Information we collect</h2>

            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Information submitted through contact forms</li>
              <li>Volunteer and newsletter sign-up information</li>
              <li>Information you choose to provide to us</li>
            </ul>

            <h2>How we use your information</h2>

            <ul>
              <li>Respond to enquiries</li>
              <li>Provide information about community activities and events</li>
              <li>Manage volunteer applications</li>
              <li>Send updates where requested</li>
              <li>Improve community services and engagement</li>
            </ul>

            <h2>Lawful basis for processing</h2>

            <p>
              We process personal information under consent, legitimate
              interests and legal obligations where applicable.
            </p>

            <h2>How we store your information</h2>

            <p>
              We take reasonable steps to protect personal information from
              unauthorised access, disclosure or misuse.
            </p>

            <p>
              Information may be processed using trusted providers including:
            </p>

            <ul>
              <li>Cloudflare (website hosting and security)</li>
              <li>Resend (contact form email delivery)</li>
              <li>Google Forms (where applicable)</li>
            </ul>

            <h2>Sharing information</h2>

            <p>
              We do not sell personal information. Information is only shared
              where necessary to operate services, comply with legal
              obligations, or protect individuals and the community.
            </p>

            <h2>Data retention</h2>

            <p>
              Information is retained only for as long as necessary to fulfil
              the purpose for which it was collected.
            </p>

            <h2>Your rights</h2>

            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion where appropriate</li>
              <li>Object to certain processing activities</li>
              <li>Withdraw consent where applicable</li>
            </ul>

            <h2>Contact us</h2>

            <p>
              For privacy-related enquiries please contact:
              <br />
              <strong>contact@beestonhill.org.uk</strong>
            </p>

            <h2>Changes to this policy</h2>

            <p>
              We may update this Privacy Policy from time to time. Updates will
              be published on this page.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}