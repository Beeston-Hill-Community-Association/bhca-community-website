import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Trash2,
  Siren,
  Home,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Users,
  HeartHandshake,
  Repeat,
  Recycle,
} from "lucide-react";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";

const iconMap = {
  siren: Siren,
  phone: Phone,
  recycle: Recycle,
  "alert-triangle": AlertTriangle,
  repeat: Repeat,
  trash: Trash2,
  home: Home,
  mail: Mail,
  users: Users,
  "heart-handshake": HeartHandshake,
};

const filters = [
  "All",
  "Emergency",
  "Council",
  "Waste & Recycling",
  "Community",
  "Useful Numbers",
];

export default function TestPage() {
  const [sections, setSections] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsefulInfo();
  }, []);

  async function loadUsefulInfo() {
    setLoading(true);

    const { data, error } = await supabase
      .from("useful_info_categories")
      .select(`
        *,
        useful_info_cards (
          *,
          useful_info_links (*)
        )
      `)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("sort_order", {
        foreignTable: "useful_info_cards",
        ascending: true,
      })
      .order("sort_order", {
        foreignTable: "useful_info_cards.useful_info_links",
        ascending: true,
      });

    if (error) {
      console.error("Useful info error:", error);
      setSections([]);
    } else {
      setSections(data || []);
    }

    setLoading(false);
  }

  const filteredSections = useMemo(() => {
    if (activeFilter === "All") return sections;

    return sections.filter((section) => {
      const name = section.name?.toLowerCase() || "";

      if (activeFilter === "Emergency") {
        return name.includes("emergency");
      }

      if (activeFilter === "Council") {
        return (
          name.includes("council") ||
          name.includes("local issue") ||
          section.useful_info_cards?.some((card) =>
            card.title?.toLowerCase().includes("council")
          )
        );
      }

      if (activeFilter === "Waste & Recycling") {
        return name.includes("recycling") || name.includes("waste");
      }

      if (activeFilter === "Community") {
        return name.includes("community");
      }

      if (activeFilter === "Useful Numbers") {
        return (
          name.includes("useful numbers") ||
          section.useful_info_cards?.some((card) =>
            card.useful_info_links?.some(
              (link) => link.link_type === "phone"
            )
          )
        );
      }

      return true;
    });
  }, [activeFilter, sections]);

  return (
    <>
<SEO
  title="Useful Information"
  description="Useful local information, services, contacts and support for residents in Beeston Hill."
/>    
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Useful information
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Quick links for local residents
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Find recycling information, report local issues, access support
            services and useful contacts for Beeston Hill and nearby areas.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "bg-[#5e17eb] text-white"
                    : "bg-white text-[#171717] hover:bg-[#eee7ff]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#faf8ff] pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-lg font-semibold text-gray-600">
              Loading useful information...
            </p>
          ) : filteredSections.length === 0 ? (
            <p className="text-lg font-semibold text-gray-600">
              No useful information found for this filter.
            </p>
          ) : (
            <div className="grid gap-16">
              {filteredSections.map((section) => (
                <div key={section.id}>
                  <div className="mb-8">
                    <h2 className="mb-3 text-3xl font-black text-[#171717]">
                      {section.name}
                    </h2>

                    {section.description && (
                      <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {(section.useful_info_cards || [])
                      .filter((card) => card.is_active)
                      .map((card) => {
                        const Icon = iconMap[card.icon] || Home;

                        return (
                          <article
                            key={card.id}
                            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                          >
                            <div className="mb-5">
                              <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                                  card.color || "text-indigo-600 bg-indigo-50"
                                }`}
                              >
                                <Icon className="h-9 w-9" />
                              </div>
                            </div>

                            <h3 className="mb-5 text-2xl font-black text-[#171717]">
                              {card.title}
                            </h3>

                            <ul className="space-y-4 text-sm">
                              {(card.useful_info_links || [])
                                .filter((link) => link.is_active)
                                .map((link) => {
                                  const isPhone = link.link_type === "phone";
                                  const isEmail = link.link_type === "email";
                                  const isWebsite =
                                    link.link_type === "website" ||
                                    (!link.link_type && link.url);
                                  const isText =
                                    link.link_type === "text" || !link.url;

                                  if (isPhone) {
                                    return (
                                      <li key={link.id}>
                                        <a
                                          href={link.url}
                                          className="block rounded-xl bg-gray-50 p-4 transition hover:bg-[#f1ebff]"
                                        >
                                          <span className="block font-bold text-gray-700">
                                            {link.label}
                                          </span>

                                          {link.phone_number && (
                                            <span className="mt-1 block text-xl font-black text-[#171717]">
                                              {link.phone_number}
                                            </span>
                                          )}
                                        </a>
                                      </li>
                                    );
                                  }

                                  if (isEmail) {
                                    return (
                                      <li key={link.id}>
                                        <a
                                          href={link.url}
                                          className="block rounded-xl bg-gray-50 p-4 transition hover:bg-[#f1ebff]"
                                        >
                                          <span className="block font-bold text-gray-700">
                                            {link.label}
                                          </span>

                                          {link.email_address && (
                                            <span className="mt-1 block break-all text-base font-semibold text-[#5e17eb]">
                                              {link.email_address}
                                            </span>
                                          )}
                                        </a>
                                      </li>
                                    );
                                  }

                                  if (isWebsite) {
                                    return (
                                      <li key={link.id}>
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 font-semibold text-gray-700 transition hover:text-[#5e17eb]"
                                        >
                                          {link.label}
                                          <ExternalLink className="h-4 w-4" />
                                        </a>
                                      </li>
                                    );
                                  }

                                  if (isText) {
                                    return (
                                      <li key={link.id}>
                                        <span className="font-semibold text-gray-800">
                                          {link.label}
                                        </span>
                                      </li>
                                    );
                                  }

                                  return null;
                                })}
                            </ul>
                          </article>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="rounded-[2rem] bg-[#faf8ff] p-8 shadow-sm md:p-12">
            <MessageCircle className="mx-auto mb-6 h-16 w-16 text-[#5e17eb]" />

            <h2 className="mb-5 text-4xl font-black text-[#171717]">
              Need to speak to BHCA?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Whether it’s an issue not listed above, a question, or just to say
              hello, we’re here to help.
            </p>

            <Button to="/contact">Contact BHCA</Button>

            <p className="mt-8 text-gray-600">
              Or email us directly{" "}
              <a
                href="mailto:contact@beestonhill.org.uk"
                className="font-bold text-[#5e17eb] hover:text-[#ff914d]"
              >
                contact@beestonhill.org.uk
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}