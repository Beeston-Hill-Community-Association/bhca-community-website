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

export default function LocalEventCard({ event }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-gray-100 bg-[#faf8ff] p-6">
      {event.term_time_only && (
        <div className="absolute right-[-42px] top-6 z-10 rotate-45 bg-[#5e17eb] px-12 py-2 text-xs font-black uppercase tracking-wide text-white shadow-md">
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
            className="mb-5 flex h-48 w-full items-center justify-center rounded-2xl bg-white font-black text-[#5e17eb] shadow-sm transition hover:bg-purple-50"
          >
            📄 View attached PDF
          </a>
        ) : (
          <a
            href={event.flyer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 block"
          >
            <img
              src={event.flyer_url}
              alt={event.title}
              className="h-48 w-full rounded-2xl object-cover object-top transition hover:opacity-90"
            />
          </a>
        ))}

      <h3 className="mb-3 text-2xl font-black text-[#171717]">
        {event.title}
      </h3>

      <p className="mb-5 leading-relaxed text-gray-600">
        {event.description}
      </p>

      <div className="space-y-1 text-sm font-bold text-[#5e17eb]">
        <p>{event.display_date || formatDate(event.event_date)}</p>

        {event.event_time && (
          <p>
            {formatTime(event.event_time)}
            {event.event_end_time
              ? ` – ${formatTime(event.event_end_time)}`
              : ""}
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
          Visit website →
        </a>
      )}
    </article>
  );
}