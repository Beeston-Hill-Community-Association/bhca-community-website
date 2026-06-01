export default function LocalEventCard({ event }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-gray-100 bg-[#faf8ff] p-6">
      {event.term_time_only && (
        <div className="absolute right-[-42px] top-6 rotate-45 bg-[#5e17eb] px-12 py-2 text-xs font-black uppercase tracking-wide text-white shadow-md">
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

      {event.flyer_url && (
        <img
          src={event.flyer_url}
          alt={event.title}
          className="mb-5 h-48 w-full rounded-2xl object-cover"
        />
      )}

      <h3 className="mb-3 text-2xl font-black text-[#171717]">
        {event.title}
      </h3>

      <p className="mb-5 leading-relaxed text-gray-600">
        {event.description}
      </p>

      <div className="space-y-1 text-sm font-bold text-[#5e17eb]">
        <p>{event.event_date}</p>

        {event.event_time && (
          <p>
            {event.event_time}
            {event.event_end_time ? ` – ${event.event_end_time}` : ""}
          </p>
        )}

        {event.location && <p>{event.location}</p>}

        {event.source && <p className="text-gray-500">By {event.source}</p>}
      </div>

      {event.external_url && (
        <a
          href={event.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-black text-[#ff914d] transition hover:text-[#5e17eb]"
        >
          Find out more →
        </a>
      )}
    </article>
  );
}