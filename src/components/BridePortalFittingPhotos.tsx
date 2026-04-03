import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  Download,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import JSZip from "jszip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { fittingsApi, type Fitting } from "@/lib/api";

export function BridePortalFittingPhotos() {
  const [activeFitting, setActiveFitting] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const { data: fittings = [], isLoading } = useQuery({
    queryKey: ["fittings-mine"],
    queryFn: () => fittingsApi.listMine(),
  });

  const fitting = fittings.find((f) => f.id === activeFitting) ?? null;
  const totalPhotos = fittings.reduce((sum, f) => sum + f.photos.length, 0);
  const latestDate = fittings.length
    ? new Date(fittings[fittings.length - 1].createdAt).toLocaleDateString(
        "en-AU",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : "—";

  const photos = fitting?.photos ?? [];

  async function downloadAllAsZip() {
    if (!photos.length || !fitting) return;
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        photos.map(async (photo, i) => {
          const res = await fetch(photo.imageUrl, { credentials: "include" });
          const blob = await res.blob();
          const ext = blob.type === "image/png" ? "png" : "jpg";
          zip.file(
            `fitting-${fitting.fittingNumber}-photo-${i + 1}.${ext}`,
            blob,
          );
        }),
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fitting-${fitting.fittingNumber}-photos.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail — user can download individually
    } finally {
      setDownloadingZip(false);
    }
  }

  return (
    <BridePortalLayout>
      {/* Lightbox */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
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
            src={photos[lightboxIdx].imageUrl}
            alt={`Photo ${lightboxIdx + 1}`}
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
            {(lightboxIdx ?? 0) + 1} / {photos.length}
          </div>
        </div>
      )}

      <main className="bp-page-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 6px",
              }}
            >
              {activeFitting ? (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <button
                    onClick={() => {
                      setActiveFitting(null);
                      setLightboxIdx(null);
                      setNotesExpanded(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#A67C52",
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      padding: 0,
                    }}
                  >
                    <ChevronLeft size={16} /> All Albums
                  </button>
                  <span style={{ color: "#DDD" }}>·</span>
                  Fitting #{fitting?.fittingNumber}
                </span>
              ) : (
                "Fitting Photos"
              )}
            </h1>
            {!activeFitting && (
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                Photos from your fittings
                <span className="hidden sm:inline">
                  , shared by Fatima after each session
                </span>
              </p>
            )}
            {activeFitting && (
              <div>
                <p style={{ fontSize: 13, color: "#888", margin: "0 0 8px" }}>
                  {new Date(fitting!.createdAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {fitting?.notes && (
                  <div
                    style={{
                      background: "#FAF8F5",
                      border: "1px solid #E8E0D5",
                      borderRadius: 8,
                      padding: "12px 16px",
                      marginTop: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#AAAAAA",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 6,
                      }}
                    >
                      Fitting Notes
                    </div>
                    <div
                      className="ql-editor ql-fitting-notes"
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
                      dangerouslySetInnerHTML={{ __html: fitting.notes }}
                    />
                    {fitting.notes.length > 300 && (
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
              </div>
            )}
          </div>

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

          {!isLoading && !activeFitting && (
            <>
              {/* Stats */}
              <div
                className="fitting-stats-grid"
                style={{ display: "flex", gap: 16, marginBottom: 28 }}
              >
                {[
                  { label: "Total Photos", value: String(totalPhotos) },
                  {
                    label: "Fittings Documented",
                    value: String(fittings.length),
                  },
                  { label: "Latest Update", value: latestDate },
                ].map((stat, i) => (
                  <Card
                    key={i}
                    className="fitting-stat-card"
                    style={{
                      flex: 1,
                      background: "#FFFFFF",
                      border: "1px solid #E8E0D5",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <CardContent style={{ padding: "16px 20px" }}>
                      <div
                        className="stat-value"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 26,
                          fontWeight: 500,
                          color: "#D4A373",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="stat-label"
                        style={{ fontSize: 11, color: "#888", marginTop: 2 }}
                      >
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {fittings.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No fitting photos yet — Fatima will add them after each
                  session.
                </div>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {fittings.map((f) => (
                  <Card
                    key={f.id}
                    onClick={() => {
                      setActiveFitting(f.id);
                      setNotesExpanded(false);
                    }}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E0D5",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      overflow: "hidden",
                      height: 140,
                    }}
                  >
                    <CardContent
                      style={{
                        padding: 0,
                        display: "flex",
                        height: "100%",
                      }}
                    >
                      {/* Photo strip preview */}
                      <div
                        style={{
                          display: "flex",
                          width: 200,
                          height: "100%",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {f.photos.length > 0 ? (
                          f.photos.slice(0, 3).map((p, k) => (
                            <div
                              key={k}
                              style={{
                                flex: 1,
                                height: "100%",
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
                          ))
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              background: "#F5EFE9",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Camera size={20} color="rgba(212,163,115,0.4)" />
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          borderLeft: "1px solid #F0EBE4",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 20,
                            fontWeight: 500,
                            color: "#2C2C2C",
                            marginBottom: 6,
                          }}
                        >
                          Fitting #{f.fittingNumber}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#888",
                            marginBottom: f.notes ? 6 : 10,
                          }}
                        >
                          {new Date(f.createdAt).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        {f.notes && (
                          <div style={{ marginBottom: 10 }}>
                            <div
                              className="ql-editor ql-fitting-notes"
                              style={{
                                padding: 0,
                                fontSize: 12,
                                color: "#666",
                                lineHeight: 1.5,
                                maxHeight: "3em",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                              dangerouslySetInnerHTML={{ __html: f.notes }}
                            />
                            {f.notes.length > 100 && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#A67C52",
                                  fontWeight: 500,
                                  marginTop: 4,
                                  display: "inline-block",
                                }}
                              >
                                Show more
                              </span>
                            )}
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
            </>
          )}

          {!isLoading && activeFitting && fitting && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 16,
                }}
              >
                <button
                  onClick={downloadAllAsZip}
                  disabled={downloadingZip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    background: "#fff",
                    border: "1px solid #E8E0D5",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#555",
                    cursor: downloadingZip ? "not-allowed" : "pointer",
                    opacity: downloadingZip ? 0.7 : 1,
                  }}
                >
                  {downloadingZip ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Zipping…
                    </>
                  ) : (
                    <>
                      <Download size={13} /> Download All
                    </>
                  )}
                </button>
              </div>

              {photos.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No photos in this fitting yet.
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                {photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="photo-card"
                    onClick={() => setLightboxIdx(i)}
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1px solid #E8E0D5",
                      cursor: "pointer",
                      position: "relative",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>
                      <img
                        src={photo.imageUrl}
                        alt={`Photo ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div
                      className="zoom-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.15s",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(0,0,0,0.35)",
                          borderRadius: "50%",
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ZoomIn size={16} color="#fff" />
                      </div>
                    </div>
                    {photo.caption && (
                      <div style={{ background: "#fff", padding: "8px 12px" }}>
                        <div style={{ fontSize: 11, color: "#555" }}>
                          {photo.caption}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </BridePortalLayout>
  );
}
