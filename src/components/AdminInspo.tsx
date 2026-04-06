import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  ChevronLeft,
  X,
  Loader2,
  Search,
  Play,
  ExternalLink,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/Pagination";
import { inspoApi, bridesApi } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

const BRIDE_PAGE_SIZE = 20;

export function AdminInspo() {
  const [selectedBrideId, setSelectedBrideId] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [brideSearch, setBrideSearch] = useState("");
  const [bridePage, setBridePage] = useState(1);

  const debouncedSearch = useDebounce(brideSearch);

  const { data: bridesData, isLoading: bridesLoading } = useQuery({
    queryKey: ["brides-inspo-list", debouncedSearch, bridePage],
    queryFn: () =>
      bridesApi.list({
        search: debouncedSearch || undefined,
        page: bridePage,
        limit: BRIDE_PAGE_SIZE,
      }),
  });
  const brides = bridesData?.data ?? [];
  const bridesMeta = bridesData?.meta;

  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ["inspo-admin", selectedBrideId],
    queryFn: () => inspoApi.listForBride(selectedBrideId!),
    enabled: !!selectedBrideId,
  });

  const selectedBride = brides.find((b) => b.id === selectedBrideId) ?? null;

  function getPlatformIcon(platform?: string | null) {
    switch (platform?.toLowerCase()) {
      case "tiktok":
        return "🎵";
      case "instagram":
        return "📸";
      case "youtube":
        return "▶️";
      case "pinterest":
        return "📌";
      default:
        return "🎬";
    }
  }

  function getPlatformGradient(platform?: string | null) {
    switch (platform?.toLowerCase()) {
      case "tiktok":
        return "linear-gradient(135deg, #000000 0%, #ee1d52 100%)";
      case "instagram":
        return "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)";
      case "youtube":
        return "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)";
      case "pinterest":
        return "linear-gradient(135deg, #E60023 0%, #BD081C 100%)";
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  }

  const selectedItem = lightboxIdx !== null ? uploads[lightboxIdx] : null;

  return (
    <AdminLayout>
      {/* Lightbox for images */}
      {selectedItem && selectedItem.mediaType === "image" && (
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src={selectedItem.imageUrl!}
              alt=""
              style={{
                maxWidth: "80vw",
                maxHeight: "75vh",
                borderRadius: 12,
                objectFit: "contain",
              }}
            />
            {selectedItem.caption && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {selectedItem.caption}
              </div>
            )}
          </div>
          <button
            onClick={() =>
              setLightboxIdx((i) =>
                i !== null && i < uploads.length - 1 ? i + 1 : i,
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
            {(lightboxIdx ?? 0) + 1} / {uploads.length}
          </div>
        </div>
      )}

      {/* Modal for video links */}
      {selectedItem && selectedItem.mediaType === "video_link" && (
        <>
          <div
            onClick={() => setLightboxIdx(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
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
                maxWidth: 500,
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #F0F0F0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>
                    {getPlatformIcon(selectedItem.platform)}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#333",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedItem.platform} Video
                  </span>
                </div>
                <button
                  onClick={() => setLightboxIdx(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={20} color="#666" />
                </button>
              </div>

              <div style={{ padding: 24 }}>
                <div
                  style={{
                    background: getPlatformGradient(selectedItem.platform),
                    borderRadius: 12,
                    padding: 40,
                    textAlign: "center",
                    marginBottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Play size={28} color="#333" fill="#333" />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    Video hosted on {selectedItem.platform}
                  </div>
                </div>

                {selectedItem.caption && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: 16,
                      background: "#F9F9F9",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#999",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Caption
                    </div>
                    <div style={{ fontSize: 14, color: "#333" }}>
                      {selectedItem.caption}
                    </div>
                  </div>
                )}

                <a
                  href={selectedItem.videoLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={14} />
                  Open in {selectedItem.platform}
                </a>
              </div>
            </div>
          </div>
        </>
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
              Inspiration Boards
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              View inspiration photos uploaded by each bride
            </p>
          </div>

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
              )}

              {bridesMeta && bridesMeta.totalPages > 1 && (
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

          {selectedBrideId && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {/* Row 1 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%", // full row
                  }}
                >
                  <button
                    onClick={() => setSelectedBrideId(null)}
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

                  <span style={{ fontSize: 12, color: "#888" }}>
                    ({uploads.length} photo{uploads.length !== 1 ? "s" : ""})
                  </span>
                </div>

                {/* Row 2 */}
                <span
                  style={{
                    width: "100%", // new row
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#2C2C2C",
                  }}
                >
                  {selectedBride?.name}'s Inspiration Board
                </span>
              </div>

              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "60px 0",
                  }}
                >
                  <Loader2 size={22} className="animate-spin" color="#D4A373" />
                </div>
              )}

              {!isLoading && uploads.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  <ImageIcon
                    size={32}
                    color="#E8D8CE"
                    style={{ margin: "0 auto 12px" }}
                  />
                  <div>No inspiration photos uploaded yet.</div>
                </div>
              )}

              {!isLoading && uploads.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  {uploads.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxIdx(i)}
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #E8E0D5",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      {item.mediaType === "image" ? (
                        <>
                          <div
                            style={{ aspectRatio: "3/4", overflow: "hidden" }}
                          >
                            <img
                              src={item.imageUrl!}
                              alt={item.caption ?? ""}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              aspectRatio: "3/4",
                              background: getPlatformGradient(item.platform),
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                background: "rgba(255,255,255,0.95)",
                                borderRadius: 4,
                                padding: "3px 8px",
                                fontSize: 9,
                                fontWeight: 600,
                                color: "#333",
                                textTransform: "uppercase",
                              }}
                            >
                              {getPlatformIcon(item.platform)} {item.platform}
                            </div>

                            <div
                              style={{
                                width: 48,
                                height: 48,
                                background: "rgba(255,255,255,0.95)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Play size={22} color="#333" fill="#333" />
                            </div>

                            <div
                              style={{
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 500,
                              }}
                            >
                              Video Link
                            </div>
                          </div>
                        </>
                      )}

                      {item.caption && (
                        <div
                          style={{ background: "#fff", padding: "7px 10px" }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "#555",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.caption}
                          </div>
                        </div>
                      )}
                      <div
                        style={{ background: "#fff", padding: "4px 10px 8px" }}
                      >
                        <div style={{ fontSize: 10, color: "#AAA" }}>
                          {new Date(item.uploadedAt).toLocaleDateString(
                            "en-AU",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
