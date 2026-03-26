import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { documentsApi, type Document } from "@/lib/api";

export function BridePortalDocuments() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["documents-mine"],
    queryFn: () => documentsApi.listMine(),
  });

  const typeColors: Record<string, string> = {
    pdf: "#F5EFE9",
    docx: "#F0F0FF",
  };

  const typeLabel: Record<string, string> = {
    pdf: "PDF",
    docx: "Word Document",
  };

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
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
              My Documents
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Contracts and forms shared by Fatima K for your reference and
              download
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Documents", value: String(docs.length) },
              {
                label: "PDFs",
                value: String(docs.filter((d) => d.fileType === "pdf").length),
              },
              {
                label: "Word Documents",
                value: String(docs.filter((d) => d.fileType === "docx").length),
              },
            ].map((s, i) => (
              <Card
                key={i}
                style={{
                  flex: 1,
                  background: "#FFFFFF",
                  border: "1px solid #E8E0D5",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <CardContent style={{ padding: "16px 20px" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 26,
                      fontWeight: 500,
                      color: "#D4A373",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            ))}
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

          {!isLoading && docs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#AAA",
                fontSize: 13,
              }}
            >
              No documents yet — Fatima will share contracts and forms here.
            </div>
          )}

          {!isLoading && docs.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {docs.map((doc) => {
                const isOpen = expanded === doc.id;
                const bg = typeColors[doc.fileType] ?? "#F5EFE9";

                return (
                  <Card
                    key={doc.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E0D5",
                      boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "18px 22px",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpanded(isOpen ? null : doc.id)}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          background: bg,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={20} color="#A67C52" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 5,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 20,
                              fontWeight: 500,
                              color: "#2C2C2C",
                            }}
                          >
                            {doc.title}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              padding: "1px 7px",
                              background: bg,
                              color: "#666",
                              borderRadius: 10,
                            }}
                          >
                            {typeLabel[doc.fileType] ??
                              doc.fileType.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "#AAA" }}>
                          Uploaded{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString(
                            "en-AU",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <a
                          href={doc.fileUrl}
                          download={doc.title}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 14px",
                            background: "#F5EFE9",
                            color: "#A67C52",
                            border: "none",
                            borderRadius: 7,
                            fontSize: 12,
                            cursor: "pointer",
                            textDecoration: "none",
                          }}
                        >
                          <Download size={13} /> Download
                        </a>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
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
                      </div>

                      <div style={{ color: "#CCC", marginLeft: 4 }}>
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          borderTop: "1px solid #F0EBE4",
                          background: "#FDFAF8",
                          padding: "18px 22px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#AAA",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            marginBottom: 8,
                          }}
                        >
                          About this document
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#555",
                            lineHeight: 1.65,
                            margin: 0,
                          }}
                        >
                          {doc.fileType === "pdf"
                            ? "PDF document"
                            : "Word document"}{" "}
                          — click Download or View to open.
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </BridePortalLayout>
  );
}
