import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import R2Uploader from "../../components/admin/R2Uploader";
import SEO from "../../components/seo/SEO";

const emptyForm = {
  title: "",
  event_date: "",
  display_date: "",
  event_time: "",
  event_end_time: "",
  description: "",
  source: "",
  location: "",
  external_url: "",
  flyer_url: "",
  status: "published",
  term_time_only: false,
  recurrence_type: "none",
  repeat_interval: 1,
  recurrence_end_date: "",
  week_number: "",
  weekday: "",
};

function formatTime(time) {
  if (!time) return "";
  return time.slice(0, 5);
}

export default function LocalEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecurrence, setShowRecurrence] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("local_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message || "Could not load local events.");
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function startEdit(event) {
    const recurrenceType = event.recurrence_type || "none";

    setEditingEvent(event);
    setShowRecurrence(recurrenceType !== "none");

    setForm({
      title: event.title || "",
      event_date: event.event_date || "",
      display_date: event.display_date || "",
      event_time: event.event_time || "",
      event_end_time: event.event_end_time || "",
      description: event.description || "",
      source: event.source || "",
      location: event.location || "",
      external_url: event.external_url || "",
      flyer_url: event.flyer_url || "",
      status: event.status || "published",
      term_time_only: Boolean(event.term_time_only),
      recurrence_type: recurrenceType,
      repeat_interval: event.repeat_interval || 1,
      recurrence_end_date: event.recurrence_end_date || "",
      week_number: event.week_number || "",
      weekday: event.weekday || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingEvent(null);
    setForm(emptyForm);
    setShowRecurrence(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.event_date || !form.description) {
      alert("Please fill in title, event date and description.");
      return;
    }

    const recurrenceType = showRecurrence ? form.recurrence_type : "none";

    const payload = {
      title: form.title,
      event_date: form.event_date,
      display_date: form.display_date || null,
      event_time: form.event_time || null,
      event_end_time: form.event_end_time || null,
      description: form.description,
      source: form.source || null,
      location: form.location || null,
      external_url: form.external_url || null,
      flyer_url: form.flyer_url || null,
      status: form.status,
      term_time_only: form.term_time_only,
      recurrence_type: recurrenceType,
      repeat_interval:
        recurrenceType !== "none" ? Number(form.repeat_interval) || 1 : 1,
      recurrence_end_date:
        recurrenceType !== "none" ? form.recurrence_end_date || null : null,
      week_number:
        recurrenceType === "monthly_nth" && form.week_number
          ? Number(form.week_number)
          : null,
      weekday:
        recurrenceType === "weekly" || recurrenceType === "monthly_nth"
          ? form.weekday || null
          : null,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from("local_events")
        .update(payload)
        .eq("id", editingEvent.id);

      if (error) {
        console.error(error);
        alert(error.message || "Could not update event.");
        return;
      }
    } else {
      const { error } = await supabase.from("local_events").insert([payload]);

      if (error) {
        console.error(error);
        alert(error.message || "Could not add event.");
        return;
      }
    }

    resetForm();
    fetchEvents();
  }

  async function updateStatus(event, status) {
    const { error } = await supabase
      .from("local_events")
      .update({ status })
      .eq("id", event.id);

    if (error) {
      console.error(error);
      alert(error.message || "Could not update status.");
      return;
    }

    fetchEvents();
  }

  async function handleDelete(event) {
    if (!confirm(`Delete "${event.title}"?`)) return;

    const { error } = await supabase
      .from("local_events")
      .delete()
      .eq("id", event.id);

    if (error) {
      console.error(error);
      alert(error.message || "Could not delete event.");
      return;
    }

    setEvents((prev) => prev.filter((item) => item.id !== event.id));
  }

  const pendingEvents = events.filter((event) => event.status === "pending");
  const publishedEvents = events.filter(
    (event) => event.status === "published"
  );

  return (
    <AdminLayout>
      <SEO title="Manage Local Events" noindex />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">
          Local Events
        </h1>

        <p className="text-sm text-gray-500">
          Manage local listings, recurring activities and submitted events.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-black text-[#171717]">
          {editingEvent ? "Edit local event" : "Add local event"}
        </h2>

        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Event title"
          className="rounded-xl border p-3"
        />

        <input
          type="date"
          value={form.event_date}
          onChange={(e) => updateField("event_date", e.target.value)}
          className="rounded-xl border p-3"
        />

        <input
          value={form.display_date}
          onChange={(e) => updateField("display_date", e.target.value)}
          placeholder="Display date, e.g. Every Wednesday"
          className="rounded-xl border p-3"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="time"
            value={form.event_time}
            onChange={(e) => updateField("event_time", e.target.value)}
            className="rounded-xl border p-3"
            aria-label="Start time"
          />

          <input
            type="time"
            value={form.event_end_time}
            onChange={(e) => updateField("event_end_time", e.target.value)}
            className="rounded-xl border p-3"
            aria-label="End time"
          />
        </div>

        <input
          value={form.source}
          onChange={(e) => updateField("source", e.target.value)}
          placeholder="Your name / organisation"
          className="rounded-xl border p-3"
        />

        <input
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="Location"
          className="rounded-xl border p-3"
        />

        <input
          value={form.external_url}
          onChange={(e) => updateField("external_url", e.target.value)}
          placeholder="Website / booking page URL"
          className="rounded-xl border p-3"
        />

        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input
            type="checkbox"
            checked={form.term_time_only}
            onChange={(e) => updateField("term_time_only", e.target.checked)}
          />

          <span className="font-medium text-[#171717]">Term time only</span>
        </label>

        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input
            type="checkbox"
            checked={showRecurrence}
            onChange={(e) => {
              const checked = e.target.checked;
              setShowRecurrence(checked);
              updateField("recurrence_type", checked ? "weekly" : "none");
            }}
          />

          <span className="font-medium text-[#171717]">
            This is a recurring event
          </span>
        </label>

        {showRecurrence && (
          <div className="grid gap-4 rounded-2xl bg-[#faf8ff] p-5">
            <select
              value={form.recurrence_type}
              onChange={(e) => updateField("recurrence_type", e.target.value)}
              className="rounded-xl border p-3"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly, same date</option>
              <option value="monthly_nth">Monthly, e.g. 1st Saturday</option>
            </select>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                min="1"
                value={form.repeat_interval}
                onChange={(e) => updateField("repeat_interval", e.target.value)}
                placeholder="Repeat every"
                className="rounded-xl border p-3"
              />

              <input
                type="date"
                value={form.recurrence_end_date}
                onChange={(e) =>
                  updateField("recurrence_end_date", e.target.value)
                }
                className="rounded-xl border p-3"
              />
            </div>

            {(form.recurrence_type === "weekly" ||
              form.recurrence_type === "monthly_nth") && (
              <select
                value={form.weekday}
                onChange={(e) => updateField("weekday", e.target.value)}
                className="rounded-xl border p-3"
              >
                <option value="">Select day of week</option>
                <option value="MO">Monday</option>
                <option value="TU">Tuesday</option>
                <option value="WE">Wednesday</option>
                <option value="TH">Thursday</option>
                <option value="FR">Friday</option>
                <option value="SA">Saturday</option>
                <option value="SU">Sunday</option>
              </select>
            )}

            {form.recurrence_type === "monthly_nth" && (
              <select
                value={form.week_number}
                onChange={(e) => updateField("week_number", e.target.value)}
                className="rounded-xl border p-3"
              >
                <option value="">Select week in month</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
                <option value="-1">Last</option>
              </select>
            )}
          </div>
        )}

        <R2Uploader
          folder="local-events"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onUpload={(url) => updateField("flyer_url", url)}
        />

        {form.flyer_url &&
          (form.flyer_url.toLowerCase().endsWith(".pdf") ? (
            <a
              href={form.flyer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-full bg-[#5e17eb] px-5 py-3 font-bold text-white"
            >
              View uploaded PDF
            </a>
          ) : (
            <img
              src={form.flyer_url}
              alt="Local event flyer preview"
              className="h-56 w-full max-w-md rounded-xl object-cover object-top"
            />
          ))}

        <input
          value={form.flyer_url}
          onChange={(e) => updateField("flyer_url", e.target.value)}
          placeholder="Flyer/image URL"
          className="rounded-xl border p-3"
        />

        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Short description"
          rows="4"
          className="rounded-xl border p-3"
        />

        <select
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
        </select>

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
        <p>Loading local events...</p>
      ) : (
        <div className="grid gap-10 lg:grid-cols-2">
          <EventColumn
            title={`Pending Approval (${pendingEvents.length})`}
            titleClass="text-orange-600"
            events={pendingEvents}
            onEdit={startEdit}
            onDelete={handleDelete}
            onStatusChange={updateStatus}
          />

          <EventColumn
            title={`Published Events (${publishedEvents.length})`}
            titleClass="text-green-600"
            events={publishedEvents}
            onEdit={startEdit}
            onDelete={handleDelete}
            onStatusChange={updateStatus}
          />
        </div>
      )}
    </AdminLayout>
  );
}

function recurrenceLabel(event) {
  if (!event.recurrence_type || event.recurrence_type === "none") return null;

  if (event.recurrence_type === "weekly") return "Repeats weekly";
  if (event.recurrence_type === "monthly") return "Repeats monthly";
  if (event.recurrence_type === "monthly_nth") return "Repeats monthly";

  return "Recurring";
}

function EventColumn({
  title,
  titleClass,
  events,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <section>
      <h2 className={`mb-6 text-2xl font-black ${titleClass}`}>{title}</h2>

      <div className="grid gap-5">
        {events.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
            No events here.
          </div>
        )}

        {events.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            {event.flyer_url &&
              (event.flyer_url.toLowerCase().includes(".pdf") ? (
                <a
                  href={event.flyer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-5 inline-flex rounded-full bg-[#5e17eb] px-5 py-3 font-bold text-white"
                >
                  View Flyer PDF
                </a>
              ) : (
                <img
                  src={event.flyer_url}
                  alt={event.title}
                  className="mb-5 h-48 w-full rounded-xl object-cover object-top"
                />
              ))}

            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[#171717]">
                  {event.title}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#5e17eb]">
                    {event.display_date || event.event_date}
                  </p>

                  {event.event_time && (
                    <p className="text-sm font-semibold text-[#5e17eb]">
                      {formatTime(event.event_time)}
                      {event.event_end_time
                        ? ` – ${formatTime(event.event_end_time)}`
                        : ""}
                    </p>
                  )}

                  {event.term_time_only && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      Term Time Only
                    </span>
                  )}

                  {recurrenceLabel(event) && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-[#5e17eb]">
                      {recurrenceLabel(event)}
                    </span>
                  )}
                </div>

                {event.source && (
                  <p className="mt-1 text-sm text-gray-500">
                    By {event.source}
                  </p>
                )}

                {event.location && (
                  <p className="text-sm text-gray-500">{event.location}</p>
                )}

                {event.external_url && (
                  <a
                    href={event.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-black text-[#ff914d] transition hover:text-[#5e17eb]"
                  >
                    Visit website →
                  </a>
                )}
              </div>

              <span className="rounded-full bg-[#faf8ff] px-3 py-1 text-xs font-bold text-[#5e17eb]">
                {event.status}
              </span>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onEdit(event)}
                className="rounded bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
              >
                Edit
              </button>

              {event.status !== "published" && (
                <button
                  onClick={() => onStatusChange(event, "published")}
                  className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Approve
                </button>
              )}

              {event.status !== "pending" && (
                <button
                  onClick={() => onStatusChange(event, "pending")}
                  className="rounded bg-orange-500 px-4 py-2 text-sm font-bold text-white"
                >
                  Move to pending
                </button>
              )}

              <button
                onClick={() => onDelete(event)}
                className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}