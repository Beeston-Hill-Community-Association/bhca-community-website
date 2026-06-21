import SEO from "../components/seo/SEO";

export default function CookiePolicy() {
  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Cookie Policy for Beeston Hill Community Association."
      />

      <div className="bg-white">
        <section className="bg-[#5e17eb] py-24 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-5xl font-black md:text-6xl">
              Cookie Policy
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
            <h2>What are cookies?</h2>

            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help websites function correctly and provide
              information about how a website is used.
            </p>

            <h2>Cookies used on this website</h2>

            <h3>Essential cookies</h3>

            <p>
              We use cookies and similar technologies that are necessary for the
              operation, security and performance of this website.
            </p>

            <p>
              This may include services provided by Cloudflare to protect and
              improve the reliability of the website.
            </p>

            <h3>Analytics</h3>

            <p>
              We use Cloudflare Web Analytics to understand how visitors use our
              website.
            </p>

            <p>
              Cloudflare Web Analytics is designed to be privacy-friendly and
              does not use cross-site tracking cookies.
            </p>

            <p>Information collected may include:</p>

            <ul>
              <li>Pages visited</li>
              <li>General location information</li>
              <li>Browser and device information</li>
              <li>Referring websites</li>
            </ul>

            <h2>Managing cookies</h2>

            <p>
              Most web browsers allow you to control cookies through browser
              settings. You can block or delete cookies at any time.
            </p>

            <h2>Third-party services</h2>

            <p>
              Links on this website may direct users to third-party services
              such as Facebook, Google Forms or other external websites.
            </p>

            <p>
              These services may use their own cookies and privacy practices.
            </p>

            <h2>Contact us</h2>

            <p>
              If you have questions about this Cookie Policy please contact:
              <br />
              <strong>contact@beestonhill.org.uk</strong>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}