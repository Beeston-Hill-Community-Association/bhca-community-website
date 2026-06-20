import Button from "../components/ui/Button";
import SEO from "../components/seo/SEO";


export default function Contact() {
  return (
    <>
    <SEO
  title="Contact"
  description="Contact Beeston Hill Community Association about events, volunteering, community projects, partnerships and local updates."
/>
    
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            Contact us
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Get in touch with BHCA
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Contact us about events, volunteering, local priorities,
            partnerships or community ideas.
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-black text-[#171717]">
              We’d love to hear from you
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Whether you’re a resident, volunteer, local group or partner
              organisation, please get in touch.
            </p>

            <div className="grid gap-5">
              <div className="rounded-3xl bg-[#faf8ff] p-6">
                <h3 className="mb-2 text-xl font-black text-[#171717]">
                  Location
                </h3>
                <p className="text-gray-600">Beeston Hill, Leeds</p>
              </div>

              <div className="rounded-3xl bg-[#faf8ff] p-6">
  <h3 className="mb-2 text-xl font-black text-[#171717]">
    Email
  </h3>

  <a
    href="mailto:contact@beestonhill.org.uk"
    className="font-semibold text-[#5e17eb] hover:text-[#ff914d]"
  >
    contact@beestonhill.org.uk
  </a>
</div>

              <div className="rounded-3xl bg-[#faf8ff] p-6">
  <h3 className="mb-4 text-xl font-black text-[#171717]">
    Social media
  </h3>

  <a
    href="https://www.facebook.com/groups/945725003377339/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 font-semibold text-[#5e17eb] transition hover:text-[#ff914d]"
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5e17eb] text-sm font-black text-white">
      f
    </span>
    Follow us on Facebook
  </a>
</div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#faf8ff] p-8 shadow-sm">
            <h3 className="mb-4 text-3xl font-black text-[#171717]">
              Quick links
            </h3>

            <p className="mb-8 text-gray-600">
              Use the links below to volunteer, sign up for updates or share a
              local priority.
            </p>

            <div className="grid gap-4">
              <Button href="https://forms.gle/HdPxKtQfXRHJ3AH17">
                Volunteer form
              </Button>

              <Button
                href="https://forms.gle/yYvJKdutoiwjJrdT9"
                variant="orange"
              >
                Sign up for updates
              </Button>

              <Button to="/action-plan" variant="outline">
                View action plan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}