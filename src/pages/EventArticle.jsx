import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventArticle() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setEvent(data);
      }

      setLoading(false);
    }

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-gray-600">Loading event...</p>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-black text-[#171717]">
            Event not found
          </h1>

          <Button to="/events">Back to events</Button>
        </div>
      </section>
    );
  }

  return (
    <>
    <SEO
  title={event.title}
  description={
    event.description ||
    event.full_description?.substring(0, 160) ||
    "Community event organised by Beeston Hill Community Association."
  }
/>
    
    <article>
      <section className="bg-[#5e17eb] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/events"
            className="mb-8 inline-block font-bold text-white/80 hover:text-[#ff914d]"
          >
            ← Back to events
          </Link>

          <div className="mb-4 text-sm font-bold text-[#ff914d]">
            BHCA Event
            {event.date ? ` • ${formatDate(event.date)}` : ""}
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            {event.title}
          </h1>

          {event.description && (
            <p className="max-w-3xl text-xl leading-relaxed text-white/80">
              {event.description}
            </p>
          )}
        </div>
      </section>

      {event.image_url && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-5xl px-6">
            <img
              src={event.image_url}
              alt={event.title}
              className="h-[500px] w-full rounded-[2rem] object-cover object-top shadow-lg"
            />
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 rounded-3xl bg-[#faf8ff] p-6">
            {event.display_date && (
              <p className="mb-2 font-bold text-[#5e17eb]">
                Date: {event.display_date}
              </p>
            )}

            {!event.display_date && event.date && (
              <p className="mb-2 font-bold text-[#5e17eb]">
                Date: {formatDate(event.date)}
              </p>
            )}

            {event.time_range && (
              <p className="mb-2 font-bold text-[#5e17eb]">
                Time: {event.time_range}
              </p>
            )}

            {event.venue && (
              <p className="font-bold text-[#5e17eb]">
                Location: {event.venue}
              </p>
            )}
          </div>

          <div className="whitespace-pre-line text-lg leading-relaxed text-gray-700">
            {event.full_description || event.description}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button to="/events" variant="outline">
              Back to events
            </Button>

            <Button
              href="https://forms.gle/HdPxKtQfXRHJ3AH17"
              variant="orange"
            >
              Volunteer to help
            </Button>
          </div>
        </div>
      </section>
    </article>
    </>
  );
}