import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-[#faf8ff] py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="mb-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5e17eb] shadow-sm">
          Page not found
        </span>

        <h1 className="mb-6 text-5xl font-black text-[#171717] md:text-6xl">
          Sorry, we can’t find that page
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
          The page may have moved, the link may be out of date, or the address
          may have been typed incorrectly.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/" variant="orange">
            Go to homepage
          </Button>

          <Button to="/events" variant="outline">
            View events
          </Button>

          <Button to="/news" variant="outline">
            View news
          </Button>
        </div>
      </div>
    </section>
  );
}