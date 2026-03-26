/**
 * Force-download a file by fetching it as a blob.
 * This bypasses the browser's cross-origin restriction on the `download` attribute.
 */
export async function downloadFile(
  url: string,
  filename: string,
): Promise<void> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch file");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}
