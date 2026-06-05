import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { R2_UPLOAD_URL } from "../../lib/config";

export default function R2Uploader({
  folder = "gallery",
  onUpload,
  accept = "image/*",
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("You must be logged in to upload files.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(R2_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const result = await response.json();

    setUploading(false);

    if (!response.ok) {
      alert(result?.message || "Upload failed.");
      return;
    }

    onUpload(result.url);
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
      />

      <p className="mt-3 text-sm text-gray-500">
        {uploading ? "Uploading..." : "Upload file to R2"}
      </p>
    </div>
  );
}