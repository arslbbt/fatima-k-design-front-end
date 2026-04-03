import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { inspoApi, ApiError, type InspoUpload } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function BridePortalInspiration() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ["inspo-mine"],
    queryFn: () => inspoApi.listMine(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inspoApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspo-mine"] });
      setLightboxIdx(null);
      setConfirmDelete(null);
      toast({ title: "Photo removed" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => {
      if (!["image/jpeg", "image/png"].includes(f.type)) {
        toast({
          title: "Invalid file type",
          description: `${f.name} is not a JPEG or PNG.`,
        });
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${f.name} exceeds 10MB.`,
        });
        return false;
      }
      return true;
    });
    if (!valid.length) return;

    setUploading(true);
    try {
      await inspoApi.upload(valid.slice(0, 5));
      queryClient.invalidateQueries({ queryKey: ["inspo-mine"] });
      toast({
        title: "Photos uploaded",
        description: `${valid.length} photo${valid.length !== 1 ? "s" : ""} added to your board.`,
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <BridePortalLayout>
      {/* Lightbox */}
      {lightboxIdx !== null && uploads[lightboxIdx] && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <X size={24} />
          </button>
          <button
            onClick={() =>
              setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i))
            }
            style={{
              position: "absolute",
              left: 28,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={uploads[lightboxIdx].imageUrl}
            alt={uploads[lightboxIdx].caption ?? "Inspiration"}
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              borderRadius: 12,
              objectFit: "contain",
            }}
          />
          <button
            onClick={() =>
              setLightboxIdx((i) =>
                i !== null && i < uploads.length - 1 ? i + 1 : i,
              )
            }
            style={{
              position: "absolute",
              right: 28,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ChevronRight size={22} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 24,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {(lightboxIdx ?? 0) + 1} / {uploads.length}
          </div>
        </div>
      )}

      <main className="bp-page-main">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 6px",
                }}
              >
                Inspiration Board
              </h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                <span className="hidden sm:inline">
                  Share your vision with Fatima —{" "}
                </span>
                upload anything that inspires you
              </p>
            </div>
            <button
              className="hidden sm:flex"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Upload size={15} /> Upload Photos
                </>
              )}
            </button>
          </div>

          {/* Drop zone */}
          <div
            className="hidden sm:flex"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "1.5px dashed #D4A373",
              borderRadius: 12,
              padding: "20px 24px",
              background: "rgba(212,163,115,0.04)",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: "#F5EFE9",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Upload size={20} color="#D4A373" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#333",
                  marginBottom: 3,
                }}
              >
                Drop photos here to add to your board
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                JPEG or PNG · Max 10MB per image · Up to 5 at a time
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              style={{
                padding: "8px 18px",
                background: "#FFFFFF",
                border: "1px solid #E8E0D5",
                borderRadius: 7,
                fontSize: 12,
                color: "#555",
                cursor: "pointer",
              }}
            >
              Browse files
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />

          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <Loader2 size={24} className="animate-spin" color="#D4A373" />
            </div>
          )}

          {!isLoading && (
            <>
              {uploads.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No photos yet — upload your first inspiration image above.
                </div>
              )}
              {uploads.length > 0 && (
                <div
                  className="inspo-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  {uploads.map((photo, i) => (
                    <div
                      key={photo.id}
                      onClick={() => setLightboxIdx(i)}
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #E8E0D5",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.15s",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          height: 280,
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption ?? "Inspo"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          padding: "7px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 10, color: "#888" }}>
                          {new Date(photo.uploadedAt).toLocaleDateString(
                            "en-AU",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(photo.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                          }}
                        >
                          <Trash2 size={12} color="#CC4444" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add more tile */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      borderRadius: 10,
                      border: "1.5px dashed #E8E0D5",
                      height: 310,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      cursor: "pointer",
                      background: "#FAFAFA",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "#F5EFE9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Plus size={18} color="#D4A373" />
                    </div>
                    <span style={{ fontSize: 11, color: "#AAAAAA" }}>
                      Add photo
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating upload button for mobile */}
      <button
        className="inspo-mobile-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#333",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: uploading ? "not-allowed" : "pointer",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        {uploading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Plus size={24} />
        )}
      </button>

      {/* Confirm delete */}
      {confirmDelete && (
        <>
          <div
            onClick={() => setConfirmDelete(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 100,
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                width: "100%",
                maxWidth: 380,
                padding: "28px 24px",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 8px",
                }}
              >
                Remove this photo?
              </h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>
                This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #E8E0D5",
                    borderRadius: 9,
                    fontSize: 13,
                    color: "#666",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete)}
                  disabled={deleteMutation.isPending}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: "#CC4444",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Removing…
                    </>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </BridePortalLayout>
  );
}
