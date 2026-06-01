import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabaseClient";

export default function EventsSection() {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [bhcaEvents, setBhcaEvents] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function fetchEvents() {
      const [featuredResult, bhcaResult, localResult] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .eq("featured", true)
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("events")
          .select("*")
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(4),

        supabase
          .from("local_events")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

      if (!featuredResult.error && featuredResult.data) {
        setFeaturedEvent(featuredResult.data);
      }

      if (!bhcaResult.error) {
        const events = bhcaResult.data || [];
        setBhcaEvents(
          events.filter((event) => event.id !== featuredResult.data?.id)
        );
      }

      if (!localResult.error) {
        setLocalEvents(localResult.data || []);
      }

      setLoading(false);
    }

    fetchEvents();
  }, [today]);

  if (loading) {
    return null;
  }

  return (
    <section className="bg-[#faf8ff] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5e17eb] shadow-sm">
            Events & activities
          </span>

          <h2 className="mb-4 text-4xl font-black text-[#171717] md:text-5xl">
            What&apos;s happening in Beeston Hill
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Community events, local activities and opportunities to bring people
            together across Beeston Hill.
          </p>
        </div>

        {featuredEvent && (
          <div className="mb-10 overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid md:grid-cols-2">
            <div className="relative min-h-[320px]">
              {featuredEvent.image_url ? (
                <img
                  src={featuredEvent.image_url}
                  alt={featuredEvent.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center bg-[#faf8ff] text-5xl">
                  {featuredEvent.emoji || "🎉"}
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full bg-[#5e17eb] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                Featured BHCA Event
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="mb-4 text-sm font-bold text-[#ff914d]">
                {featuredEvent.display_date || featuredEvent.date}
                {featuredEvent.venue ? ` • ${featuredEvent.venue}` : ""}
              </div>

              <h3 className="mb-5 text-3xl font-black text-[#171717] md:text-4xl">
                {featuredEvent.title}
              </h3>

              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                {featuredEvent.description}
              </p>

              {featuredEvent.time_range && (
                <p className="mb-8 font-bold text-[#5e17eb]">
                  {featuredEvent.time_range}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Button variant="orange" to="/events">
                  View all events
                </Button>

                <Button
                  href="https://forms.gle/HdPxKtQfXRHJ3AH17"
                  variant="outline"
                  className="px-6 py-3"
                >
                  Volunteer to help
                </Button>
              </div>
            </div>
          </div>
        )}

        {bhcaEvents.length > 0 && (
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            {bhcaEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#5e17eb]/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#5e17eb]">
                    BHCA Event
                  </span>

                  <span className="text-sm font-semibold text-gray-500">
                    {event.display_date || event.date}
                  </span>
                </div>

                <h3 className="mb-3 text-2xl font-black text-[#171717]">
                  {event.title}
                </h3>

                <p className="mb-5 leading-relaxed text-gray-600">
                  {event.description}
                </p>

                {event.time_range && (
                  <p className="mb-5 text-sm font-bold text-[#5e17eb]">
                    {event.time_range}
                  </p>
                )}

                <Button to="/events" variant="text">
                  Find out more →
                </Button>
              </div>
            ))}
          </div>
        )}

        {localEvents.length > 0 && (
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#ff914d]">
                  Local events
                </span>

                <h3 className="text-3xl font-black text-[#171717]">
                  Other things happening locally
                </h3>
              </div>

              <Button to="/events" variant="text">
                See more local events →
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {localEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#faf8ff] p-5"
                >
                  {event.term_time_only && (
                    <div className="absolute right-[-38px] top-5 rotate-45 bg-[#5e17eb] px-10 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                      Term time
                    </div>
                  )}

                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[#ff914d]">
                    Local listing
                  </div>

                  <h4 className="mb-2 text-lg font-black text-[#171717]">
                    {event.title}
                  </h4>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {event.description}
                  </p>

                  <div className="text-sm font-semibold text-[#5e17eb]">
                    {event.event_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 text-center">
          <Button variant="orange" to="/events">
            View all events
          </Button>
        </div>
      </div>
    </section>
  );
}