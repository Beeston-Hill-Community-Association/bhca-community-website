import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function MediaPicker({
  folders = ["events"],
  onSelect,
  label = "Choose from uploaded media",
}) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchMedia() {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .in("folder", folders)
        .order("created_at", { ascending: false });

      if (!error) setItems(data || []);
    }

    fetchMedia();
  }, [folders.join(",")]);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full bg-[#faf8ff] px-5 py-2 text-sm font-bold text-[#5e17eb]"
      >
        {open ? "Hide uploaded media" : label}
      </button>

      {open && (
        <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border p-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">No uploaded media found.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    setOpen(false);
                  }}
                  className="overflow-hidden rounded-xl border text-left transition hover:ring-2 hover:ring-[#5e17eb]"
                >
                  <img
                    src={item.url}
                    alt={item.name || "Media item"}
                    className="h-28 w-full object-cover"
                  />

                  <div className="p-2">
                    <p className="text-xs font-bold text-[#171717]">
                      {item.name || "Untitled"}
                    </p>

                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      {item.folder}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}