import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import SEO from "../../components/seo/SEO";

function StatCard({ label, value, onClick, tone = "purple" }) {
  const tones = {
    purple: "text-[#5e17eb] bg-[#5e17eb]/10",
    orange: "text-[#ff914d] bg-orange-100",
    green: "text-green-700 bg-green-100",
    red: "text-red-700 bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span
        className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-black uppercase ${tones[tone]}`}
      >
        {label}
      </span>

      <p className="text-4xl font-black text-[#171717]">{value}</p>

      <p className="mt-3 text-sm font-bold text-gray-400">Manage →</p>
    </button>
  );
}

function InfoCard({ title, children, action }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-[#171717]">{title}</h2>
        {action}
      </div>

      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    events: 0,
    localEventsLive: 0,
    localEventsPending: 0,
    news: 0,
    media: 0,
    actionPlan: 0,
  });

  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [latestNews, setLatestNews] = useState(null);
  const [highlightedImages, setHighlightedImages] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    const [
      events,
      localEventsLive,
      localEventsPending,
      news,
      media,
      actionPlan,
      featuredEventResult,
      heroResult,
      latestNewsResult,
      highlightedResult,
    ] = await Promise.all([
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .gte("date", today),

      supabase
        .from("local_events")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),

      supabase
        .from("local_events")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase.from("newsletters").select("id", { count: "exact", head: true }),

      supabase.from("media").select("id", { count: "exact", head: true }),

      supabase.from("cap_sections").select("id", {
        count: "exact",
        head: true,
      }),

      supabase
        .from("events")
        .select("*")
        .eq("featured", true)
        .order("date", { ascending: true })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("media")
        .select("*")
        .eq("folder", "heroes")
        .eq("highlighted", true)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("newsletters")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("media")
        .select("*")
        .eq("folder", "gallery")
        .eq("highlighted", true)
        .order("display_order", { ascending: true })
        .limit(5),
    ]);

    setStats({
      events: events.count ?? 0,
      localEventsLive: localEventsLive.count ?? 0,
      localEventsPending: localEventsPending.count ?? 0,
      news: news.count ?? 0,
      media: media.count ?? 0,
      actionPlan: actionPlan.count ?? 0,
    });

    setFeaturedEvent(featuredEventResult.data || null);
    setHeroImage(heroResult.data || null);
    setLatestNews(latestNewsResult.data || null);
    setHighlightedImages(highlightedResult.data || []);

    setLoading(false);
  }

  if (loading) {
    return (
      <AdminLayout>
        <SEO title="Admin Dashboard" noindex />
        <p className="text-gray-600">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" noindex />
      <div className="mb-10">
        <span className="mb-4 inline-block rounded-full bg-[#5e17eb]/10 px-4 py-2 text-sm font-black text-[#5e17eb]">
          Admin dashboard
        </span>

        <h1 className="text-4xl font-black text-[#171717]">
          Website control centre
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Manage BHCA content, review submissions and check what is currently
          live on the website.
        </p>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Upcoming events"
          value={stats.events}
          onClick={() => navigate("/admin/events")}
        />

        <StatCard
          label="Live local"
          value={stats.localEventsLive}
          tone="green"
          onClick={() => navigate("/admin/localevents")}
        />

        <StatCard
          label="Pending approval"
          value={stats.localEventsPending}
          tone="red"
          onClick={() => navigate("/admin/localevents")}
        />

        <StatCard
          label="News articles"
          value={stats.news}
          tone="orange"
          onClick={() => navigate("/admin/news")}
        />

        <StatCard
          label="Media library"
          value={stats.media}
          onClick={() => navigate("/admin/gallery")}
        />

        <StatCard
          label="Action plan"
          value={stats.actionPlan}
          tone="green"
          onClick={() => navigate("/admin/action-plan")}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard
          title="Current homepage hero"
          action={
            <button
              type="button"
              onClick={() => navigate("/admin/gallery")}
              className="text-sm font-bold text-[#5e17eb]"
            >
              Change →
            </button>
          }
        >
          {heroImage?.url ? (
            <div>
              <img
                src={heroImage.url}
                alt={heroImage.name || "Homepage hero"}
                className="mb-4 h-52 w-full rounded-2xl object-cover"
              />

              <p className="font-bold text-[#171717]">
                {heroImage.name || "Homepage hero image"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No hero image selected.</p>
          )}
        </InfoCard>

        <InfoCard
          title="Featured event"
          action={
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="text-sm font-bold text-[#5e17eb]"
            >
              Edit →
            </button>
          }
        >
          {featuredEvent ? (
            <div>
              <p className="mb-2 text-sm font-bold text-[#ff914d]">
                {featuredEvent.display_date || featuredEvent.date}
              </p>

              <h3 className="mb-2 text-2xl font-black text-[#171717]">
                {featuredEvent.title}
              </h3>

              <p className="text-gray-600">{featuredEvent.description}</p>
            </div>
          ) : (
            <p className="text-gray-500">No featured event selected.</p>
          )}
        </InfoCard>

        <InfoCard
          title="Homepage gallery"
          action={
            <button
              type="button"
              onClick={() => navigate("/admin/gallery")}
              className="text-sm font-bold text-[#5e17eb]"
            >
              Manage →
            </button>
          }
        >
          {highlightedImages.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {highlightedImages.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={image.name || "Gallery highlight"}
                  className="h-24 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No homepage gallery images selected.
            </p>
          )}
        </InfoCard>

        <InfoCard
          title="Latest news"
          action={
            <button
              type="button"
              onClick={() => navigate("/admin/news")}
              className="text-sm font-bold text-[#5e17eb]"
            >
              Add news →
            </button>
          }
        >
          {latestNews ? (
            <div>
              <p className="mb-2 text-sm font-bold text-[#ff914d]">
                {latestNews.published_at
                  ? new Date(latestNews.published_at).toLocaleDateString(
                      "en-GB"
                    )
                  : "No date"}
              </p>

              <h3 className="mb-2 text-2xl font-black text-[#171717]">
                {latestNews.title}
              </h3>

              <p className="text-gray-600">{latestNews.excerpt}</p>
            </div>
          ) : (
            <p className="text-gray-500">No news added yet.</p>
          )}
        </InfoCard>
      </div>
    </AdminLayout>
  );
}