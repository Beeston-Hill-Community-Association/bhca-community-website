import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { supabase } from "../lib/supabaseClient";

const searchSynonyms = {
  family: [
    "family",
    "families",
    "children",
    "child",
    "parents",
    "carers",
    "kids",
    "youth",
    "young people",
  ],
  families: [
    "family",
    "families",
    "children",
    "child",
    "parents",
    "carers",
    "kids",
    "youth",
    "young people",
  ],
  children: [
    "children",
    "child",
    "kids",
    "family",
    "families",
    "parents",
    "carers",
    "youth",
    "young people",
  ],
  youth: ["youth", "young people", "teenagers", "teens", "children", "kids"],
  "young people": ["young people", "youth", "teenagers", "teens", "children"],
  food: ["food", "meal", "meals", "lunch", "picnic", "pantry", "vegetarian"],
  help: ["help", "support", "advice", "services", "information"],
  support: ["support", "help", "advice", "services", "information"],
  services: ["services", "support", "help", "advice", "information"],
  volunteer: ["volunteer", "volunteering", "help", "support"],
  volunteering: ["volunteer", "volunteering", "help", "support"],
  clean: ["clean", "cleanup", "clean-up", "litter", "environment"],
  health: ["health", "wellbeing", "well-being", "support"],
};

function getSearchTerms(query) {
  const baseTerms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const phrase = query.toLowerCase().trim();

  const expanded = new Set([phrase, ...baseTerms]);

  baseTerms.forEach((term) => {
    if (searchSynonyms[term]) {
      searchSynonyms[term].forEach((word) => expanded.add(word));
    }
  });

  if (searchSynonyms[phrase]) {
    searchSynonyms[phrase].forEach((word) => expanded.add(word));
  }

  return Array.from(expanded);
}

function includesText(value, terms) {
  const text = String(value || "").toLowerCase();
  return terms.some((term) => text.includes(term));
}

function resultMatches(fields, terms) {
  return fields.some((field) => includesText(field, terms));
}

function excerpt(text, fallback = "") {
  const value = text || fallback || "";
  return value.length > 180 ? `${value.slice(0, 180)}...` : value;
}

