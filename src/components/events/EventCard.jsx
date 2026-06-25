import Button from "../ui/Button";

export default function EventCard({ event }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {event.image_url &&
        (event.image_url.toLowerCase().includes(".png") ? (
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

        <h3 className="mb-2 text-2xl font-black text-[#171717]">
          {event.title}
        </h3>

        {event.venue && (
          <p className="mb-4 text-sm font-bold text-[#5e17eb]">
            {event.venue}
          </p>
        )}

        <p className="mb-6 leading-relaxed text-gray-600">
          {event.description}
        </p>

        {event.time_range && (
          <div className="mb-6 text-sm font-semibold text-gray-500">
            {event.time_range}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
  {event.stalls_fully_booked && (
  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
    <p className="text-center text-sm font-black text-red-700">
      🚫 Stall applications for this event are now closed.
    </p>
  </div>
)}

<div className="flex flex-wrap gap-3">
  <Button
    to={event.slug ? `/events/${event.slug}` : "/events"}
    variant="text"
  >
    Find out more →
  </Button>

  {event.has_stall && !event.stalls_fully_booked && (
    <Button
      href="https://forms.gle/qH3hgTL8HmRTS1do7"
      variant="orange"
      className="px-5 py-3 text-sm"
    >
      Book a stall
    </Button>
  )}
</div>
</div>
</div>
    </article>
  );
}