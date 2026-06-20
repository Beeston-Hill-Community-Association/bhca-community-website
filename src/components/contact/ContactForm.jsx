import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setIsSending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      form.reset();
      setStatus("Thanks, your message has been sent.");
    } catch {
      setStatus("Sorry, something went wrong. Please email contact@beestonhill.org.uk instead.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-black text-[#171717]">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[#171717] shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#5e17eb] focus:ring-4 focus:ring-[#5e17eb]/10"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-black text-[#171717]">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@email.com"
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[#171717] shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#5e17eb] focus:ring-4 focus:ring-[#5e17eb]/10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-black text-[#171717]">
          What is this about?
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[#171717] shadow-sm outline-none transition focus:border-[#5e17eb] focus:ring-4 focus:ring-[#5e17eb]/10"
        >
          <option value="">Please choose one</option>
          <option value="Volunteering">Volunteering</option>
          <option value="Events">Events</option>
          <option value="Partnerships">Partnerships</option>
          <option value="Community idea">Community idea</option>
          <option value="Local priority">Local priority</option>
          <option value="General enquiry">General enquiry</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-black text-[#171717]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="7"
          required
          placeholder="Tell us how we can help..."
          className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[#171717] shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#5e17eb] focus:ring-4 focus:ring-[#5e17eb]/10"
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        className="w-full rounded-full bg-[#5e17eb] px-8 py-4 text-base font-black text-white shadow-sm transition hover:bg-[#ff914d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSending ? "Sending..." : "Send message"}
      </button>

      {status && (
        <p className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-[#171717]">
          {status}
        </p>
      )}
    </form>
  );
}