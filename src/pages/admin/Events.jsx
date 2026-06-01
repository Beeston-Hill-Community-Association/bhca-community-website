import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import R2Uploader from "../../components/admin/R2Uploader";
import MediaPicker from "../../components/admin/MediaPicker";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [emoji, setEmoji] = useState("");
  const [venue, setVenue] = useState("");
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [hasStall, setHasStall] = useState(false);
  const [hasRSVP, setHasRSVP] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [eventType, setEventType] = useState("event");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
      alert("Could not load events.");
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  }

  async function clearOtherFeaturedEvents(currentEventId = null) {
    let query = supabase.from("events").update({ featured: false });

    if (currentEventId) {
      query = query.neq("id", currentEventId);
    }

    const { error } = await query;

    if (error) {
      console.error(error);
      alert("Could not update existing featured event.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !date || !displayDate || !timeRange) {
      alert("Please fill in title, date, display date and time range.");
      return;
    }

    const payload = {
      title,
      date,
      display_date: displayDate,
      time_range: timeRange,
      description,
      full_description: fullDescription || null,
      emoji: emoji || null,
      venue: venue || null,
      image_url: imageUrl || null,
      has_stall: hasStall,
      has_rsvp: hasRSVP,
      rsvp_url: rsvpUrl || null,
      coming_soon: comingSoon,
      event_type: eventType,
      featured,
    };

    if (featured) {
      const ok = await clearOtherFeaturedEvents(editingEvent?.id || null);
      if (!ok) return;
    }

    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", editingEvent.id);

      if (error) {
        console.error(error);
        alert("Error updating event.");
        return;
      }
    } else {
      const { error } = await supabase.from("events").insert([payload]);

      if (error) {
        console.error(error);
        alert("Error adding event.");
        return;
      }
    }

    resetForm();
    fetchEvents();
  }

  async function handleDelete(event) {
    if (!confirm(`Delete "${event.title}"?`)) return;

    const { error } = await supabase.from("events").delete().eq("id", event.id);

    if (error) {
      console.error(error);
      alert("Error deleting event.");
      return;
    }

    setEvents((prev) => prev.filter((item) => item.id !== event.id));
  }

  function startEdit(event) {
    setEditingEvent(event);
    setTitle(event.title || "");
    setDate(event.date || "");
    setDisplayDate(event.display_date || "");
    setTimeRange(event.time_range || "");
    setDescription(event.description || "");
    setFullDescription(event.full_description || "");
    setEmoji(event.emoji || "");
    setVenue(event.venue || "");
    setRsvpUrl(event.rsvp_url || "");
    setImageUrl(event.image_url || "");
    setHasStall(Boolean(event.has_stall));
    setHasRSVP(Boolean(event.has_rsvp));
    setComingSoon(Boolean(event.coming_soon));
    setFeatured(Boolean(event.featured));
    setEventType(event.event_type || "event");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingEvent(null);
    setTitle("");
    setDate("");
    setDisplayDate("");
    setTimeRange("");
    setDescription("");
    setFullDescription("");
    setEmoji("");
    setVenue("");
    setRsvpUrl("");
    setImageUrl("");
    setHasStall(false);
    setHasRSVP(false);
    setComingSoon(false);
    setFeatured(false);
    setEventType("event");
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">
          BHCA Events
        </h1>

        <p className="text-sm text-gray-500">
          Loaded {events.length} events
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-black text-[#171717]">
          {editingEvent ? "Edit event" : "Add new event"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-xl border p-3"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border p-3"
        />

        <input
          value={displayDate}
          onChange={(e) => setDisplayDate(e.target.value)}
          placeholder="Display date"
          className="rounded-xl border p-3"
        />

        <input
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          placeholder="Time range"
          className="rounded-xl border p-3"
        />

        <input
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Venue"
          className="rounded-xl border p-3"
        />
        <MediaPicker
  folders={["events", "gallery", "aerial"]}
  label="Choose existing event image"
  onSelect={(url) => setImageUrl(url)}
/>

        <R2Uploader folder="events" onUpload={(url) => setImageUrl(url)} />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Event poster preview"
            className="h-56 w-full max-w-md rounded-xl object-cover"
          />
        )}

        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="rounded-xl border p-3"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          rows="3"
          className="rounded-xl border p-3"
        />

        <textarea
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          placeholder="Full description"
          rows="5"
          className="rounded-xl border p-3"
        />

        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="Emoji fallback"
          className="rounded-xl border p-3"
        />

        <input
          value={rsvpUrl}
          onChange={(e) => setRsvpUrl(e.target.value)}
          placeholder="RSVP URL"
          className="rounded-xl border p-3"
        />

        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="event">Event</option>
          <option value="community_meeting">Community meeting</option>
        </select>

        <div className="flex flex-wrap gap-5 text-sm">
          <label>
            <input
              type="checkbox"
              checked={hasStall}
              onChange={(e) => setHasStall(e.target.checked)}
            />{" "}
            Stall
          </label>

          <label>
            <input
              type="checkbox"
              checked={hasRSVP}
              onChange={(e) => setHasRSVP(e.target.checked)}
            />{" "}
            RSVP
          </label>

          <label>
            <input
              type="checkbox"
              checked={comingSoon}
              onChange={(e) => setComingSoon(e.target.checked)}
            />{" "}
            Coming soon
          </label>

          <label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />{" "}
            Featured event
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white"
          >
            {editingEvent ? "Update event" : "Add event"}
          </button>

          {editingEvent && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full bg-gray-300 px-6 py-3 font-bold text-[#171717]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row"
            >
              <div className="flex gap-4">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {event.emoji || "?"}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-[#171717]">
                      {event.title}
                    </h3>

                    {event.featured && (
                      <span className="rounded-full bg-[#5e17eb] px-3 py-1 text-xs font-bold text-white">
                        Featured
                      </span>
                    )}

                    {event.coming_soon && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#ff914d]">
                        Coming soon
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {event.display_date} · {event.time_range}
                  </p>

                  {event.venue && (
                    <p className="text-sm text-gray-500">{event.venue}</p>
                  )}

                  <p className="mt-2 text-sm text-gray-700">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(event)}
                  className="rounded bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(event)}
                  className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}