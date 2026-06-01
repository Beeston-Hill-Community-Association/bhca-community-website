import { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import { supabase } from "../lib/supabaseClient";

export default function PreviousEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function fetchPreviousEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .lt("date", today)
        .order("date", { ascending: false });

      if (!error) setEvents(data || []);
      setLoading(false);
    }

    fetchPreviousEvents();
  }, [today]);

  return (
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Event archive
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Previous BHCA events
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            A record of community events, activities and gatherings delivered by
            Beeston Hill Community Association.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-gray-600">Loading previous events...</p>
          ) : events.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-gray-600">
              No previous BHCA events are listed yet.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}