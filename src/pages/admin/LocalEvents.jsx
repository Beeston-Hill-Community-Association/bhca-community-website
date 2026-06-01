import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import R2Uploader from "../../components/admin/R2Uploader";

const emptyForm = {
  title: "",
  event_date: "",
  description: "",
  organiser: "",
  location: "",
  flyer_url: "",
  status: "published",
  term_time_only: false,
};

export default function LocalEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      alert("Could not load local events.");
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
    setEditingEvent(event);

    setForm({
      title: event.title || "",
      event_date: event.event_date || "",
      description: event.description || "",
      organiser: event.organiser || "",
      location: event.location || "",
      flyer_url: event.flyer_url || "",
      status: event.status || "published",
      term_time_only: Boolean(event.term_time_only),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingEvent(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.event_date || !form.description) {
      alert("Please fill in title, date and description.");
      return;
    }

    if (editingEvent) {
      const { error } = await supabase
        .from("local_events")
        .update(form)
        .eq("id", editingEvent.id);

      if (error) {
        console.error(error);
        alert("Could not update event.");
        return;
      }
    } else {
      const { error } = await supabase.from("local_events").insert([form]);

      if (error) {
        console.error(error);
        alert("Could not add event.");
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
      alert("Could not update status.");
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
      alert("Could not delete event.");
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
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">
          Local Events
        </h1>

        <p className="text-sm text-gray-500">
          Manage local listings and approve submitted events.
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
          value={form.event_date}
          onChange={(e) => updateField("event_date", e.target.value)}
          placeholder="Event date, e.g. Every Wednesday"
          className="rounded-xl border p-3"
        />

        <input
          value={form.organiser}
          onChange={(e) => updateField("organiser", e.target.value)}
          placeholder="Organiser"
          className="rounded-xl border p-3"
        />

        <input
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="Location"
          className="rounded-xl border p-3"
        />

        <label className="flex items-center gap-3 rounded-xl border p-3">
          <input
            type="checkbox"
            checked={form.term_time_only}
            onChange={(e) =>
              updateField("term_time_only", e.target.checked)
            }
          />

          <span className="font-medium text-[#171717]">
            Term time only
          </span>
        </label>

        <R2Uploader
          folder="local-events"
          onUpload={(url) => updateField("flyer_url", url)}
        />

        {form.flyer_url && (
          <img
            src={form.flyer_url}
            alt="Local event flyer preview"
            className="h-56 w-full max-w-md rounded-xl object-cover"
          />
        )}

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
            {event.flyer_url && (
              <img
                src={event.flyer_url}
                alt={event.title}
                className="mb-5 h-48 w-full rounded-xl object-cover"
              />
            )}

            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[#171717]">
                  {event.title}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#5e17eb]">
                    {event.event_date}
                  </p>

                  {event.term_time_only && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      Term Time Only
                    </span>
                  )}
                </div>

                {event.organiser && (
                  <p className="mt-1 text-sm text-gray-500">
                    Organised by {event.organiser}
                  </p>
                )}

                {event.location && (
                  <p className="text-sm text-gray-500">{event.location}</p>
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