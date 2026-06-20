import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/seo/SEO";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("All");
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

  const eventNames = [
    "All",
    ...new Set(galleryImages.map((image) => image.event_name).filter(Boolean)),
  ];

  const filteredImages =
    selectedEvent === "All"
      ? galleryImages
      : galleryImages.filter((image) => image.event_name === selectedEvent);

 const slides = filteredImages.map((image) => ({
  src: image.url,
  title: image.event_name || "BHCA gallery image",
  description: image.caption || "",
}));

  return (
    <>
    <SEO
  title="Gallery"
  description="Photos from BHCA events, community activities and local projects across Beeston Hill."
/>
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
            <>
              {eventNames.length > 1 && (
                <div className="mb-10 flex flex-wrap gap-3">
                  {eventNames.map((eventName) => (
                    <button
                      key={eventName}
                      type="button"
                      onClick={() => {
                        setSelectedEvent(eventName);
                        setIndex(-1);
                      }}
                      className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                        selectedEvent === eventName
                          ? "bg-[#5e17eb] text-white"
                          : "bg-[#faf8ff] text-[#5e17eb] hover:bg-purple-100"
                      }`}
                    >
                      {eventName}
                    </button>
                  ))}
                </div>
              )}

              {filteredImages.length === 0 ? (
                <div className="rounded-[2rem] bg-[#faf8ff] p-8 text-gray-600">
                  No images found for this event.
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredImages.map((image, i) => (
                    <button
                      type="button"
                      key={image.id}
                      onClick={() => setIndex(i)}
                      className="group overflow-hidden rounded-[2rem] bg-[#faf8ff] text-left shadow-sm"
                    >
                      <div className="overflow-hidden">
                        <img
                          src={image.url}
                          alt={
                            image.caption || image.name || "BHCA gallery image"
                          }
                          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      {(image.caption || image.event_name) && (
                        <div className="p-5">
                          {image.event_name && (
                            <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#5e17eb]">
                              {image.event_name}
                            </p>
                          )}

                          {image.caption && (
                            <p className="text-sm leading-relaxed text-gray-600">
                              {image.caption}
                            </p>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Captions]}
      />
    </div>
    </>
  );
}