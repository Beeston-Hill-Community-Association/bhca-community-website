import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import R2Uploader from "../../components/admin/R2Uploader";
import MediaPicker from "../../components/admin/MediaPicker";
import SEO from "../../components/seo/SEO";

export default function News() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("BHCA News");
  const [imageId, setImageId] = useState("");
  const [media, setMedia] = useState([]);
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  function createSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function loadData() {
    setFetching(true);

    const [
      { data: mediaData, error: mediaError },
      { data: articleData, error },
    ] = await Promise.all([
      supabase
        .from("media")
        .select("id, name, url")
        .order("created_at", { ascending: false }),
      supabase
        .from("newsletters")
        .select("*")
        .order("published_at", { ascending: false }),
    ]);

    if (mediaError) console.error(mediaError);
    if (error) console.error(error);

    setMedia(mediaData || []);
    setArticles(articleData || []);
    setFetching(false);
  }

  function selectedImage() {
    return media.find((item) => String(item.id) === String(imageId));
  }

  function startEdit(article) {
    setTitle(article.title || "");
    setContent(article.content || "");
    setExcerpt(article.excerpt || "");
    setCategory(article.category || "BHCA News");
    setImageId(article.image_id ? String(article.image_id) : "");
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setTitle("");
    setContent("");
    setExcerpt("");
    setCategory("BHCA News");
    setImageId("");
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      slug: createSlug(title),
      content: content.trim(),
      excerpt: excerpt.trim() || null,
      category: category.trim() || "BHCA News",
      image_id: imageId ? Number(imageId) : null,
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from("newsletters")
        .update(payload)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("newsletters").insert([
        {
          ...payload,
          published_at: new Date().toISOString(),
        },
      ]));
    }

    setLoading(false);

    if (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
      return;
    }

    alert(editingId ? "Article updated." : "Article published.");
    cancelEdit();
    loadData();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this article? This cannot be undone.")) return;

    const { error } = await supabase.from("newsletters").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
      return;
    }

    setArticles((prev) => prev.filter((article) => article.id !== id));
  }

  return (
    <AdminLayout>
      <SEO title="Manage News" noindex />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">News</h1>

        <p className="text-sm text-gray-500">
          Create, edit and delete news articles.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid gap-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-black text-[#171717]">
          {editingId ? "Edit article" : "Add news article"}
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="rounded-xl border p-3"
          required
        />

        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short preview / excerpt"
          maxLength={150}
          className="rounded-xl border p-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="BHCA News">BHCA News</option>
          <option value="Community">Community</option>
          <option value="Youth">Youth</option>
          <option value="Events">Events</option>
          <option value="Volunteering">Volunteering</option>
          <option value="Local Updates">Local Updates</option>
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Article content"
          rows="10"
          className="rounded-xl border p-3"
          required
        />

        <MediaPicker
          folders={["news", "gallery", "aerial"]}
          label="Choose existing news image"
          onSelect={(url) => {
            const picked = media.find((item) => item.url === url);
            if (picked) setImageId(String(picked.id));
          }}
        />

        <R2Uploader
          folder="news"
          onUpload={async (url) => {
            const { data, error } = await supabase
              .from("media")
              .insert([
                {
                  name: title || "News image",
                  url,
                  folder: "news",
                  highlighted: false,
                },
              ])
              .select()
              .single();

            if (error) {
              console.error(error);
              alert("Image uploaded, but could not save to media library.");
              return;
            }

            setMedia((prev) => [data, ...prev]);
            setImageId(String(data.id));
          }}
        />

        <select
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="">No featured image</option>
          {media.map((img) => (
            <option key={img.id} value={img.id}>
              {img.name || `Image #${img.id}`}
            </option>
          ))}
        </select>

        {selectedImage() && (
          <img
            src={selectedImage().url}
            alt="Selected preview"
            className="h-40 w-full max-w-sm rounded-xl object-cover shadow-sm"
          />
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#5e17eb] px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update article"
                : "Publish article"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full bg-gray-300 px-6 py-3 font-bold text-[#171717]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section>
        <h2 className="mb-6 text-2xl font-black text-[#171717]">
          Published articles
        </h2>

        {fetching ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
            No articles yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {articles.map((article) => {
              const image = media.find((item) => item.id === article.image_id);

              return (
                <article
                  key={article.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  {image && (
                    <img
                      src={image.url}
                      alt={article.title}
                      className="mb-4 h-40 w-full rounded-xl object-cover"
                    />
                  )}

                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#ff914d]">
                    {article.category || "BHCA News"}
                  </p>

                  <h3 className="text-lg font-black text-[#171717]">
                    {article.title}
                  </h3>

                  {article.slug && (
                    <p className="mb-2 text-xs text-gray-400">
                      /news/{article.slug}
                    </p>
                  )}

                  <p className="mb-3 text-sm text-gray-500">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString(
                          "en-GB"
                        )
                      : "No publish date"}
                  </p>

                  {article.excerpt && (
                    <p className="mb-4 text-sm text-gray-600">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(article)}
                      className="rounded bg-yellow-500 px-4 py-2 text-sm font-bold text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(article.id)}
                      className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}