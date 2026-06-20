import Button from "../ui/Button";

export default function FeaturedEvent({ event }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid md:grid-cols-2">
      <div className="relative min-h-[340px]">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[340px] items-center justify-center bg-[#faf8ff] text-5xl">
            {event.emoji || "🎉"}
          </div>
        )}

        <div className="absolute left-5 top-5 rounded-full bg-[#5e17eb] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
          Featured BHCA Event
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="mb-4 text-sm font-bold text-[#ff914d]">
          {event.display_date || event.date}
          {event.venue ? ` • ${event.venue}` : ""}
        </div>

        <h2 className="mb-3 text-3xl font-black text-[#171717] md:text-4xl">
          {event.title}
        </h2>

        <p className="mb-8 text-lg leading-relaxed text-gray-600">
          {event.description}
        </p>

        {event.time_range && (
          <p className="mb-8 font-bold text-[#5e17eb]">
            {event.time_range}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
         
          <Button
  to={event.slug ? `/events/${event.slug}` : "/events"}
  variant="primary"
>
  View event details
</Button>

          <Button
            href="https://forms.gle/HdPxKtQfXRHJ3AH17"
            variant="outline"
          >
            Volunteer to help
          </Button>
        </div>
      </div>
    </div>
  );
}