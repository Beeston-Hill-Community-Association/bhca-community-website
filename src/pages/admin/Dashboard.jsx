import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";

function StatCard({ label, value, loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="mb-1 text-sm text-gray-500">{label}</p>

      <p className="text-3xl font-black text-[#171717]">
        {loading ? "—" : value}
      </p>

      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#5e17eb]">
        Manage →
      </p>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    events: 0,
    localEventsLive: 0,
    localEventsPending: 0,
    news: 0,
    media: 0,
    actionPlan: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      const [
        events,
        localEventsLive,
        localEventsPending,
        news,
        media,
        actionPlan,
      ] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),

        supabase
          .from("local_events")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),

        supabase
          .from("local_events")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),

        supabase
          .from("newsletters")
          .select("id", { count: "exact", head: true }),

        supabase.from("media").select("id", { count: "exact", head: true }),

        supabase
          .from("cap_sections")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats({
        events: events.count ?? 0,
        localEventsLive: localEventsLive.count ?? 0,
        localEventsPending: localEventsPending.count ?? 0,
        news: news.count ?? 0,
        media: media.count ?? 0,
        actionPlan: actionPlan.count ?? 0,
      });

      setLoading(false);
    }

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="mb-8 text-3xl font-black text-[#171717]">
        Dashboard
      </h1>

      <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="BHCA events"
          value={stats.events}
          loading={loading}
          onClick={() => navigate("/admin/events")}
        />

        <StatCard
          label="Live local events"
          value={stats.localEventsLive}
          loading={loading}
          onClick={() => navigate("/admin/local-events")}
        />

        <StatCard
          label="Pending local events"
          value={stats.localEventsPending}
          loading={loading}
          onClick={() => navigate("/admin/local-events")}
        />

        <StatCard
          label="News"
          value={stats.news}
          loading={loading}
          onClick={() => navigate("/admin/news")}
        />

        <StatCard
          label="Media items"
          value={stats.media}
          loading={loading}
          onClick={() => navigate("/admin/gallery")}
        />

        <StatCard
          label="Action Plan sections"
          value={stats.actionPlan}
          loading={loading}
          onClick={() => navigate("/admin/action-plan")}
        />
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-xl font-black text-[#171717]">
          Welcome back
        </h2>

        <p className="text-gray-600">
          Use the cards above or the admin navigation to manage website content.
          Pending local events can be reviewed and approved from the Local
          Events section.
        </p>
      </div>
    </AdminLayout>
  );
}