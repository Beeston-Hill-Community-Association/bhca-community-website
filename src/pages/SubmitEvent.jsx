import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";
import R2Uploader from "../components/admin/R2Uploader";

const emptyForm = {
  title: "",
  event_date: "",
  display_date: "",
  event_time: "",
  event_end_time: "",
  description: "",
  source: "",
  contact_email: "",
  location: "",
  external_url: "",
  flyer_url: "",
  term_time_only: false,
  recurrence_type: "none",
  repeat_interval: 1,
  recurrence_end_date: "",
  week_number: "",
  weekday: "",
};

export default function SubmitEvent() {
  const [form, setForm] = useState(emptyForm);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.event_date || !form.description || !form.contact_email) {
      alert("Please fill in title, event date, contact email and description.");
      return;
    }

    setSubmitting(true);

    const recurrenceType = showRecurrence ? form.recurrence_type : "none";

    const payload = {
      title: form.title,
      event_date: form.event_date,
      display_date: form.display_date || null,
      event_time: form.event_time || null,
      event_end_time: form.event_end_time || null,
      description: form.description,
      source: form.source || null,
      contact_email: form.contact_email || null,
      location: form.location || null,
      external_url: form.external_url || null,
      flyer_url: form.flyer_url || null,
      term_time_only: form.term_time_only,
      status: "pending",
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

    const { error } = await supabase.from("local_events").insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert(error.message || "Could not submit event.");
      return;
    }

    setForm(emptyForm);
    setShowRecurrence(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl bg-white p-10 shadow-sm">
            <h1 className="mb-4 text-4xl font-black text-[#171717]">
              Thanks for submitting your event
            </h1>

            <p className="text-lg text-gray-600">
              Your event has been sent for review. Once approved, it will appear
              in the local events listings.
            </p>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-8 rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white"
            >
              Submit another event
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <SEO
        title="Submit a Local Event"
        description="Submit a local event or activity to be considered for listing on the Beeston Hill Community Association website."
      />

      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5e17eb] shadow-sm">
              Submit an event
            </span>

            <h1 className="mb-4 text-4xl font-black text-[#171717] md:text-5xl">
              Share something happening locally
            </h1>

            <p className="text-lg text-gray-600">
              Add your community event, activity or local listing for review.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:p-8"
          >
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
              type="email"
              value={form.contact_email}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="Contact email"
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
                    onChange={(e) =>
                      updateField("repeat_interval", e.target.value)
                    }
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
                    aria-label="Repeat end date"
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
              placeholder="Flyer/image URL, optional"
              className="rounded-xl border p-3"
            />

            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Short description"
              rows="5"
              className="rounded-xl border p-3"
            />

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit event"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}