import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  ChevronLeft,
  X,
  Loader2,
  Search,
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

  return (
    <AdminLayout>
      {/* Lightbox */}
      {lightboxIdx !== null && uploads[lightboxIdx] && (
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
              src={uploads[lightboxIdx].imageUrl}
              alt=""
              style={{
                maxWidth: "80vw",
                maxHeight: "75vh",
                borderRadius: 12,
                objectFit: "contain",
              }}
            />
            {uploads[lightboxIdx].caption && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {uploads[lightboxIdx].caption}
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
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
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
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#2C2C2C",
                  }}
                >
                  {selectedBride?.name}'s Inspiration Board
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  ({uploads.length} photo{uploads.length !== 1 ? "s" : ""})
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
                      }}
                    >
                      <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption ?? ""}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      {photo.caption && (
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
                            {photo.caption}
                          </div>
                        </div>
                      )}
                      <div
                        style={{ background: "#fff", padding: "4px 10px 8px" }}
                      >
                        <div style={{ fontSize: 10, color: "#AAA" }}>
                          {new Date(photo.uploadedAt).toLocaleDateString(
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
