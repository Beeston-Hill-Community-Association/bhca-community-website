import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Button from "../ui/Button";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchData, setSearchData] = useState({
    news: [],
    events: [],
    localEvents: [],
    usefulCategories: [],
    usefulCards: [],
    usefulLinks: [],
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    async function loadHeaderSearchData() {
      const [
        newsResult,
        eventsResult,
        localEventsResult,
        usefulCategoriesResult,
        usefulCardsResult,
        usefulLinksResult,
      ] = await Promise.all([
        supabase
          .from("newsletters")
          .select("id,title,slug,excerpt,category"),
        supabase
          .from("events")
          .select("id,title,slug,description,venue,category"),
        supabase
          .from("local_events")
          .select("id,title,description,location,source,status")
          .eq("status", "published"),
        supabase
          .from("useful_info_categories")
          .select("id,name,description,is_active"),
        supabase
          .from("useful_info_cards")
          .select("id,title,category_id,is_active"),
        supabase
          .from("useful_info_links")
          .select("id,label,card_id,url,phone_number,email_address,is_active"),
      ]);

      setSearchData({
        news: newsResult.data || [],
        events: eventsResult.data || [],
        localEvents: localEventsResult.data || [],
        usefulCategories: usefulCategoriesResult.data || [],
        usefulCards: usefulCardsResult.data || [],
        usefulLinks: usefulLinksResult.data || [],
      });
    }

    loadHeaderSearchData();
  }, []);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length < 2) return [];

    const matches = [];

    function includes(value) {
      return String(value || "").toLowerCase().includes(query);
    }

    searchData.news.forEach((item) => {
      if (
        includes(item.title) ||
        includes(item.excerpt) ||
        includes(item.category)
      ) {
        matches.push({
          id: `news-${item.id}`,
          type: item.category ? `News • ${item.category}` : "News",
          title: item.title,
          description: item.excerpt,
          url: item.slug ? `/news/${item.slug}` : "/news",
        });
      }
    });

    searchData.events.forEach((item) => {
      if (
        includes(item.title) ||
        includes(item.description) ||
        includes(item.venue) ||
        includes(item.category)
      ) {
        matches.push({
          id: `event-${item.id}`,
          type: item.category ? `Event • ${item.category}` : "Event",
          title: item.title,
          description: item.description || item.venue,
          url: item.slug ? `/events/${item.slug}` : "/events",
        });
      }
    });

    searchData.localEvents.forEach((item) => {
      if (
        includes(item.title) ||
        includes(item.description) ||
        includes(item.location) ||
        includes(item.source)
      ) {
        matches.push({
          id: `local-${item.id}`,
          type: "Local Event",
          title: item.title,
          description: item.location || item.source,
          url: "/events",
        });
      }
    });

    searchData.usefulCategories.forEach((item) => {
      if (
        item.is_active !== false &&
        (includes(item.name) || includes(item.description))
      ) {
        matches.push({
          id: `useful-category-${item.id}`,
          type: "Useful Information",
          title: item.name,
          description: item.description,
          url: "/useful-information",
        });
      }
    });

    searchData.usefulCards.forEach((card) => {
      const category = searchData.usefulCategories.find(
        (item) => item.id === card.category_id
      );

      if (
        card.is_active !== false &&
        (includes(card.title) ||
          includes(category?.name) ||
          includes(category?.description))
      ) {
        matches.push({
          id: `useful-card-${card.id}`,
          type: "Useful Information",
          title: card.title,
          description: category?.name || "Useful local information",
          url: "/useful-information",
        });
      }
    });

    searchData.usefulLinks.forEach((link) => {
      const card = searchData.usefulCards.find(
        (item) => item.id === link.card_id
      );
      const category = searchData.usefulCategories.find(
        (item) => item.id === card?.category_id
      );

      if (
        link.is_active !== false &&
        (includes(link.label) ||
          includes(link.url) ||
          includes(link.phone_number) ||
          includes(link.email_address) ||
          includes(card?.title) ||
          includes(category?.name))
      ) {
        matches.push({
          id: `useful-link-${link.id}`,
          type: "Useful Information",
          title: link.label,
          description: card?.title || category?.name || "Useful local contact",
          url: "/useful-information",
        });
      }
    });

    return matches.slice(0, 5);
  }, [searchQuery, searchData]);

  function handleSearchSubmit(e) {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setMobileOpen(false);
  }

  function goToSuggestion(url) {
    navigate(url);
    setSearchQuery("");
    setShowSuggestions(false);
    setMobileOpen(false);
  }

  function seeAllResults() {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setMobileOpen(false);
  }

  const renderSearchBox = (mobile = false) => (
    <form onSubmit={handleSearchSubmit} className="relative">
      <div
        className={`flex items-center ${
          mobile
            ? "rounded-xl bg-[#faf8ff] px-4 py-3 ring-1 ring-black/5"
            : "rounded-2xl bg-[#faf8ff] px-5 py-4 shadow-sm"
        }`}
      >
        <Search size={18} className="text-[#5e17eb]" />

        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={
            mobile
              ? "Search the site"
              : "Search news, events, useful information..."
          }
          className={`ml-3 flex-1 bg-transparent outline-none placeholder:text-gray-400 ${
            mobile ? "text-base" : "text-sm"
          }`}
        />
      </div>

      {showSuggestions && searchQuery.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-[999] mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          {suggestions.length === 0 ? (
            <div className="p-4 text-sm font-semibold text-gray-500">
              No quick matches found.
            </div>
          ) : (
            <>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToSuggestion(item.url)}
                  className="block w-full border-b border-gray-100 p-4 text-left transition hover:bg-[#faf8ff]"
                >
                  <p className="text-xs font-black uppercase tracking-wide text-[#ff914d]">
                    {item.type}
                  </p>

                  <p className="font-black text-[#171717]">{item.title}</p>

                  {item.description && (
                    <p className="line-clamp-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  )}
                </button>
              ))}

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={seeAllResults}
                className="w-full bg-[#5e17eb] px-4 py-3 text-left text-sm font-black text-white transition hover:bg-[#ff914d]"
              >
                See all results for “{searchQuery.trim()}”
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );

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
        <div className="mx-auto max-w-7xl">{renderSearchBox(false)}</div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-6 py-6 md:hidden">
          <nav className="grid gap-5">
            {mobileNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                onClick={() => {
                  setMobileOpen(false);
                  setShowSuggestions(false);
                }}
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

            <div className="mt-2">{renderSearchBox(true)}</div>

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