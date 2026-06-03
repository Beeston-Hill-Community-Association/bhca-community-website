import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabaseClient";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
  .from("media")
  .select("*")
  .eq("folder", "gallery")
  .eq("highlighted", true)
  .order("display_order", { ascending: true })
  .limit(5);

      if (error) {
        console.error(error);
        return;
      }

      setImages(data || []);
    }

    fetchImages();
  }, []);

  if (images.length === 0) {
    return null;
  }

  const slides = images.map((image) => ({
    src: image.url,
    title: image.name || "BHCA community image",
  }));

  return (
    <section className="bg-[#faf8ff] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#faf8ff] px-4 py-2 text-sm font-bold text-[#5e17eb]">
            Community gallery
          </span>

          <h2 className="mb-4 text-4xl font-black text-[#171717] md:text-5xl">
            Community moments
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Celebrating local events, activities and the people helping shape
            Beeston Hill.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4 md:grid-rows-2">
          {images.map((image, imageIndex) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setIndex(imageIndex)}
              className={`group overflow-hidden rounded-[2rem] text-left ${
                imageIndex === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={image.url}
                alt={image.name || "BHCA community image"}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button to="/gallery">View full gallery</Button>
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </section>
  );
}