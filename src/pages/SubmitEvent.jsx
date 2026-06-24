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
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function getFriendlyError(error) {
    const message = error?.message || "";

    if (message.includes("row-level security")) {
      return "We could not submit your event because public event submissions are not currently enabled. Please contact us and we will fix this.";
    }

    if (message.includes("contact_email")) {
      return "There was a problem saving the contact email. Please check the email address and try again.";
    }

    if (message.includes("flyer_url")) {
      return "There was a problem saving the flyer or image. Please try again without the flyer, or paste a link instead.";
    }

    if (message.includes("violates not-null constraint")) {
      return "Some required information is missing. Please check the required fields and try again.";
    }

    return message || "Could not submit event. Please check the form and try again.";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!form.title || !form.event_date || !form.contact_email || !form.description) {
      setErrorMessage(
        "Please complete the required fields: event title, event date, contact email and short description."
      );
      return;
    }

    setSubmitting(true);

    try {
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

if (error) {
  console.error(error);
  setErrorMessage(getFriendlyError(error));
  return;
}

try {
  await fetch(
    "https://bhca-contact-api.noisy-darkness-c395.workers.dev/event-submission",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
} catch (emailError) {
  console.error("Event notification email failed:", emailError);
}

setForm(emptyForm);
setShowRecurrence(false);
setSubmitted(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(getFriendlyError(error));
    } finally {
      setSubmitting(false);
    }
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
              onClick={() => {
                setSubmitted(false);
                setErrorMessage("");
              }}
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
            className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm md:p-8"
          >
            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Event title *
              </label>
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Event title"
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Event date *
              </label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => updateField("event_date", e.target.value)}
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Display date
              </label>
              <input
                value={form.display_date}
                onChange={(e) => updateField("display_date", e.target.value)}
                placeholder="For example: Every Wednesday"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold text-[#171717]">
                  Start time
                </label>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={(e) => updateField("event_time", e.target.value)}
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-[#171717]">
                  End time
                </label>
                <input
                  type="time"
                  value={form.event_end_time}
                  onChange={(e) =>
                    updateField("event_end_time", e.target.value)
                  }
                  className="w-full rounded-xl border p-3"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Your name / organisation
              </label>
              <input
                value={form.source}
                onChange={(e) => updateField("source", e.target.value)}
                placeholder="Your name or organisation"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Contact email *
              </label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => updateField("contact_email", e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Website / booking page
              </label>
              <input
                value={form.external_url}
                onChange={(e) => updateField("external_url", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border p-3"
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                checked={form.term_time_only}
                onChange={(e) =>
                  updateField("term_time_only", e.target.checked)
                }
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
                <div>
                  <label className="mb-2 block font-bold text-[#171717]">
                    Repeat type
                  </label>
                  <select
                    value={form.recurrence_type}
                    onChange={(e) =>
                      updateField("recurrence_type", e.target.value)
                    }
                    className="w-full rounded-xl border p-3"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly, same date</option>
                    <option value="monthly_nth">
                      Monthly, e.g. 1st Saturday
                    </option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-bold text-[#171717]">
                      Repeat every
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.repeat_interval}
                      onChange={(e) =>
                        updateField("repeat_interval", e.target.value)
                      }
                      className="w-full rounded-xl border p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-[#171717]">
                      Repeat until
                    </label>
                    <input
                      type="date"
                      value={form.recurrence_end_date}
                      onChange={(e) =>
                        updateField("recurrence_end_date", e.target.value)
                      }
                      className="w-full rounded-xl border p-3"
                    />
                  </div>
                </div>

                {(form.recurrence_type === "weekly" ||
                  form.recurrence_type === "monthly_nth") && (
                  <div>
                    <label className="mb-2 block font-bold text-[#171717]">
                      Day of week
                    </label>
                    <select
                      value={form.weekday}
                      onChange={(e) => updateField("weekday", e.target.value)}
                      className="w-full rounded-xl border p-3"
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
                  </div>
                )}

                {form.recurrence_type === "monthly_nth" && (
                  <div>
                    <label className="mb-2 block font-bold text-[#171717]">
                      Week in month
                    </label>
                    <select
                      value={form.week_number}
                      onChange={(e) =>
                        updateField("week_number", e.target.value)
                      }
                      className="w-full rounded-xl border p-3"
                    >
                      <option value="">Select week in month</option>
                      <option value="1">1st</option>
                      <option value="2">2nd</option>
                      <option value="3">3rd</option>
                      <option value="4">4th</option>
                      <option value="-1">Last</option>
                    </select>
                  </div>
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

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Flyer/image URL
              </label>
              <input
                value={form.flyer_url}
                onChange={(e) => updateField("flyer_url", e.target.value)}
                placeholder="Optional link to a flyer or image"
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#171717]">
                Short description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Tell us what the event is about"
                rows="5"
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <p className="text-sm text-gray-500">
              Fields marked with * are required. Submitted events are reviewed
              before appearing on the website.
            </p>

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