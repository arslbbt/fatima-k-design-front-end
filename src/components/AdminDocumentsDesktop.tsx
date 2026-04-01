import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Upload,
  Search,
  Eye,
  Trash2,
  X,
  Plus,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";
import { documentsApi, bridesApi, ApiError, type Document } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/hooks/use-toast";

// ── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({
  open,
  onClose,
  brides,
}: {
  open: boolean;
  onClose: () => void;
  brides: { id: string; name: string }[];
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [brideId, setBrideId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function reset() {
    setFile(null);
    setTitle("");
    setBrideId("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!brideId) {
      setError("Please select a bride.");
      return;
    }
    setUploading(true);
    try {
      await documentsApi.upload(brideId, file, title.trim());
      queryClient.invalidateQueries({ queryKey: ["admin-docs"] });
      toast({ title: "Document uploaded" });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;
  const inp: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #E8E0D5",
    borderRadius: 7,
    fontSize: 13,
    color: "#333",
    background: "#FDFBF8",
    outline: "none",
    boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <>
      <div
        onClick={onClose}
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
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            width: "100%",
            maxWidth: 500,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid #F0EAE2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: 0,
              }}
            >
              Upload Document
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#AAA",
              }}
            >
              <X size={18} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "#FFF0EE",
                  border: "1px solid #F0C0B8",
                  borderRadius: 8,
                }}
              >
                <AlertCircle size={14} color="#D4574A" />
                <span style={{ fontSize: 13, color: "#D4574A" }}>{error}</span>
              </div>
            )}

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "1.5px dashed #D4A373",
                borderRadius: 10,
                padding: "24px 20px",
                background: "rgba(212,163,115,0.04)",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {file ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <FileText size={20} color="#A67C52" />
                  <span style={{ fontSize: 13, color: "#555" }}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#AAA",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload
                    size={24}
                    color="#D4A373"
                    style={{ margin: "0 auto 8px" }}
                  />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#333",
                      marginBottom: 4,
                    }}
                  >
                    Drop file here or click to browse
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    PDF or DOCX · Max 20MB
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const allowed = [
                  "application/pdf",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];
                if (!allowed.includes(f.type)) {
                  setError(
                    "Only PDF and Word documents (.pdf, .docx) are allowed.",
                  );
                  return;
                }
                if (f.size > 20 * 1024 * 1024) {
                  setError("File size must not exceed 20MB.");
                  return;
                }
                setFile(f);
                setError(null);
              }}
            />

            <div>
              <label style={lbl}>Document Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Couture Agreement"
                style={inp}
              />
            </div>

            <div>
              <label style={lbl}>Assign to Bride *</label>
              <select
                value={brideId}
                onChange={(e) => setBrideId(e.target.value)}
                style={inp}
              >
                <option value="">Select a bride…</option>
                {brides.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px",
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
                type="submit"
                disabled={uploading}
                style={{
                  flex: 2,
                  padding: "11px",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  background: uploading ? "#C4A88C" : "#2C2C2C",
                  cursor: uploading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Uploading…
                  </>
                ) : (
                  "Upload Document"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function AdminDocumentsDesktop() {
  const queryClient = useQueryClient();
  const [selectedBrideId, setSelectedBrideId] = useState<string | "ALL">("ALL");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data: brides = [] } = useQuery({
    queryKey: queryKeys.brides.names(),
    queryFn: () => bridesApi.names(),
  });

  // Single API call — filter by brideId and/or search on the backend
  const { data: allDocs = [], isLoading } = useQuery({
    queryKey: ["admin-docs", selectedBrideId, debouncedSearch],
    queryFn: () =>
      documentsApi.listAll({
        brideId: selectedBrideId === "ALL" ? undefined : selectedBrideId,
        search: debouncedSearch || undefined,
      }),
  });

  const filtered = allDocs;
  const doc = filtered.find((d) => d.id === selectedDoc) ?? null;
  // Use bride data embedded in the doc response
  const docBride =
    doc?.bride ?? (doc ? brides.find((b) => b.id === doc.brideId) : null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-docs"] });
      setSelectedDoc(null);
      toast({ title: "Document deleted" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  const typeColors: Record<string, string> = {
    pdf: "#F5EFE9",
    docx: "#F0F0FF",
  };
  const typeLabel: Record<string, string> = { pdf: "PDF", docx: "DOCX" };

  return (
    <AdminLayout>
      <main
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {/* Left panel */}
          <div
            style={{
              width: 480,
              borderRight: "1px solid #E8E0D5",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "22px 18px 14px",
                borderBottom: "1px solid #E8E0D5",
                background: "#fff",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#2C2C2C",
                    margin: 0,
                  }}
                >
                  Documents
                </h1>
                <button
                  onClick={() => setShowUpload(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 15px",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={13} /> Upload
                </button>
              </div>

              {/* Bride filter pills */}
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  marginBottom: 10,
                  overflowX: "auto",
                  paddingBottom: 4,
                  scrollbarWidth: "none",
                }}
              >
                <button
                  onClick={() => setSelectedBrideId("ALL")}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 12,
                    border: `1px solid ${selectedBrideId === "ALL" ? "#333" : "#E8E0D5"}`,
                    background: selectedBrideId === "ALL" ? "#333" : "#fff",
                    color: selectedBrideId === "ALL" ? "#fff" : "#666",
                    fontSize: 10,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  All Brides
                </button>
                {brides.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrideId(b.id)}
                    style={{
                      padding: "3px 9px",
                      borderRadius: 12,
                      border: `1px solid ${selectedBrideId === b.id ? "#333" : "#E8E0D5"}`,
                      background: selectedBrideId === b.id ? "#333" : "#fff",
                      color: selectedBrideId === b.id ? "#fff" : "#666",
                      fontSize: 10,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {b.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FAF8F5",
                  border: "1px solid #E8E0D5",
                  borderRadius: 7,
                  padding: "7px 12px",
                }}
              >
                <Search size={13} color="#AAA" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, bride name or email…"
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: 12,
                    color: "#333",
                    background: "transparent",
                    flex: 1,
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px 0",
                  }}
                >
                  <Loader2 size={20} className="animate-spin" color="#D4A373" />
                </div>
              )}
              {!isLoading && filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#AAA",
                    fontSize: 12,
                  }}
                >
                  No documents found.
                </div>
              )}
              {filtered.map((d) => {
                const bride = d.bride ?? brides.find((b) => b.id === d.brideId);
                const isSelected = selectedDoc === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDoc(d.id)}
                    style={{
                      padding: "12px 13px",
                      borderRadius: 9,
                      border: `1px solid ${isSelected ? "#D4A373" : "#E8E0D5"}`,
                      background: isSelected ? "#FFF9F4" : "#fff",
                      marginBottom: 7,
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 2px 8px rgba(212,163,115,0.12)"
                        : "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          background: typeColors[d.fileType] ?? "#F5EFE9",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={16} color="#A67C52" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#2C2C2C",
                            marginBottom: 4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              padding: "1px 7px",
                              background: typeColors[d.fileType] ?? "#F5EFE9",
                              color: "#666",
                              borderRadius: 10,
                            }}
                          >
                            {typeLabel[d.fileType] ?? d.fileType}
                          </span>
                          <span style={{ fontSize: 10, color: "#AAA" }}>
                            {bride?.name.split(" ")[0] ?? "—"} ·{" "}
                            {new Date(d.uploadedAt).toLocaleDateString(
                              "en-AU",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {doc ? (
            <div style={{ flex: 1, overflowY: "auto", padding: "26px 28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 22,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22,
                      fontWeight: 500,
                      color: "#2C2C2C",
                      margin: "0 0 7px",
                    }}
                  >
                    {doc.title}
                  </h2>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 9px",
                        background: typeColors[doc.fileType] ?? "#F5EFE9",
                        color: "#666",
                        borderRadius: 10,
                      }}
                    >
                      {typeLabel[doc.fileType] ?? doc.fileType}
                    </span>
                    <span style={{ fontSize: 11, color: "#AAA" }}>
                      Uploaded{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "#fff",
                      border: "1px solid #E8E0D5",
                      borderRadius: 7,
                      fontSize: 12,
                      color: "#555",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    <Eye size={13} /> View
                  </a>
                  <button
                    onClick={async () => {
                      const { downloadFile } =
                        await import("@/lib/downloadFile");
                      await downloadFile(
                        doc.fileUrl,
                        `${doc.title}.${doc.fileType}`,
                      );
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "#fff",
                      border: "1px solid #E8E0D5",
                      borderRadius: 7,
                      fontSize: 12,
                      color: "#555",
                      cursor: "pointer",
                    }}
                  >
                    <Download size={13} /> Download
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(doc.id)}
                    disabled={deleteMutation.isPending}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      background: "#fff",
                      border: "1px solid #FFCCCC",
                      borderRadius: 7,
                      fontSize: 12,
                      color: "#CC4444",
                      cursor: "pointer",
                    }}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}{" "}
                    Delete
                  </button>
                </div>
              </div>

              {docBride && (
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#AAA",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 10,
                    }}
                  >
                    Assigned Bride
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      background: "#fff",
                      border: "1px solid #E8E0D5",
                      borderRadius: 9,
                    }}
                  >
                    <Avatar
                      style={{
                        width: 32,
                        height: 32,
                        border: "1.5px solid #E8D8CE",
                      }}
                    >
                      <AvatarFallback
                        style={{
                          background: "#E8D8CE",
                          color: "#A67C52",
                          fontSize: 11,
                        }}
                      >
                        {docBride.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#2C2C2C",
                        }}
                      >
                        {docBride.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#AAA" }}>
                        {docBride.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#AAA",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 10,
                  }}
                >
                  Document Preview
                </div>
                <div
                  style={{
                    background: "#F0EBE4",
                    borderRadius: 10,
                    padding: "44px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid #E8E0D5",
                  }}
                >
                  <FileText size={36} color="rgba(212,163,115,0.4)" />
                  <span style={{ fontSize: 13, color: "#AAA" }}>
                    Click View to open the full document
                  </span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "7px 18px",
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      fontSize: 12,
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    Open Preview
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
                color: "#CCCCCC",
              }}
            >
              <FileText size={40} />
              <span style={{ fontSize: 14 }}>
                Select a document to view details
              </span>
            </div>
          )}
        </div>
      </main>

      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        brides={brides}
      />
    </AdminLayout>
  );
}
