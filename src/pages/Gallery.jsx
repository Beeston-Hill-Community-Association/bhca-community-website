import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    async function fetchGalleryImages() {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setGalleryImages([]);
      } else {
        setGalleryImages(data || []);
      }

      setLoading(false);
    }

    fetchGalleryImages();
  }, []);

  const slides = galleryImages.map((image) => ({
    src: image.url,
    title: image.name || "BHCA gallery image",
  }));

  return (
    <div>
      <section className="bg-[#5e17eb] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            Gallery
          </span>

          <h1 className="mb-6 text-5xl font-black md:text-6xl">
            Community moments
          </h1>

          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Photos from local events, activities and community projects across
            Beeston Hill.
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-gray-600">Loading gallery...</p>
          ) : galleryImages.length === 0 ? (
            <div className="rounded-[2rem] bg-[#faf8ff] p-8 text-gray-600">
              No gallery images have been selected yet.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, i) => (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => setIndex(i)}
                  className="group overflow-hidden rounded-[2rem] bg-[#faf8ff] text-left"
                >
                  <img
                    src={image.url}
                    alt={image.name || "BHCA gallery image"}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </div>
  );
}