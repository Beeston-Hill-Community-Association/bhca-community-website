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

        {event.has_stall && !event.stalls_fully_booked && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              🛍️ <span className="font-bold text-[#171717]">Non-Food Stall — £15</span>
              &nbsp;|&nbsp;
              <span className="font-bold text-[#171717]">Food Stall — £40</span>
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Button
            to={event.slug ? `/events/${event.slug}` : "/events"}
            variant="primary"
          >
            View event details
          </Button>

          {event.has_stall && !event.stalls_fully_booked ? (
            <>
              <Button
                href="https://forms.gle/qH3hgTL8HmRTS1do7"
                variant="orange"
                className="px-5 py-3 text-sm"
              >
                Book a stall
              </Button>
              <Button
                href="https://forms.gle/HdPxKtQfXRHJ3AH17"
                variant="outline"
              >
                Volunteer to help
              </Button>
            </>
          ) : (
            <Button
              href="https://forms.gle/HdPxKtQfXRHJ3AH17"
              variant="outline"
            >
              Volunteer to help
            </Button>
          )}

          {event.stalls_fully_booked && (
            <p className="text-sm font-black text-red-600">🚫 Stalls fully booked</p>
          )}
        </div>
      </div>
    </div>
  );
}