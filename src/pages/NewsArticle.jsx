import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";

export default function NewsArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);

      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setArticle(data);

        if (data.image_id) {
          const { data: mediaItem } = await supabase
            .from("media")
            .select("*")
            .eq("id", data.image_id)
            .single();

          setImage(mediaItem || null);
        }
      }

      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-gray-600">Loading article...</p>
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-black text-[#171717]">
            Article not found
          </h1>

          <Button to="/news">Back to news</Button>
        </div>
      </section>
    );
  }

  return (
  <>
    <SEO
      title={article.title}
      description={
        article.excerpt ||
        article.content?.substring(0, 160) ||
        "Latest news from Beeston Hill Community Association."
      }
      type="article"
    />
    <article>
      <section className="bg-[#5e17eb] py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/news"
            className="mb-8 inline-block font-bold text-white/80 hover:text-[#ff914d]"
          >
            ← Back to news
          </Link>

          <div className="mb-4 text-sm font-bold text-[#ff914d]">
            {article.category || "BHCA News"}
            {article.published_at
              ? ` • ${new Date(article.published_at).toLocaleDateString(
                  "en-GB"
                )}`
              : ""}
          </div>

          <h1 className="mb-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="max-w-3xl text-xl leading-relaxed text-white/80">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      {image?.url && (
  <section className="bg-white py-12">
    <div className="mx-auto max-w-5xl px-6">
      <div className="overflow-hidden rounded-[2rem] bg-[#faf8ff] shadow-lg">
        <img
          src={image.url}
          alt={image.name || article.title}
          className="max-h-[650px] w-full object-contain"
        />
      </div>
    </div>
  </section>
)}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="whitespace-pre-line text-lg leading-relaxed text-gray-700">
            {article.content}
          </div>

          <div className="mt-12">
            <Button to="/news" variant="outline">
              Back to news
            </Button>
          </div>
        </div>
      </section>
    </article>
    </>
  );
}