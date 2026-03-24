import { useState } from "react";
import {
  FileText, Upload, Link2, Search, Eye,
  Trash2, X, Plus, Paperclip, CheckCircle2, Download
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";

const brides = ["Sophie Anderson", "Isabelle Chen", "Natalie Russo", "Priya Mehta", "Zara Williams"];

const activities = {
  "Sophie Anderson": [
    { id: "a1", label: "Consultation — 5 Dec 2025", type: "appointment" },
    { id: "a2", label: "1st Fitting — 20 Jan 2026", type: "appointment" },
    { id: "a3", label: "2nd Fitting — 10 Feb 2026", type: "appointment" },
    { id: "a4", label: "Final Fitting — 24 Mar 2026", type: "appointment" },
    { id: "p1", label: "Booking Deposit — $1,500", type: "payment" },
    { id: "p2", label: "Fabrication Payment — $3,200", type: "payment" },
    { id: "m1", label: "Dress Journey — Chantilly Lace Gown", type: "milestone" },
  ],
};

const docs = [
  {
    id: 1,
    name: "Couture Agreement — Sophie Anderson.pdf",
    bride: "Sophie Anderson",
    type: "Contract",
    size: "248 KB",
    uploaded: "5 Dec 2025",
    linkedActivities: ["a1", "p1"],
  },
  {
    id: 2,
    name: "Fabric & Lace Selection Form.pdf",
    bride: "Sophie Anderson",
    type: "Form",
    size: "92 KB",
    uploaded: "20 Jan 2026",
    linkedActivities: ["a2", "m1"],
  },
  {
    id: 3,
    name: "Pre-Collection Checklist.pdf",
    bride: "Sophie Anderson",
    type: "Checklist",
    size: "55 KB",
    uploaded: "14 Mar 2026",
    linkedActivities: ["a4"],
  },
  {
    id: 4,
    name: "Couture Agreement — Isabelle Chen.pdf",
    bride: "Isabelle Chen",
    type: "Contract",
    size: "248 KB",
    uploaded: "3 Oct 2025",
    linkedActivities: [],
  },
  {
    id: 5,
    name: "Alteration Terms — Natalie Russo.pdf",
    bride: "Natalie Russo",
    type: "Contract",
    size: "140 KB",
    uploaded: "10 Jan 2026",
    linkedActivities: [],
  },
];

const typeColors: Record<string, string> = {
  Contract: "#F5EFE9",
  Form: "#F0F0FF",
  Checklist: "#E8F4E8",
  Invoice: "#FEF0E0",
  Other: "#F5F5F5",
};

export function AdminDocumentsDesktop() {
  const [selectedBride, setSelectedBride] = useState("Sophie Anderson");
  const [selectedDoc, setSelectedDoc] = useState<number | null>(1);
  const [linking, setLinking] = useState(false);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState("Contract");

  const filtered = docs.filter(d =>
    (selectedBride === "All" || d.bride === selectedBride) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const doc = docs.find(d => d.id === selectedDoc);
  const docActivities = activities["Sophie Anderson"] ?? [];

  return (
    <AdminLayout>
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>

        {/* Upload modal */}
        {showUpload && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Card style={{ width: 500, background: "#fff", border: "1px solid #E8E0D5", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
              <CardContent style={{ padding: "28px 28px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C" }}>Upload Document</div>
                  <button onClick={() => setShowUpload(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}><X size={18} /></button>
                </div>

                <div style={{ border: "1.5px dashed #D4A373", borderRadius: 10, padding: "30px 20px", background: "rgba(212,163,115,0.04)", textAlign: "center", marginBottom: 20 }}>
                  <Upload size={28} color="#D4A373" style={{ margin: "0 auto 10px" }} />
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 4 }}>Drop your file here</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>PDF, DOCX · Max 20MB</div>
                  <button style={{ padding: "7px 18px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, cursor: "pointer" }}>Browse files</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Assign to Bride</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#555", cursor: "pointer" }}>
                      {selectedBride}
                      <svg style={{ marginLeft: "auto" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Document Type</label>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                      {["Contract", "Form", "Checklist", "Invoice", "Other"].map(t => (
                        <button key={t} onClick={() => setUploadType(t)} style={{ padding: "5px 13px", borderRadius: 6, border: `1px solid ${uploadType === t ? "#333" : "#E8E0D5"}`, background: uploadType === t ? "#333" : "#fff", color: uploadType === t ? "#fff" : "#555", fontSize: 11, cursor: "pointer" }}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Link to Activity <span style={{ fontWeight: 400, textTransform: "none", color: "#BBB" }}>— optional</span></label>
                    <div style={{ background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 7, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "#AAAAAA", marginBottom: 8 }}>Connect this document to an appointment, payment or milestone</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {docActivities.slice(0, 5).map(act => {
                          const tagBg = act.type === "appointment" ? "#EDE4DA" : act.type === "payment" ? "#E8F4E8" : "#F5EFE9";
                          return (
                            <label key={act.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555", cursor: "pointer" }}>
                              <input type="checkbox" style={{ accentColor: "#D4A373" }} />
                              <span style={{ fontSize: 9, padding: "1px 7px", background: tagBg, color: "#666", borderRadius: 10 }}>{act.type}</span>
                              {act.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Note <span style={{ fontWeight: 400, textTransform: "none", color: "#BBB" }}>— optional</span></label>
                    <div style={{ background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#AAAAAA", minHeight: 44 }}>Add a note for the bride about this document…</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowUpload(false)} style={{ padding: "9px 20px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 13, color: "#555", cursor: "pointer" }}>Cancel</button>
                  <button style={{ padding: "9px 22px", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Upload Document</button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

          {/* Document list panel */}
          <div style={{ width: 400, borderRight: "1px solid #E8E0D5", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "22px 18px 14px", borderBottom: "1px solid #E8E0D5", background: "#fff", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>Documents</h1>
                <button onClick={() => setShowUpload(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 15px", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  <Plus size={13} /> Upload
                </button>
              </div>

              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                {["All", ...brides.slice(0, 4)].map(b => (
                  <button key={b} onClick={() => setSelectedBride(b)} style={{ padding: "3px 9px", borderRadius: 12, border: `1px solid ${selectedBride === b ? "#333" : "#E8E0D5"}`, background: selectedBride === b ? "#333" : "#fff", color: selectedBride === b ? "#fff" : "#666", fontSize: 10, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {b === "All" ? "All Brides" : b.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 7, padding: "7px 12px" }}>
                <Search size={13} color="#AAA" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…" style={{ border: "none", outline: "none", fontSize: 12, color: "#333", background: "transparent", flex: 1 }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
              {filtered.map(d => {
                const isSelected = selectedDoc === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDoc(d.id)}
                    style={{ padding: "12px 13px", borderRadius: 9, border: `1px solid ${isSelected ? "#D4A373" : "#E8E0D5"}`, background: isSelected ? "#FFF9F4" : "#fff", marginBottom: 7, cursor: "pointer", boxShadow: isSelected ? "0 2px 8px rgba(212,163,115,0.12)" : "0 1px 3px rgba(0,0,0,0.04)" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: typeColors[d.type] ?? "#F5EFE9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={16} color="#A67C52" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#2C2C2C", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontSize: 9, padding: "1px 7px", background: typeColors[d.type] ?? "#F5EFE9", color: "#666", borderRadius: 10 }}>{d.type}</span>
                          <span style={{ fontSize: 10, color: "#AAA" }}>{d.bride.split(" ")[0]} · {d.size} · {d.uploaded}</span>
                        </div>
                        {d.linkedActivities.length > 0 && (
                          <div style={{ marginTop: 5, display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, color: "#A67C52", background: "#F5EFE9", padding: "2px 7px", borderRadius: 10 }}>
                            <Link2 size={9} /> {d.linkedActivities.length} linked
                          </div>
                        )}
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

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", margin: "0 0 7px" }}>{doc.name}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, padding: "2px 9px", background: typeColors[doc.type] ?? "#F5EFE9", color: "#666", borderRadius: 10 }}>{doc.type}</span>
                    <span style={{ fontSize: 11, color: "#AAA" }}>Uploaded {doc.uploaded} · {doc.size}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, color: "#555", cursor: "pointer" }}>
                    <Eye size={13} /> Preview
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, color: "#555", cursor: "pointer" }}>
                    <Download size={13} /> Download
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #FFCCCC", borderRadius: 7, fontSize: 12, color: "#CC4444", cursor: "pointer" }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Assigned Bride</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 9 }}>
                  <Avatar style={{ width: 32, height: 32, border: "1.5px solid #E8D8CE" }}>
                    <AvatarFallback style={{ background: "#E8D8CE", color: "#A67C52", fontSize: 11 }}>{doc.bride.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2C" }}>{doc.bride}</div>
                    <div style={{ fontSize: 11, color: "#AAA" }}>Couture bride · Wedding 4 May 2026</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.07em" }}>Linked Activities</div>
                  <button onClick={() => setLinking(!linking)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#F5EFE9", border: "1px solid #E8D8CE", borderRadius: 6, fontSize: 10, color: "#A67C52", cursor: "pointer" }}>
                    <Paperclip size={10} /> {linking ? "Done" : "Link Activity"}
                  </button>
                </div>

                {doc.linkedActivities.length === 0 && !linking ? (
                  <div style={{ padding: "14px 16px", background: "#FAF8F5", border: "1px dashed #E8E0D5", borderRadius: 8, fontSize: 12, color: "#AAAAAA", textAlign: "center" }}>
                    No activities linked — click "Link Activity" to connect this document to an appointment, payment or milestone
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {docActivities.map(act => {
                      const isLinked = doc.linkedActivities.includes(act.id);
                      if (!linking && !isLinked) return null;
                      const tagBg = act.type === "appointment" ? "#EDE4DA" : act.type === "payment" ? "#E8F4E8" : "#F5EFE9";
                      return (
                        <div key={act.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#fff", border: `1px solid ${isLinked ? "#D4A373" : "#EEEEEE"}`, borderRadius: 8 }}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${isLinked ? "#D4A373" : "#DDD"}`, background: isLinked ? "#D4A373" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {isLinked && <CheckCircle2 size={10} color="#fff" />}
                          </div>
                          <span style={{ fontSize: 9, padding: "1px 7px", background: tagBg, color: "#666", borderRadius: 10 }}>{act.type}</span>
                          <span style={{ fontSize: 12, color: "#333", flex: 1 }}>{act.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Document Preview</div>
                <div style={{ background: "#F0EBE4", borderRadius: 10, padding: "44px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, border: "1px solid #E8E0D5" }}>
                  <FileText size={36} color="rgba(212,163,115,0.4)" />
                  <span style={{ fontSize: 13, color: "#AAA" }}>Click Preview to open the full document</span>
                  <button style={{ padding: "7px 18px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, cursor: "pointer" }}>Open Preview</button>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#CCCCCC" }}>
              <FileText size={40} />
              <span style={{ fontSize: 14 }}>Select a document to view details</span>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
