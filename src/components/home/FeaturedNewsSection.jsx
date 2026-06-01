import Button from "../ui/Button";
import { news } from "../../data/newsData";

const featuredArticle = news.find((article) => article.featured);

export default function FeaturedNewsSection() {
  if (!featuredArticle) return null;

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
          {featuredArticle.image && (
            <div className="min-h-[320px]">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-4 text-sm font-bold text-[#ff914d]">
              {featuredArticle.category} • {featuredArticle.date}
            </div>

            <h3 className="mb-5 text-3xl font-black text-[#171717] md:text-4xl">
              {featuredArticle.title}
            </h3>

            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              {featuredArticle.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button to={`/news/${featuredArticle.slug}`}>
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