import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabaseClient";

export default function FeaturedNewsSection() {
  const [article, setArticle] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadFeaturedArticle();
  }, []);

  async function loadFeaturedArticle() {
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error(error);
      return;
    }

    setArticle(data);

    if (data.image_id) {
      const { data: image } = await supabase
        .from("media")
        .select("url")
        .eq("id", data.image_id)
        .single();

      if (image) {
        setImageUrl(image.url);
      }
    }
  }

  if (!article) return null;

  return (
    <section className="bg-[#faf8ff] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#faf8ff] px-4 py-2 text-sm font-bold text-[#5e17eb]">
            Latest news
          </span>

          <h2 className="mb-4 text-4xl font-black text-[#171717] md:text-5xl">
            Latest from BHCA
          </h2>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm md:grid md:grid-cols-2">
          {imageUrl && (
            <div className="min-h-[320px]">
              <img
                src={imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-4 text-sm font-bold text-[#ff914d]">
              {article.category || "BHCA News"} •{" "}
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString("en-GB")
                : ""}
            </div>

            <h3 className="mb-5 text-3xl font-black text-[#171717] md:text-4xl">
              {article.title}
            </h3>

            {article.excerpt && (
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Button to={`/news/${article.slug}`}>
                Read full story
              </Button>

              <Button to="/news" variant="outline">
                View all news
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}