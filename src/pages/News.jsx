import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const [{ data: articleData }, { data: mediaData }] = await Promise.all([
        supabase
          .from("newsletters")
          .select("*")
          .order("published_at", { ascending: false }),
        supabase.from("media").select("*"),
      ]);

      setArticles(articleData || []);
      setMedia(mediaData || []);
      setLoading(false);
    }

    fetchNews();
  }, []);

  function getImage(article) {
    return media.find((item) => item.id === article.image_id);
  }

  return (
    <>
    <SEO
  title="News"
  description="Read the latest news, updates and community stories from Beeston Hill Community Association."
/>
    
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            News
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Latest news from BHCA
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Updates, stories and community news from Beeston Hill Community
            Association.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8ff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-gray-600">Loading news...</p>
          ) : articles.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-gray-600">
              No news articles are published yet.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                const image = getImage(article);

                return (
                  <article
                    key={article.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {image?.url && (
                      <img
                        src={image.url}
                        alt={image.name || article.title}
                        className="h-56 w-full object-cover"
                      />
                    )}

                    <div className="p-7">
                      <p className="mb-3 text-sm font-bold text-[#ff914d]">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString(
                              "en-GB"
                            )
                          : "BHCA News"}
                      </p>

                      <h2 className="mb-4 text-2xl font-black text-[#171717]">
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="mb-6 leading-relaxed text-gray-600">
                          {article.excerpt}
                        </p>
                      )}

                      <Button
  to={article.slug ? `/news/${article.slug}` : `/news/${article.id}`}
  variant="outline"
  className="px-5 py-3"
>
  Read more
</Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#faf8ff] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="mb-5 text-4xl font-black text-[#171717]">
              Have a community update to share?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Let us know about local news, activities or stories that residents
              may want to hear about.
            </p>

            <Button to="/contact" variant="orange">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}