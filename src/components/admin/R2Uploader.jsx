import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { R2_UPLOAD_URL } from "../../lib/config";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function R2Uploader({
  folder = "gallery",
  onUpload,
  accept = "image/*",
}) {
  const [uploading, setUploading] = useState(false);

  async function convertPdfToImage(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.9);
    });

    if (!blob) {
      throw new Error("Could not convert PDF to image.");
    }

    return new File([blob], file.name.replace(/\.pdf$/i, ".webp"), {
      type: "image/webp",
    });
  }

  async function uploadFile(fileToUpload, session) {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("folder", folder);

    const response = await fetch(R2_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Upload failed.");
    }

    return result.url;
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be logged in to upload files.");
        return;
      }

      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      const fileToUpload = isPdf ? await convertPdfToImage(file) : file;
      const url = await uploadFile(fileToUpload, session);

      onUpload(url);
    } catch (error) {
      console.error(error);
      alert(error.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
        {uploading
          ? "Uploading..."
          : "Upload a poster or flyer. JPG, PNG, WebP and PDF files are accepted."}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        PDFs are automatically converted into an image preview for the website.
      </p>
    </div>
  );
}