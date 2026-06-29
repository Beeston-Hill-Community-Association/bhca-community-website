import { useEffect, useState } from "react";
import FeaturedEvent from "../components/events/FeaturedEvent";
import EventCard from "../components/events/EventCard";
import LocalEventCard from "../components/events/LocalEventCard";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";


export default function Events() {
  const [bhcaEvents, setBhcaEvents] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function fetchEvents() {
      const [bhcaResult, localResult] = await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: true }),
        supabase
  .from("local_events")
  .select("*")
  .eq("status", "published")
  .or(`event_date.gte.${today},recurrence_type.neq.none`)
  .order("event_date", { ascending: true }),
      ]);

     if (!bhcaResult.error) {
  setBhcaEvents(bhcaResult.data || []);
}

if (!localResult.error) {
  const events = localResult.data || [];

  const promotedEvents = events.filter((event) => event.promoted);
  const normalEvents = events.filter((event) => !event.promoted);

  setLocalEvents([
    ...promotedEvents,
    ...normalEvents,
  ]);
}

setLoading(false);
    }

    fetchEvents();
  }, [today]);

  const upcomingBhcaEvents = bhcaEvents.filter((event) => event.date >= today);
  const previousBhcaEvents = bhcaEvents
    .filter((event) => event.date < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const featuredEvent =
    upcomingBhcaEvents.find((event) => event.featured === true) ||
    upcomingBhcaEvents[0];

  const otherUpcomingBhcaEvents = upcomingBhcaEvents.filter(
    (event) => event.id !== featuredEvent?.id
  );

  return (
    <>
    <SEO
  title="Events"
  description="Find BHCA events, local activities, volunteering opportunities and community events across Beeston Hill and nearby areas."
/>
    
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            Events & activities
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Community events and local activities
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Discover BHCA events, local activities and opportunities to get
            involved across Beeston Hill.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-gray-600">Loading events...</p>
          </div>
        </section>
      ) : (
        <>
          {featuredEvent && (
            <section className="bg-white py-24">
              <div className="mx-auto max-w-7xl px-6">
                <FeaturedEvent event={featuredEvent} />
              </div>
            </section>
          )}

          <section className="bg-[#faf8ff] py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-14">
                <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5e17eb] shadow-sm">
                  BHCA events
                </span>

                <h2 className="text-4xl font-black text-[#171717]">
                  Upcoming BHCA events
                </h2>
              </div>

              {otherUpcomingBhcaEvents.length === 0 ? (
                <div className="rounded-3xl bg-white p-8 text-gray-600">
                  No additional BHCA events are listed yet.
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {otherUpcomingBhcaEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#ff914d]">
                    Local activities
                  </span>

                  <h2 className="mb-4 text-4xl font-black text-[#171717]">
                    Other local events
                  </h2>

                  <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                    Events and activities from local groups, organisations and
                    partners working in and around Beeston Hill.
                  </p>
                </div>

                <Button to="/submit-event" variant="outline">
                  Submit a Local Event
                </Button>
              </div>

              {localEvents.length === 0 ? (
                <div className="rounded-3xl bg-[#faf8ff] p-8 text-gray-600">
                  No local events are listed yet.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {localEvents.map((event) => (
                    <LocalEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {previousBhcaEvents.length > 0 && (
            <section className="bg-[#faf8ff] py-24">
              <div className="mx-auto max-w-7xl px-6">
                <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm">
                      Previous events
                    </span>

                    <h2 className="mb-4 text-4xl font-black text-[#171717]">
                      Previous BHCA events
                    </h2>

                    <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                      A look back at community events and activities delivered by
                      BHCA.
                    </p>
                  </div>

                  <Button to="/previous-events" variant="outline">
                    View all previous events
                  </Button>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {previousBhcaEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="bg-[#faf8ff] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="mb-5 text-4xl font-black text-[#171717]">
              Want to help at a BHCA event?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              We’re always looking for local volunteers to help with events,
              activities and community projects.
            </p>

            <Button href="https://forms.gle/HdPxKtQfXRHJ3AH17" variant="orange">
              Volunteer with us
            </Button>
          </div>
        </div>
      </section>
    </div>
      </>
  );
}