import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

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
  term_time_only: false,
};

export default function SubmitEvent() {
  const [form, setForm] = useState(emptyForm);
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

    if (!form.title || !form.event_date || !form.description) {
      alert("Please fill in title, event date and description.");
      return;
    }

    setSubmitting(true);

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
      term_time_only: form.term_time_only,
      status: "pending",
      recurrence_type: "none",
      repeat_interval: 1,
      recurrence_end_date: null,
      week_number: null,
      weekday: null,
    };

    const { error } = await supabase.from("local_events").insert([payload]);

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert(error.message || "Could not submit event.");
      return;
    }

    setForm(emptyForm);
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

          <label className="flex items-center gap-3 rounded-xl border p-3">
            <input
              type="checkbox"
              checked={form.term_time_only}
              onChange={(e) => updateField("term_time_only", e.target.checked)}
            />

            <span className="font-medium text-[#171717]">Term time only</span>
          </label>

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
  );
}