import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  Plus,
  Trash2,
  Upload,
  X,
  Loader2,
  ChevronLeft,
  ZoomIn,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  fittingsApi,
  bridesApi,
  ApiError,
  type Fitting,
  type BrideWithProfile,
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function AdminFittings() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBrideId, setSelectedBrideId] = useState<string | null>(null);
  const [activeFittingId, setActiveFittingId] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creatingFitting, setCreatingFitting] = useState(false);
  const [newFittingNotes, setNewFittingNotes] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: bridesData } = useQuery({
    queryKey: ["brides-all-fittings"],
    queryFn: () => bridesApi.list({ limit: 100 }),
  });
  const brides = bridesData?.data ?? [];

  const { data: fittings = [], isLoading: fittingsLoading } = useQuery({
    queryKey: ["fittings-admin", selectedBrideId],
    queryFn: () => fittingsApi.listForBride(selectedBrideId!),
    enabled: !!selectedBrideId,
  });

  const activeFitting = fittings.find((f) => f.id === activeFittingId) ?? null;
  const selectedBride = brides.find((b) => b.id === selectedBrideId) ?? null;
  const photos = activeFitting?.photos ?? [];

  const createMutation = useMutation({
    mutationFn: () =>
      fittingsApi.create(
        selectedBrideId!,
        undefined,
        newFittingNotes || undefined,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fittings-admin", selectedBrideId],
      });
      toast({ title: "Fitting created" });
      setNewFittingNotes("");
      setShowCreateForm(false);
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => fittingsApi.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fittings-admin", selectedBrideId],
      });
      toast({ title: "Photo deleted" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  async function handleUpload(files: FileList | null) {
    if (!files?.length || !activeFittingId) return;
    const valid = Array.from(files).filter((f) => {
      if (!["image/jpeg", "image/png"].includes(f.type)) {
        toast({
          title: "Invalid type",
          description: `${f.name} must be JPEG or PNG.`,
        });
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast({ title: "Too large", description: `${f.name} exceeds 10MB.` });
        return false;
      }
      return true;
    });
    if (!valid.length) return;
    setUploading(true);
    try {
      await fittingsApi.uploadPhotos(activeFittingId, valid.slice(0, 10));
      queryClient.invalidateQueries({
        queryKey: ["fittings-admin", selectedBrideId],
      });
      toast({
        title: "Photos uploaded",
        description: `${valid.length} photo${valid.length !== 1 ? "s" : ""} added.`,
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
    <AdminLayout>
      {/* Lightbox */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 200,
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
              background: "rgba(255,255,255,0.1)",
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
            src={photos[lightboxIdx].imageUrl}
            alt=""
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
                i !== null && i < photos.length - 1 ? i + 1 : i,
              )
            }
            style={{
              position: "absolute",
              right: 28,
              background: "rgba(255,255,255,0.1)",
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
            <ChevronLeft size={22} style={{ transform: "rotate(180deg)" }} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 24,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {(lightboxIdx ?? 0) + 1} / {photos.length}
          </div>
        </div>
      )}

      <main className="bp-page-main">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 4px",
              }}
            >
              Fitting Photos
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Manage fitting records and upload photos per bride
            </p>
          </div>

          {/* Bride selector */}
          {!selectedBrideId && (
            <div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
                Select a bride to manage their fittings:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 12,
                }}
              >
                {brides.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBrideId(b.id)}
                    style={{
                      padding: "16px",
                      background: "#fff",
                      border: "1px solid #E8E0D5",
                      borderRadius: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <Avatar
                      style={{
                        width: 38,
                        height: 38,
                        border: "1.5px solid #E8D8CE",
                        flexShrink: 0,
                      }}
                    >
                      <AvatarFallback
                        style={{
                          background: "#E8D8CE",
                          color: "#A67C52",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {b.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#2C2C2C",
                        }}
                      >
                        {b.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {b.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedBrideId && !activeFittingId && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <button
                  onClick={() => {
                    setSelectedBrideId(null);
                    setActiveFittingId(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#A67C52",
                    fontSize: 13,
                  }}
                >
                  <ChevronLeft size={15} /> All Brides
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#2C2C2C",
                    }}
                  >
                    {selectedBride?.name}
                  </span>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={13} /> New Fitting
                  </button>
                </div>
              </div>

              {/* Create fitting form */}
              {showCreateForm && (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #E8E0D5",
                    borderRadius: 12,
                    padding: "20px 24px",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2C2C2C",
                      marginBottom: 12,
                    }}
                  >
                    Create New Fitting
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#555",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        display: "block",
                        marginBottom: 5,
                      }}
                    >
                      Notes (optional)
                    </label>
                    <input
                      value={newFittingNotes}
                      onChange={(e) => setNewFittingNotes(e.target.value)}
                      placeholder="e.g. Toile fitting — sweetheart neckline adjusted"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: "1px solid #E8E0D5",
                        borderRadius: 7,
                        fontSize: 13,
                        color: "#333",
                        background: "#FDFBF8",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #E8E0D5",
                        borderRadius: 7,
                        fontSize: 12,
                        color: "#666",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => createMutation.mutate()}
                      disabled={createMutation.isPending}
                      style={{
                        padding: "8px 16px",
                        background: "#2C2C2C",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />{" "}
                          Creating…
                        </>
                      ) : (
                        "Create Fitting"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {fittingsLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px 0",
                  }}
                >
                  <Loader2 size={22} className="animate-spin" color="#D4A373" />
                </div>
              )}

              {!fittingsLoading && fittings.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No fittings yet — create the first one above.
                </div>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {fittings.map((f) => (
                  <Card
                    key={f.id}
                    onClick={() => setActiveFittingId(f.id)}
                    style={{
                      background: "#fff",
                      border: "1px solid #E8E0D5",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent style={{ padding: 0, display: "flex" }}>
                      <div
                        style={{ display: "flex", width: 180, flexShrink: 0 }}
                      >
                        {f.photos.slice(0, 3).map((p, k) => (
                          <div
                            key={k}
                            style={{
                              flex: 1,
                              minHeight: 100,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={p.imageUrl}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                        {f.photos.length === 0 && (
                          <div
                            style={{
                              flex: 1,
                              background: "#F5EFE9",
                              minHeight: 100,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Camera size={18} color="rgba(212,163,115,0.4)" />
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: "16px 20px",
                          borderLeft: "1px solid #F0EBE4",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 18,
                            fontWeight: 500,
                            color: "#2C2C2C",
                            marginBottom: 4,
                          }}
                        >
                          Fitting #{f.fittingNumber}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#888",
                            marginBottom: 8,
                          }}
                        >
                          {new Date(f.createdAt).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          {f.notes ? " — " + f.notes : ""}
                        </div>
                        <Badge
                          style={{
                            background: "#F5EFE9",
                            color: "#A67C52",
                            border: "none",
                            fontSize: 10,
                          }}
                        >
                          {f.photos.length} photo
                          {f.photos.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedBrideId && activeFittingId && activeFitting && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <button
                  onClick={() => setActiveFittingId(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#A67C52",
                    fontSize: 13,
                  }}
                >
                  <ChevronLeft size={15} /> {selectedBride?.name}'s Fittings
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#2C2C2C",
                    }}
                  >
                    Fitting #{activeFitting.fittingNumber}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: uploading ? "not-allowed" : "pointer",
                      opacity: uploading ? 0.7 : 1,
                    }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />{" "}
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload size={13} /> Upload Photos
                      </>
                    )}
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e.target.files)}
              />

              {photos.length === 0 && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "1.5px dashed #D4A373",
                    borderRadius: 12,
                    padding: "48px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "rgba(212,163,115,0.04)",
                  }}
                >
                  <Camera
                    size={32}
                    color="#D4A373"
                    style={{ margin: "0 auto 12px" }}
                  />
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#333",
                      marginBottom: 4,
                    }}
                  >
                    Drop photos here or click to upload
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    JPEG or PNG · Max 10MB · Up to 10 at a time
                  </div>
                </div>
              )}

              {photos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  {photos.map((photo, i) => (
                    <div
                      key={photo.id}
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #E8E0D5",
                        position: "relative",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: "3/4",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                        onClick={() => setLightboxIdx(i)}
                      >
                        <img
                          src={photo.imageUrl}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "0")
                          }
                        >
                          <ZoomIn size={20} color="#fff" />
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          padding: "6px 10px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => deletePhotoMutation.mutate(photo.id)}
                          disabled={deletePhotoMutation.isPending}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                          }}
                        >
                          <Trash2 size={13} color="#CC4444" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* Add more */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      borderRadius: 10,
                      border: "1.5px dashed #E8E0D5",
                      aspectRatio: "3/4",
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
                      Add photos
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
