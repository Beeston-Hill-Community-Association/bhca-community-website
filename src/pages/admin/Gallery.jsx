import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import R2Uploader from "../../components/admin/R2Uploader";
import { supabase } from "../../lib/supabaseClient";

const emptyForm = {
  name: "",
  url: "",
  highlighted: false,
  featured: false,
  folder: "gallery",
  display_order: "",
};

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingImage, setEditingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);

    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Could not load media.");
    } else {
      setImages(data || []);
    }

    setLoading(false);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(image) {
    setEditingImage(image);

    setForm({
      name: image.name || "",
      url: image.url || "",
      highlighted: Boolean(image.highlighted),
      featured: Boolean(image.featured),
      folder: image.folder || "gallery",
      display_order: image.display_order ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingImage(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.url) {
      alert("Please upload an image or paste an image URL.");
      return;
    }

    const payload = {
      name: form.name || "Media image",
      url: form.url,
      highlighted: form.highlighted,
      featured: form.featured,
      folder: form.folder,
      display_order:
        form.display_order === "" ? null : Number(form.display_order),
    };

    if (editingImage) {
      const { error } = await supabase
        .from("media")
        .update(payload)
        .eq("id", editingImage.id);

      if (error) {
        console.error(error);
        alert("Could not update image.");
        return;
      }
    } else {
      const { error } = await supabase.from("media").insert([payload]);

      if (error) {
        console.error(error);
        alert("Could not add image.");
        return;
      }
    }

    resetForm();
    fetchImages();
  }

  async function handleDelete(image) {
    if (!confirm(`Delete "${image.name || "this image"}"?`)) return;

    const { error } = await supabase.from("media").delete().eq("id", image.id);

    if (error) {
      console.error(error);
      alert("Could not delete image.");
      return;
    }

    setImages((prev) => prev.filter((item) => item.id !== image.id));
  }

 async function toggleHighlight(image) {
  const nextValue = !image.highlighted;

  if (nextValue && image.folder === "gallery") {
    const highlightedCount = images.filter(
      (item) => item.folder === "gallery" && item.highlighted
    ).length;

    if (highlightedCount >= 5) {
      alert("You can only highlight 5 gallery images at a time.");
      return;
    }
  }

  if (nextValue && image.folder === "heroes") {
    const otherHero = images.find(
      (item) =>
        item.folder === "heroes" &&
        item.highlighted &&
        item.id !== image.id
    );

    if (otherHero) {
      const confirmReplace = confirm(
        "Another hero image is already highlighted. Replace it?"
      );

      if (!confirmReplace) return;

      await supabase
        .from("media")
        .update({ highlighted: false })
        .eq("id", otherHero.id);
    }
  }

  const updates = {
    highlighted: nextValue,
    display_order: nextValue ? image.display_order : null,
  };

  const { error } = await supabase
    .from("media")
    .update(updates)
    .eq("id", image.id);

  if (error) {
    console.error(error);
    alert("Could not update highlighted status.");
    return;
  }

  setImages((prev) =>
    prev.map((item) => {
      if (image.folder === "heroes" && item.folder === "heroes" && item.id !== image.id) {
        return { ...item, highlighted: false };
      }

      if (item.id === image.id) {
        return { ...item, ...updates };
      }

      return item;
    })
  );
}

  async function toggleFeatured(image) {
    const nextValue = !image.featured;

    const { error } = await supabase
      .from("media")
      .update({ featured: nextValue })
      .eq("id", image.id);

    if (error) {
      console.error(error);
      alert("Could not update gallery status.");
      return;
    }

    setImages((prev) =>
      prev.map((item) =>
        item.id === image.id ? { ...item, featured: nextValue } : item
      )
    );
  }

  async function updateHomepageOrder(image, value) {
    const newOrder = value === "" ? null : Number(value);

    if (newOrder !== null && (newOrder < 1 || newOrder > 5)) {
      alert("Homepage order must be between 1 and 5.");
      return;
    }

    const { error } = await supabase
      .from("media")
      .update({ display_order: newOrder })
      .eq("id", image.id);

    if (error) {
      console.error(error);
      alert("Could not update homepage order.");
      return;
    }

    setImages((prev) =>
      prev.map((item) =>
        item.id === image.id ? { ...item, display_order: newOrder } : item
      )
    );
  }

  const filteredImages = images.filter((image) => {
    if (filter === "highlighted") return image.highlighted;
    if (filter === "gallery") return image.featured;
    if (filter === "heroes") return image.folder === "heroes";
    if (filter === "events") return image.folder === "events";
    if (filter === "local-events") return image.folder === "local-events";
    if (filter === "news") return image.folder === "news";
    if (filter === "aerial") return image.folder === "aerial";
    return true;
  });

  function filterButton(label, value) {
    const active = filter === value;

    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
          active
            ? "bg-[#5e17eb] text-white"
            : "bg-white text-[#171717] hover:bg-[#faf8ff]"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">
          Media Library
        </h1>

        <p className="text-sm text-gray-500">
          Upload and manage images for the website. Highlighted images appear on
          the homepage, and featured images appear in the public gallery.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid gap-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-black text-[#171717]">
          {editingImage ? "Edit media item" : "Add media item"}
        </h2>

        <select
          value={form.folder}
          onChange={(e) => updateField("folder", e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="gallery">Gallery</option>
          <option value="heroes">Homepage Hero</option>
          <option value="events">BHCA Events</option>
          <option value="local-events">Local Events</option>
          <option value="news">News</option>
          <option value="aerial">Aerial Photos</option>
        </select>

        <R2Uploader
          folder={form.folder}
          onUpload={(url) => updateField("url", url)}
        />

        {form.url && (
          <img
            src={form.url}
            alt="Preview"
            className="h-56 w-full max-w-md rounded-xl object-cover"
          />
        )}

        <input
          value={form.url}
          onChange={(e) => updateField("url", e.target.value)}
          placeholder="Image URL"
          className="rounded-xl border p-3"
        />

        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Image name"
          className="rounded-xl border p-3"
        />

        <input
          type="number"
          min="1"
          max="5"
          value={form.display_order}
          onChange={(e) => updateField("display_order", e.target.value)}
          placeholder="Homepage order (1-5)"
          className="rounded-xl border p-3"
        />

        <label className="flex items-center gap-2 text-sm font-bold text-[#171717]">
          <input
            type="checkbox"
            checked={form.highlighted}
            onChange={(e) => updateField("highlighted", e.target.checked)}
          />
          Highlight on homepage
        </label>

        <label className="flex items-center gap-2 text-sm font-bold text-[#171717]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => updateField("featured", e.target.checked)}
          />
          Show in public gallery
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white"
          >
            {editingImage ? "Update media item" : "Add media item"}
          </button>

          {editingImage && (
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

      <div className="mb-6 flex flex-wrap gap-3">
        {filterButton("All", "all")}
        {filterButton("Highlighted", "highlighted")}
        {filterButton("Public Gallery", "gallery")}
        {filterButton("Hero", "heroes")}
        {filterButton("Events", "events")}
        {filterButton("Local Events", "local-events")}
        {filterButton("News", "news")}
        {filterButton("Aerial", "aerial")}
      </div>

      {loading ? (
        <p>Loading media...</p>
      ) : filteredImages.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
          No media found for this filter.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image) => (
            <article
              key={image.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <img
                src={image.url}
                alt={image.name || "BHCA media image"}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-[#171717]">
                      {image.name || "Untitled image"}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {image.folder || "gallery"}
                    </p>

                    {image.display_order && (
                      <p className="mt-1 text-xs font-bold text-[#ff914d]">
                        Homepage order: {image.display_order}
                      </p>
                    )}

                    {image.highlighted && (
                      <div className="mt-3">
                        <label className="mb-1 block text-xs font-bold text-gray-500">
                          Homepage order
                        </label>

                        <select
                          value={image.display_order || ""}
                          onChange={(e) =>
                            updateHomepageOrder(image, e.target.value)
                          }
                          className="rounded-lg border px-3 py-2 text-sm"
                        >
                          <option value="">Not set</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {image.highlighted && (
                      <span className="rounded-full bg-[#faf8ff] px-3 py-1 text-xs font-bold text-[#5e17eb]">
                        Highlighted
                      </span>
                    )}

                    {image.featured && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Gallery
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleHighlight(image)}
                    className={`rounded px-4 py-2 text-sm font-bold text-white ${
                      image.highlighted ? "bg-gray-600" : "bg-[#5e17eb]"
                    }`}
                  >
                    {image.highlighted ? "Remove highlight" : "Highlight"}
                  </button>

                  <button
                    onClick={() => toggleFeatured(image)}
                    className={`rounded px-4 py-2 text-sm font-bold text-white ${
                      image.featured ? "bg-green-600" : "bg-green-500"
                    }`}
                  >
                    {image.featured ? "Remove from gallery" : "Show in gallery"}
                  </button>

                  <button
                    onClick={() => startEdit(image)}
                    className="rounded bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(image)}
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