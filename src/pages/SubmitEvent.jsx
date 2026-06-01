import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Button from "../components/ui/Button";

export default function SubmitEvent() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [termTimeOnly, setTermTimeOnly] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const getValue = (name) => form.elements.namedItem(name)?.value || "";

    const recurrenceType = showRecurrence
      ? getValue("recurrence_type")
      : "none";

    const payload = {
      title: getValue("title"),
      event_date: getValue("date"),
      event_time: getValue("start_time") || null,
      event_end_time: getValue("end_time") || null,
      location: getValue("location") || null,
      description: getValue("description") || null,
      external_url: getValue("url") || null,
      source: getValue("source") || "Public suggestion",
      flyer_url: null,
      status: "pending",
      term_time_only: termTimeOnly,
      recurrence_type: recurrenceType,
      repeat_interval:
        recurrenceType !== "none"
          ? parseInt(getValue("repeat_interval")) || 1
          : 1,
      recurrence_end_date:
        recurrenceType !== "none"
          ? getValue("recurrence_end_date") || null
          : null,
      week_number:
        recurrenceType === "monthly_nth"
          ? parseInt(getValue("week_number"))
          : null,
      weekday:
        recurrenceType === "weekly" || recurrenceType === "monthly_nth"
          ? getValue("weekday")
          : null,
      category: getValue("category") || "Community",
    };

    const { error } = await supabase.from("local_events").insert([payload]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Submission failed: " + error.message);
      return;
    }

    form.reset();
    setShowRecurrence(false);
    setTermTimeOnly(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-[2rem] bg-white p-10 shadow-sm">
            <h1 className="mb-4 text-4xl font-black text-[#171717]">
              Event submitted
            </h1>

            <p className="mb-8 text-lg text-gray-600">
              Thank you. Your event has been submitted for review and will be
              checked before it appears on the website.
            </p>

            <Button to="/events">Back to events</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf8ff] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5e17eb] shadow-sm">
            Submit an event
          </span>

          <h1 className="mb-5 text-5xl font-black text-[#171717]">
            Suggest a local event
          </h1>

          <p className="text-lg leading-relaxed text-gray-600">
            Tell us about a local activity, group, course, fundraiser or event
            that Beeston Hill residents may want to know about.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-bold text-[#171717]">
              Event title *
            </label>
            <input
              name="title"
              required
              placeholder="e.g. Book Buddies Reading Group"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#171717]">
              Event type *
            </label>
            <select
              name="category"
              required
              defaultValue="Community"
              className="w-full rounded-xl border p-3"
            >
              <option value="Community">Community</option>
              <option value="Youth">Youth</option>
              <option value="Family">Family</option>
              <option value="Learning">Learning</option>
              <option value="Training">Training</option>
              <option value="Employment">Employment</option>
              <option value="Support">Support</option>
              <option value="Fundraiser">Fundraiser</option>
              <option value="Volunteer Day">Volunteer Day</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Date *
              </label>
              <input
                name="date"
                type="date"
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Start time
              </label>
              <input
                name="start_time"
                type="time"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                End time
              </label>
              <input
                name="end_time"
                type="time"
                className="w-full rounded-xl border p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#171717]">
              Location
            </label>
            <input
              name="location"
              placeholder="e.g. Building Blocks, Maud Avenue"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#171717]">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Briefly describe the event and who it is for."
              className="w-full resize-none rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#171717]">
              Website / booking link
            </label>
            <input
              name="url"
              type="url"
              placeholder="https://..."
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#171717]">
              Your name / organisation
            </label>
            <input
              name="source"
              placeholder="e.g. Local organisation name"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl bg-[#faf8ff] p-4">
            <input
              type="checkbox"
              checked={termTimeOnly}
              onChange={(e) => setTermTimeOnly(e.target.checked)}
              className="h-5 w-5"
            />

            <span className="font-bold text-[#171717]">
              Term time only
            </span>
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-[#faf8ff] p-4">
            <input
              type="checkbox"
              id="recurrence"
              checked={showRecurrence}
              onChange={(e) => setShowRecurrence(e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="recurrence" className="font-bold text-[#171717]">
              This is a recurring event
            </label>
          </div>

          {showRecurrence && (
            <div className="space-y-5 rounded-2xl bg-[#faf8ff] p-6">
              <div>
                <label className="mb-2 block font-bold text-[#171717]">
                  Recurrence type *
                </label>
                <select
                  name="recurrence_type"
                  required={showRecurrence}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly — same date</option>
                  <option value="monthly_nth">
                    Monthly — e.g. 1st Saturday
                  </option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold text-[#171717]">
                    Repeat every
                  </label>
                  <input
                    name="repeat_interval"
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold text-[#171717]">
                    End date
                  </label>
                  <input
                    name="recurrence_end_date"
                    type="date"
                    className="w-full rounded-xl border p-3"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold text-[#171717]">
                    Day of week
                  </label>
                  <select name="weekday" className="w-full rounded-xl border p-3">
                    <option value="MO">Monday</option>
                    <option value="TU">Tuesday</option>
                    <option value="WE">Wednesday</option>
                    <option value="TH">Thursday</option>
                    <option value="FR">Friday</option>
                    <option value="SA">Saturday</option>
                    <option value="SU">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-bold text-[#171717]">
                    Which week in month
                  </label>
                  <select
                    name="week_number"
                    className="w-full rounded-xl border p-3"
                  >
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                    <option value="-1">Last</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#ff914d] px-6 py-4 text-lg font-black text-[#171717] transition hover:bg-[#ffb570] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit event for approval"}
          </button>

          <p className="text-center text-sm text-gray-500">
            All local event submissions are reviewed before publishing.
          </p>
        </form>
      </div>
    </section>
  );
}