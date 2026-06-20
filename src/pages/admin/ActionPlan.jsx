import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import SEO from "../../components/seo/SEO";

export default function AdminActionPlan() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    setLoading(true);

    const { data, error } = await supabase
      .from("cap_sections")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      console.error(error);
      alert("Could not load Action Plan sections.");
      setSections([]);
    } else {
      setSections(data || []);
    }

    setLoading(false);
  }

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function resetForm() {
    setTitle("");
    setDate("");
    setContent("");
    setFeedback("");
    setEditingId(null);
  }

  function startEdit(section) {
    setEditingId(section.id);
    setTitle(section.title || "");
    setDate(section.date ? section.date.split("T")[0] : "");
    setContent(section.content || "");
    setFeedback(section.councillor_feedback?.join("\n") || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaveSection(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    const feedbackItems = feedback
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: generateSlug(title),
      date: date || new Date().toISOString(),
      content: content.trim(),
      councillor_feedback: feedbackItems,
    };

    if (editingId) {
      const { error } = await supabase
        .from("cap_sections")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Could not update section.");
        return;
      }
    } else {
      const position = sections.length + 1;

      const { error } = await supabase.from("cap_sections").insert([
        {
          ...payload,
          position,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Could not add section.");
        return;
      }
    }

    resetForm();
    fetchSections();
  }

  async function handleDelete(section) {
    if (!confirm(`Delete "${section.title}"?`)) return;

    const { error } = await supabase
      .from("cap_sections")
      .delete()
      .eq("id", section.id);

    if (error) {
      console.error(error);
      alert("Could not delete section.");
      return;
    }

    fetchSections();
  }

  async function moveSection(id, direction) {
    const index = sections.findIndex((section) => section.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    [reordered[index], reordered[newIndex]] = [
      reordered[newIndex],
      reordered[index],
    ];

    const updates = reordered.map((section, idx) =>
      supabase
        .from("cap_sections")
        .update({ position: idx + 1 })
        .eq("id", section.id)
    );

    await Promise.all(updates);
    fetchSections();
  }

  return (
    <AdminLayout>
       <SEO title="Manage Action Plan" noindex />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">
          Community Action Plan
        </h1>

        <p className="text-sm text-gray-500">
          Add, edit, delete and reorder Action Plan sections.
        </p>
      </div>

      <form
        onSubmit={handleSaveSection}
        className="mb-10 grid gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-black text-[#171717]">
          {editingId ? "Edit section" : "Add new section"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section title"
          className="rounded-xl border p-3"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border p-3"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Section content"
          rows="6"
          className="rounded-xl border p-3"
        />

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Councillor feedback — one item per line"
          rows="4"
          className="rounded-xl border p-3"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white"
          >
            {editingId ? "Update section" : "Add section"}
          </button>

          {editingId && (
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
        <p>Loading sections...</p>
      ) : (
        <div className="grid gap-4">
          {sections.map((section, index) => (
            <article
              key={section.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <p className="mb-2 text-sm font-bold text-[#5e17eb]">
                    Position {section.position}
                  </p>

                  <h3 className="text-2xl font-black text-[#171717]">
                    {section.title}
                  </h3>

                  {section.date && (
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(section.date).toLocaleDateString("en-GB")}
                    </p>
                  )}

                  <p className="mt-4 whitespace-pre-line text-gray-700">
                    {section.content}
                  </p>

                  {section.councillor_feedback?.length > 0 && (
                    <div className="mt-5 rounded-xl border-l-4 border-[#ff914d] bg-[#faf8ff] p-4">
                      <p className="mb-2 font-bold text-[#171717]">
                        Councillor feedback
                      </p>

                      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {section.councillor_feedback.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSection(section.id, "up")}
                    className="rounded bg-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
                  >
                    ↑ Up
                  </button>

                  <button
                    type="button"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(section.id, "down")}
                    className="rounded bg-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
                  >
                    ↓ Down
                  </button>

                  <button
                    type="button"
                    onClick={() => startEdit(section)}
                    className="rounded bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(section)}
                    className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}