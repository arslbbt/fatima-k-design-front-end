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
  Search,
  Download,
} from "lucide-react";
import JSZip from "jszip";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/Pagination";
import {
  fittingsApi,
  bridesApi,
  appointmentsApi,
  ApiError,
  APPOINTMENT_TITLE_LABELS,
  type BrideWithProfile,
} from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/hooks/use-toast";

const BRIDE_PAGE_SIZE = 20;

export function AdminFittings() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBrideId, setSelectedBrideId] = useState<string | null>(null);
  const [activeFittingId, setActiveFittingId] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newFittingNotes, setNewFittingNotes] = useState("");
  const [newFittingName, setNewFittingName] = useState("");
  const [newFittingApptId, setNewFittingApptId] = useState("");
  const [newFittingPhotos, setNewFittingPhotos] = useState<File[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [brideSearch, setBrideSearch] = useState("");
  const [bridePage, setBridePage] = useState(1);
  const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<
    string | null
  >(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const debouncedSearch = useDebounce(brideSearch);

  const { data: bridesData, isLoading: bridesLoading } = useQuery({
    queryKey: ["brides-fittings-list", debouncedSearch, bridePage],
    queryFn: () =>
      bridesApi.list({
        search: debouncedSearch || undefined,
        page: bridePage,
        limit: BRIDE_PAGE_SIZE,
      }),
  });
  const brides = bridesData?.data ?? [];
  const bridesMeta = bridesData?.meta;

  const { data: fittings = [], isLoading: fittingsLoading } = useQuery({
    queryKey: ["fittings-admin", selectedBrideId],
    queryFn: () => fittingsApi.listForBride(selectedBrideId!),
    enabled: !!selectedBrideId,
  });

  // Load bride's appointments for the create form dropdown
  const { data: brideAppointments = [] } = useQuery({
    queryKey: ["bride-appts-for-fitting", selectedBrideId],
    queryFn: () => appointmentsApi.listForBride(selectedBrideId!),
    enabled: !!selectedBrideId && showCreateForm,
  });

  const eligibleAppts = brideAppointments.filter((a) =>
    ["SCHEDULED", "RESCHEDULED", "COMPLETED"].includes(a.status),
  );
  const activeFitting = fittings.find((f) => f.id === activeFittingId) ?? null;
  const selectedBride = brides.find((b) => b.id === selectedBrideId) ?? null;
  const photos = activeFitting?.photos ?? [];

  const createMutation = useMutation({
    mutationFn: async () => {
      // First create the fitting
      const fitting = await fittingsApi.create(
        selectedBrideId!,
        newFittingApptId,
        newFittingName,
        newFittingNotes || undefined,
      );
      // Then upload photos if any
      if (newFittingPhotos.length > 0) {
        await fittingsApi.uploadPhotos(fitting.id, newFittingPhotos);
      }
      return fitting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fittings-admin", selectedBrideId],
      });
      toast({
        title: "Fitting created",
        description:
          newFittingPhotos.length > 0
            ? `With ${newFittingPhotos.length} photo${newFittingPhotos.length !== 1 ? "s" : ""}`
            : undefined,
      });
      setNewFittingNotes("");
      setNewFittingName("");
      setNewFittingApptId("");
      setNewFittingPhotos([]);
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
      setConfirmDeletePhotoId(null);
      toast({ title: "Photo deleted" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  async function downloadAllAsZip() {
    if (!photos.length || !activeFitting) return;
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        photos.map(async (photo, i) => {
          const res = await fetch(photo.imageUrl, { credentials: "include" });
          const blob = await res.blob();
          const ext = blob.type === "image/png" ? "png" : "jpg";
          zip.file(
            `fitting-${activeFitting.fittingNumber}-photo-${i + 1}.${ext}`,
            blob,
          );
        }),
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fitting-${activeFitting.fittingNumber}-photos.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download photos.",
      });
    } finally {
      setDownloadingZip(false);
    }
  }

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
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fff",
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  padding: "9px 14px",
                  marginBottom: 16,
                  maxWidth: 360,
                }}
              >
                <Search size={14} color="#AAA" />
                <input
                  value={brideSearch}
                  onChange={(e) => {
                    setBrideSearch(e.target.value);
                    setBridePage(1);
                  }}
                  placeholder="Search brides…"
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: 13,
                    color: "#333",
                    background: "transparent",
                    flex: 1,
                  }}
                />
              </div>

              {bridesLoading && (
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

              {!bridesLoading && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {brides.map((b: any) => (
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
              )}

              {!bridesLoading && bridesMeta && bridesMeta.totalPages > 1 && (
                <Pagination
                  page={bridePage}
                  totalPages={bridesMeta.totalPages}
                  total={bridesMeta.total}
                  limit={BRIDE_PAGE_SIZE}
                  onPageChange={setBridePage}
                />
              )}
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

                  {/* Appointment selector — mandatory */}
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
                      Appointment *
                    </label>
                    <select
                      value={newFittingApptId}
                      onChange={(e) => setNewFittingApptId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: `1px solid ${!newFittingApptId && createMutation.isError ? "#F5C6C6" : "#E8E0D5"}`,
                        borderRadius: 7,
                        fontSize: 13,
                        color: newFittingApptId ? "#333" : "#AAA",
                        background: "#FDFBF8",
                        outline: "none",
                        boxSizing: "border-box" as const,
                      }}
                    >
                      <option value="">Select an appointment…</option>
                      {eligibleAppts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {APPOINTMENT_TITLE_LABELS[a.title]} —{" "}
                          {new Date(a.startTime).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          ({a.status})
                        </option>
                      ))}
                      {eligibleAppts.length === 0 && (
                        <option disabled>
                          No eligible appointments found (first create
                          appointment to add fitting photos against it)
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Fitting Name — mandatory */}
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
                      Fitting Name * (Max 9 words)
                    </label>
                    <input
                      type="text"
                      value={newFittingName}
                      onChange={(e) => setNewFittingName(e.target.value)}
                      placeholder="e.g. First Toile Fitting"
                      maxLength={100}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        border: `1px solid ${!newFittingName && createMutation.isError ? "#F5C6C6" : "#E8E0D5"}`,
                        borderRadius: 7,
                        fontSize: 13,
                        color: "#333",
                        background: "#FDFBF8",
                        outline: "none",
                        boxSizing: "border-box" as const,
                      }}
                    />
                    {newFittingName &&
                      newFittingName.trim().split(/\s+/).length > 9 && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#CC4444",
                            marginTop: 4,
                          }}
                        >
                          Name must not exceed 9 words
                        </div>
                      )}
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
                    <div
                      style={{
                        border: "1px solid #E8E0D5",
                        borderRadius: 7,
                        overflow: "hidden",
                        background: "#FDFBF8",
                      }}
                    >
                      <ReactQuill
                        value={newFittingNotes}
                        onChange={setNewFittingNotes}
                        placeholder="e.g. Toile fitting — sweetheart neckline adjusted"
                        modules={{
                          toolbar: [
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "bold",
                          "italic",
                          "underline",
                          "list",
                          "bullet",
                        ]}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  </div>

                  {/* Photo upload section */}
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
                      Photos (optional)
                    </label>
                    <div
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/jpeg,image/png";
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (!files) return;
                          const valid = Array.from(files).filter((f) => {
                            if (!["image/jpeg", "image/png"].includes(f.type)) {
                              toast({
                                title: "Invalid type",
                                description: `${f.name} must be JPEG or PNG.`,
                              });
                              return false;
                            }
                            if (f.size > 10 * 1024 * 1024) {
                              toast({
                                title: "Too large",
                                description: `${f.name} exceeds 10MB.`,
                              });
                              return false;
                            }
                            return true;
                          });
                          setNewFittingPhotos((prev) => [
                            ...prev,
                            ...valid.slice(0, 10 - prev.length),
                          ]);
                        };
                        input.click();
                      }}
                      style={{
                        border: "1.5px dashed #D4A373",
                        borderRadius: 8,
                        padding: "16px",
                        background: "rgba(212,163,115,0.04)",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <Upload
                        size={20}
                        color="#D4A373"
                        style={{ margin: "0 auto 8px" }}
                      />
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#333",
                          marginBottom: 2,
                        }}
                      >
                        Click to select photos
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        JPEG or PNG · Max 10MB · Up to 10 photos
                      </div>
                    </div>
                    {newFittingPhotos.length > 0 && (
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {newFittingPhotos.map((file, i) => (
                          <div
                            key={i}
                            style={{
                              position: "relative",
                              width: 60,
                              height: 60,
                              borderRadius: 6,
                              overflow: "hidden",
                              border: "1px solid #E8E0D5",
                            }}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewFittingPhotos((prev) =>
                                  prev.filter((_, idx) => idx !== i),
                                );
                              }}
                              style={{
                                position: "absolute",
                                top: 2,
                                right: 2,
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.6)",
                                border: "none",
                                color: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewFittingPhotos([]);
                        setNewFittingName("");
                        setNewFittingApptId("");
                        setNewFittingNotes("");
                      }}
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
                      onClick={() => {
                        if (!newFittingApptId) {
                          toast({
                            title: "Appointment required",
                            description: "Please select an appointment.",
                          });
                          return;
                        }
                        if (!newFittingName.trim()) {
                          toast({
                            title: "Fitting name required",
                            description: "Please enter a fitting name.",
                          });
                          return;
                        }
                        const wordCount = newFittingName
                          .trim()
                          .split(/\s+/).length;
                        if (wordCount > 9) {
                          toast({
                            title: "Name too long",
                            description:
                              "Fitting name must not exceed 9 words.",
                          });
                          return;
                        }
                        createMutation.mutate();
                      }}
                      disabled={
                        createMutation.isPending ||
                        !newFittingApptId ||
                        !newFittingName.trim()
                      }
                      style={{
                        padding: "8px 16px",
                        background:
                          !newFittingApptId || !newFittingName.trim()
                            ? "#CCC"
                            : "#2C2C2C",
                        color: "#fff",
                        border: "none",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor:
                          !newFittingApptId || !newFittingName.trim()
                            ? "not-allowed"
                            : "pointer",
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
                    onClick={() => {
                      setActiveFittingId(f.id);
                      setNotesExpanded(false);
                    }}
                    style={{
                      background: "#fff",
                      border: "1px solid #E8E0D5",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent
                      style={{ padding: 0, display: "flex", height: 140 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: 180,
                          height: 140,
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {f.photos.slice(0, 3).map((p, k) => (
                          <div
                            key={k}
                            style={{
                              flex: 1,
                              height: 140,
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
                                display: "block",
                              }}
                            />
                          </div>
                        ))}
                        {f.photos.length === 0 && (
                          <div
                            style={{
                              flex: 1,
                              background: "#F5EFE9",
                              height: 140,
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
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 18,
                            fontWeight: 500,
                            color: "#2C2C2C",
                            marginBottom: 4,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                          }}
                        >
                          Fitting #{f.fittingNumber} - {f.name}
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
                        </div>
                        {f.notes && (
                          <div
                            className="hidden md:block"
                            style={{ marginBottom: 8, flex: 1 }}
                          >
                            <div
                              className="ql-editor ql-fitting-notes"
                              dangerouslySetInnerHTML={{ __html: f.notes }}
                              style={{
                                padding: 0,
                                fontSize: 12,
                                color: "#666",
                                lineHeight: 1.5,
                                maxHeight: "3.6em",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            />
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Badge
                            style={{
                              background: "#F5EFE9",
                              color: "#A67C52",
                              border: "none",
                              fontSize: 10,
                              width: "fit-content",
                            }}
                          >
                            {f.photos.length} photo
                            {f.photos.length !== 1 ? "s" : ""}
                          </Badge>
                          <span style={{ fontSize: 12, color: "#D4A373" }}>
                            View{" "}
                            <span className="hidden sm:inline">album →</span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedBrideId && activeFittingId && activeFitting && (
            <div>
              <div className="fitting-detail-header">
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
                <div className="fitting-detail-title">
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#2C2C2C",
                    }}
                  >
                    Fitting #{activeFitting.fittingNumber} -{" "}
                    {activeFitting.name}
                  </span>
                </div>
                <div className="fitting-detail-actions">
                  {photos.length > 0 && (
                    <button
                      onClick={downloadAllAsZip}
                      disabled={downloadingZip}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        background: "#F5EFE9",
                        color: "#A67C52",
                        border: "1px solid #E8D8CE",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: downloadingZip ? "not-allowed" : "pointer",
                        opacity: downloadingZip ? 0.7 : 1,
                      }}
                    >
                      {downloadingZip ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />{" "}
                          Zipping…
                        </>
                      ) : (
                        <>
                          <Download size={13} /> Download All
                        </>
                      )}
                    </button>
                  )}
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

              {/* Notes section in detail view */}
              {activeFitting.notes && (
                <div
                  style={{
                    background: "#FAF8F5",
                    border: "1px solid #E8E0D5",
                    borderRadius: 10,
                    padding: "14px 18px",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#AAAAAA",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    Fitting Notes
                  </div>
                  <div
                    className="ql-editor ql-fitting-notes"
                    dangerouslySetInnerHTML={{ __html: activeFitting.notes }}
                    style={{
                      padding: 0,
                      fontSize: 13,
                      color: "#444",
                      lineHeight: 1.6,
                      maxHeight: notesExpanded ? "none" : "8.5em",
                      overflow: "hidden",
                      display: notesExpanded ? "block" : "-webkit-box",
                      WebkitLineClamp: notesExpanded ? "unset" : 5,
                      WebkitBoxOrient: "vertical",
                    }}
                  />
                  {activeFitting.notes.length > 300 && (
                    <button
                      onClick={() => setNotesExpanded(!notesExpanded)}
                      style={{
                        marginTop: 8,
                        background: "none",
                        border: "none",
                        color: "#A67C52",
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {notesExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}

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
                <div className="fitting-photos-grid">
                  {photos.map((photo, i) => (
                    <div
                      key={photo.id}
                      className="photo-card"
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #E8E0D5",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          height: 280,
                          overflow: "hidden",
                          cursor: "pointer",
                          position: "relative",
                          flexShrink: 0,
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
                            display: "block",
                          }}
                        />
                        {/* Zoom overlay — scoped inside the image div only */}
                        <div
                          className="zoom-overlay"
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.15s",
                            pointerEvents: "none",
                          }}
                        >
                          <ZoomIn size={22} color="#fff" />
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          padding: "6px 10px",
                          display: "flex",
                          justifyContent: "flex-end",
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeletePhotoId(photo.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
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
                      height: 316,
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

      {/* Confirm delete photo modal — same design as inspiration page */}
      {confirmDeletePhotoId && (
        <>
          <div
            onClick={() => setConfirmDeletePhotoId(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 200,
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 201,
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
                Delete this photo?
              </h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>
                This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmDeletePhotoId(null)}
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
                  onClick={() =>
                    deletePhotoMutation.mutate(confirmDeletePhotoId)
                  }
                  disabled={deletePhotoMutation.isPending}
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
                  {deletePhotoMutation.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Deleting…
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
