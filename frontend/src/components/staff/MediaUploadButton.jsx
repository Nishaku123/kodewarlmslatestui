import { useRef, useState } from "react";
import Button from "../ui/Button.jsx";
import { uploadManagedMediaRequest } from "../../services/manage.js";

export default function MediaUploadButton({
  kind,
  accept,
  label,
  disabled = false,
  onUploaded,
  onError,
  onUploadingChange,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(true);
    onError?.("");
    onUploadingChange?.(true);

    try {
      const response = await uploadManagedMediaRequest(file, kind);
      onUploaded(response.data.asset);
    } catch (error) {
      onError?.(error.message || "Could not upload this file.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      input.value = "";
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={uploading}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Uploading…" : label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={label}
        onChange={handleFileChange}
      />
    </>
  );
}
