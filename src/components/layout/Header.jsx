import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();

function handleSearchSubmit(e) {
  e.preventDefault();

  const trimmedQuery = searchQuery.trim();

  if (!trimmedQuery) return;

  navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  setSearchQuery("");
  setMobileOpen(false);
}

  const navItems = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "News", path: "/news" },
  { name: "Action Plan", path: "/action-plan" },
  { name: "Useful Info", path: "/useful-information" },
  { name: "Contact", path: "/contact" },
];

const mobileNavItems = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "News", path: "/news" },
  { name: "Action Plan", path: "/action-plan" },
  { name: "Volunteer", path: "/volunteer" },
  { name: "Useful Information", path: "/useful-information" },
  { name: "Contact", path: "/contact" },
];


  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
        <div className="flex justify-start">
          {!isHomePage && (
            <Link to="/" className="flex items-center">
              <img
                src="/logos/TEXT_LOGO.png"
                alt="BHCA"
                className="h-20 w-auto"
              />
            </Link>
          )}
        </div>

        <nav className="hidden items-center justify-center gap-5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `font-semibold transition ${
                  isActive
                    ? "text-[#5e17eb]"
                    : "text-[#171717] hover:text-[#ff914d]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        

        <div className="hidden items-center justify-end gap-3 md:flex">
          <Button
            href="https://forms.gle/HdPxKtQfXRHJ3AH17"
            variant="outline"
            className="px-5 py-3 text-sm"
          >
            Volunteer
          </Button>

          <Button
            href="https://donorbox.org/embed/beeston-hill-community-association-838411?"
            variant="orange"
            className="px-5 py-3 text-sm"
          >
            Donate
          </Button>
        </div>

        <div className="col-start-3 flex justify-end md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#faf8ff]"
            aria-label="Open menu"
          >
            <div className="space-y-1">
              <div className="h-0.5 w-5 bg-[#171717]" />
              <div className="h-0.5 w-5 bg-[#171717]" />
              <div className="h-0.5 w-5 bg-[#171717]" />
            </div>
          </button>
        </div>
      </div>
      <div className="hidden bg-white px-6 pb-4 md:block">
  <form onSubmit={handleSearchSubmit} className="mx-auto max-w-7xl">
  <div className="flex items-center rounded-2xl bg-[#faf8ff] px-5 py-4 shadow-sm">
    <Search size={18} className="text-[#5e17eb]" />

    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search news, events, useful information..."
      className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
    />
  </div>
</form>
</div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-6 py-6 md:hidden">
          <nav className="grid gap-5">
            {mobileNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-semibold transition ${
                    isActive
                      ? "text-[#5e17eb]"
                      : "text-[#171717] hover:text-[#ff914d]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <form onSubmit={handleSearchSubmit} className="mt-2">
  <div className="flex items-center rounded-xl bg-[#faf8ff] px-4 py-3 ring-1 ring-black/5">
    <Search size={18} className="text-[#5e17eb]" />

    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search the site"
      className="ml-3 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400"
    />
  </div>
</form>

            <div className="mt-4 grid gap-3">
              <Button
                href="https://forms.gle/HdPxKtQfXRHJ3AH17"
                variant="outline"
                className="w-full"
              >
                Volunteer
              </Button>

              <Button
                href="https://donorbox.org/embed/beeston-hill-community-association-838411?"
                variant="orange"
                className="w-full"
              >
                Donate
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}