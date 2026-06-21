import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#5e17eb] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="inline-block">
            <img
              src="/logos/TEXT_LOGO.png"
              alt="Beeston Hill Community Association"
              className="mb-6 h-20 w-auto transition hover:opacity-90"
            />
          </Link>

          <p className="leading-relaxed text-white/80">
            A resident-led community organisation supporting local events,
            volunteering, community action and stronger connections across
            Beeston Hill.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-black">Explore</h3>

          <nav className="grid gap-3 text-white/80">
            <Link to="/events" className="transition hover:text-[#ff914d]">
              Events
            </Link>
            <Link to="/news" className="transition hover:text-[#ff914d]">
              News
            </Link>
            <Link to="/action-plan" className="transition hover:text-[#ff914d]">
              Action Plan
            </Link>
            <Link to="/volunteer" className="transition hover:text-[#ff914d]">
              Volunteer
            </Link>
            <Link to="/useful-information" className="transition hover:text-[#ff914d]">
              Useful Information
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-black">Contact</h3>

          <div className="grid gap-3 text-white/80">
            <p>Beeston Hill, Leeds</p>

            <a
              href="mailto:contact@beestonhill.org.uk"
              className="transition hover:text-[#ff914d]"
            >
              contact@beestonhill.org.uk
            </a>

            <Link to="/contact" className="transition hover:text-[#ff914d]">
              Contact us
            </Link>

            <a
              href="https://www.facebook.com/groups/945725003377339/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#ff914d]"
              aria-label="Facebook group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-white"
              >
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-black">Support & legal</h3>

          <nav className="grid gap-3 text-white/80">
            <Link to="/privacy-policy" className="transition hover:text-[#ff914d]">
              Privacy Policy
            </Link>

            <Link to="/cookie-policy" className="transition hover:text-[#ff914d]">
              Cookie Policy
            </Link>

            <Link to="/photo-credits" className="transition hover:text-[#ff914d]">
              Photo Credits
            </Link>
          </nav>

          <Button
            href="https://donorbox.org/embed/beeston-hill-community-association-838411?"
            variant="orange"
            className="mt-6 w-fit px-5 py-3 text-sm"
          >
            Donate
          </Button>
        </div>
      </div>

      <div className="border-t border-white/20 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-sm text-white/60 md:flex-row md:text-left">
     <p>
  © {new Date().getFullYear()} Beeston Hill Community Association. All rights reserved.
</p>

<p className="text-white/40">
  Website support by J Sandiman.
</p>

          <p>Beeston Hill, Leeds</p>
        </div>
      </div>
    </footer>
  );
}