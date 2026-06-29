import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabaseClient";

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const dayName = date.toLocaleDateString("en-GB", {
    weekday: "long",
  });

  const day = date.getDate();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

  const month = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  return `${dayName} ${day}${suffix} ${month}`;
}

function formatTime(time) {
  if (!time) return "";
  return time.slice(0, 5);
}

function isPng(url) {
  return url?.toLowerCase().includes(".png");
}

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

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
          .limit(6),

       supabase
  .from("local_events")
  .select("*")
  .eq("status", "published")
  .or(`event_date.gte.${today},recurrence_type.neq.none`)
  .order("event_date", { ascending: true }),
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
  const events = localResult.data || [];

  const promotedEvents = events.filter((event) => event.promoted);
  const normalEvents = events.filter((event) => !event.promoted);

  const homepageEvents = [
    ...promotedEvents,
    ...shuffleArray(normalEvents),
  ].slice(0, 4);

  setLocalEvents(homepageEvents);
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
                isPng(featuredEvent.image_url) ? (
                  <a
                    href={featuredEvent.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <img
                      src={featuredEvent.image_url}
                      alt={featuredEvent.title}
                      className="h-full w-full object-cover object-top transition hover:opacity-90"
                    />
                  </a>
                ) : (
                  <img
                    src={featuredEvent.image_url}
                    alt={featuredEvent.title}
                    className="h-full w-full object-cover object-top"
                  />
                )
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
                className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {event.image_url &&
                  (isPng(event.image_url) ? (
                    <a
                      href={event.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-56 w-full object-cover object-top transition hover:opacity-90"
                      />
                    </a>
                  ) : (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-56 w-full object-cover object-top"
                    />
                  ))}

                <div className="p-7">
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

                  <Button
  to={event.slug ? `/events/${event.slug}` : "/events"}
  variant="text"
>
  Find out more →
</Button>
                </div>
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

                <p className="mt-3 max-w-2xl text-sm text-gray-500">
                  Local listings are displayed in a rotating order.
                </p>
              </div>

              <Button to="/events" variant="text">
                See more local events →
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {localEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#faf8ff] p-5"
                >
                  {event.term_time_only && (
                    <div className="absolute right-[-38px] top-5 z-10 rotate-45 bg-[#5e17eb] px-10 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                      Term time
                    </div>
                  )}

                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#ff914d]">
                      Local listing
                    </span>

                    {event.category && (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#5e17eb]">
                        {event.category}
                      </span>
                    )}
                  </div>

                  {event.flyer_url &&
                    (event.flyer_url.toLowerCase().includes(".pdf") ? (
                      <a
                        href={event.flyer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-white text-sm font-black text-[#5e17eb] shadow-sm transition hover:bg-purple-50"
                      >
                        📄 View attached PDF
                      </a>
                    ) : (
                      <a
                        href={event.flyer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-4 block"
                      >
                        <img
                          src={event.flyer_url}
                          alt={event.title}
                          className="h-48 w-full rounded-xl object-cover object-top transition hover:opacity-90"
                        />
                      </a>
                    ))}

                  <h4 className="mb-2 text-lg font-black text-[#171717]">
                    {event.title}
                  </h4>

                  <div className="mb-4 flex flex-wrap gap-4">
                    <Button to="/events" variant="text">
                      More information →
                    </Button>

                    {event.external_url && (
                      <a
                        href={event.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-black text-[#ff914d] transition hover:text-[#5e17eb]"
                      >
                        Visit website →
                      </a>
                    )}
                  </div>

                  <div className="space-y-1 text-sm font-semibold text-[#5e17eb]">
                    <p>{event.display_date || formatDate(event.event_date)}</p>

                    {event.event_time && (
                      <p>
                        {formatTime(event.event_time)}
                        {event.event_end_time
                          ? ` – ${formatTime(event.event_end_time)}`
                          : ""}
                      </p>
                    )}

                    {event.location && (
                      <p className="text-gray-600">{event.location}</p>
                    )}
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