function dateValue(date) {
  if (!date) return 0;
  const time = new Date(date).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function isPdf(url) {
  return url?.toLowerCase().endsWith(".pdf");
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState({
    news: [],
    events: [],
    localEvents: [],
    media: [],
    usefulCategories: [],
    usefulCards: [],
    usefulLinks: [],
  });
  const [loading, setLoading] = useState(true);

  const cleanQuery = query.trim().toLowerCase();
  const searchTerms = useMemo(() => getSearchTerms(cleanQuery), [cleanQuery]);

  useEffect(() => {
    async function loadSearchData() {
      setLoading(true);

      const [
        newsResult,
        eventsResult,
        localEventsResult,
        mediaResult,
        usefulCategoriesResult,
        usefulCardsResult,
        usefulLinksResult,
      ] = await Promise.all([
        supabase.from("newsletters").select("*"),
        supabase.from("events").select("*"),
        supabase.from("local_events").select("*").eq("status", "published"),
        supabase.from("media").select("*"),
        supabase.from("useful_info_categories").select("*"),
        supabase.from("useful_info_cards").select("*"),
        supabase.from("useful_info_links").select("*"),
      ]);

      setData({
        news: newsResult.data || [],
        events: eventsResult.data || [],
        localEvents: localEventsResult.data || [],
        media: mediaResult.data || [],
        usefulCategories: usefulCategoriesResult.data || [],
        usefulCards: usefulCardsResult.data || [],
        usefulLinks: usefulLinksResult.data || [],
      });

      setLoading(false);
    }

    loadSearchData();
  }, []);

  const results = useMemo(() => {
    if (cleanQuery.length < 2) return [];

    const output = [];

    data.news.forEach((item) => {
      const image = data.media.find(
        (mediaItem) => mediaItem.id === item.image_id
      );

      if (
        resultMatches(
          [item.title, item.excerpt, item.content, item.category],
          searchTerms
        )
      ) {
        output.push({
          id: `news-${item.id}`,
          type: item.category ? `News • ${item.category}` : "News",
          title: item.title,
          description: excerpt(item.excerpt, item.content),
          url: item.slug ? `/news/${item.slug}` : "/news",
          imageUrl: image?.url || null,
          meta: "BHCA",
          sortDate: item.published_at || item.created_at,
        });
      }
    });

    data.events.forEach((item) => {
      if (
        resultMatches(
          [
            item.title,
            item.description,
            item.full_description,
            item.venue,
            item.display_date,
            item.category,
            item.event_type,
          ],
          searchTerms
        )
      ) {
        output.push({
          id: `event-${item.id}`,
          type: item.category ? `BHCA Event • ${item.category}` : "BHCA Event",
          title: item.title,
          description: excerpt(item.description, item.full_description),
          url: item.slug ? `/events/${item.slug}` : "/events",
          imageUrl: item.image_url || null,
          meta: item.venue || "BHCA",
          sortDate: item.date,
        });
      }
    });

    data.localEvents.forEach((item) => {
      if (
        resultMatches(
          [
            item.title,
            item.description,
            item.events_category,
            item.location,
            item.source,
            item.display_date,
          ],
          searchTerms
        )
      ) {
        output.push({
          id: `local-${item.id}`,
          type: item.events_category
            ? `Local Event • ${item.events_category}`
            : "Local Event",
          title: item.title,
          description: excerpt(item.description, item.location),
          url: "/events",
          imageUrl:
            item.flyer_url && !isPdf(item.flyer_url) ? item.flyer_url : null,
          meta: item.source || "Local organisation",
          sortDate: item.event_date || item.created_at,
        });
      }
    });

    data.media
      .filter((item) => item.featured)
      .forEach((item) => {
        if (resultMatches([item.caption, item.event_name], searchTerms)) {
          output.push({
            id: `media-${item.id}`,
            type: "Gallery",
            title: item.event_name || "Gallery photo",
            description: item.caption || "Photo from the BHCA gallery.",
            url: "/gallery",
            imageUrl: item.url,
            meta: item.event_name || "BHCA Gallery",
            sortDate: item.created_at,
          });
        }
      });

    data.usefulCategories.forEach((category) => {
      if (
        category.is_active !== false &&
        resultMatches([category.name, category.description], searchTerms)
      ) {
        output.push({
          id: `useful-category-${category.id}`,
          type: "Useful Information",
          title: category.name,
          description: category.description,
          url: "/useful-information",
          imageUrl: null,
          meta: "Useful Information",
          sortDate: null,
        });
      }
    });

    data.usefulCards.forEach((card) => {
      const category = data.usefulCategories.find(
        (item) => item.id === card.category_id
      );

      if (
        card.is_active !== false &&
        resultMatches(
          [card.title, category?.name, category?.description],
          searchTerms
        )
      ) {
        output.push({
          id: `useful-card-${card.id}`,
          type: "Useful Information",
          title: card.title,
          description: category?.name || "Useful local information.",
          url: "/useful-information",
          imageUrl: null,
          meta: category?.name || "Useful Information",
          sortDate: null,
        });
      }
    });

    data.usefulLinks.forEach((link) => {
      const card = data.usefulCards.find((item) => item.id === link.card_id);
      const category = data.usefulCategories.find(
        (item) => item.id === card?.category_id
      );

      if (
        link.is_active !== false &&
        resultMatches(
          [
            link.label,
            link.url,
            link.phone_number,
            link.email_address,
            card?.title,
            category?.name,
          ],
          searchTerms
        )
      ) {
        output.push({
          id: `useful-link-${link.id}`,
          type: "Useful Information",
          title: link.label,
          description: card?.title || category?.name || "Useful local contact.",
          url: "/useful-information",
          imageUrl: null,
          meta: category?.name || "Useful Information",
          sortDate: null,
        });
      }
    });

    return output.sort((a, b) => dateValue(b.sortDate) - dateValue(a.sortDate));
  }, [cleanQuery, searchTerms, data]);

  async function handleSubmit(e) {
  e.preventDefault();

  const trimmedQuery = query.trim();

  if (!trimmedQuery) return;

  await supabase.from("search_logs").insert([
    {
      query: trimmedQuery,
      results_count: results.length,
    },
  ]);

  setSearchParams({ q: trimmedQuery });
}

  return (
    <div>
      <SEO
        title="Search"
        description="Search news, events, local activities, gallery photos and useful information from Beeston Hill Community Association."
      />

      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Search
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Search the BHCA website
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Find news, events, local activities, gallery photos and useful
            information.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <form
            onSubmit={handleSubmit}
            className="mb-10 flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:flex-row"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for family services, youth, food, volunteering..."
              className="flex-1 rounded-xl border p-4 text-lg"
              autoFocus
            />

            <button
              type="submit"
              className="rounded-full bg-[#5e17eb] px-8 py-4 font-bold text-white"
            >
              Search
            </button>
          </form>

          {cleanQuery.length < 2 ? (
            <div className="rounded-3xl bg-white p-8 text-gray-600 shadow-sm">
              Type at least two characters to search.
            </div>
          ) : loading ? (
            <div className="rounded-3xl bg-white p-8 text-gray-600 shadow-sm">
              Loading search...
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-gray-600 shadow-sm">
              No results found for “{query}”.
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="grid gap-5 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:grid-cols-[160px_1fr]"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-40 w-full rounded-xl object-cover object-top md:h-full"
                    />
                  ) : (
                    <div className="hidden rounded-xl bg-[#faf8ff] md:block" />
                  )}

                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#ff914d]">
                      {item.type}
                    </p>

                    {item.meta && (
                      <p className="mb-2 text-sm font-bold text-[#5e17eb]">
                        {item.meta}
                      </p>
                    )}

                    <h2 className="mb-2 text-xl font-black text-[#171717]">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-gray-600">{item.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}