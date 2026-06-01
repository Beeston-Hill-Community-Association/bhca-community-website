import { useState } from "react";

export default function R2Uploader({ folder = "gallery", onUpload }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(import.meta.env.VITE_R2_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_R2_UPLOAD_SECRET}`,
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
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <p className="mt-3 text-sm text-gray-500">
        {uploading ? "Uploading..." : "Upload image to R2"}
      </p>
    </div>
  );
}