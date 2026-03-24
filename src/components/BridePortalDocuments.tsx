import { useState } from "react";
import {
  FileText, Download, Eye, Link2, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";

const docs = [
  {
    id: 1,
    name: "Couture Agreement",
    description: "Your formal agreement with Fatima K covering design rights, payment terms, cancellation policy and collection date.",
    type: "Contract",
    uploaded: "5 Dec 2025",
    linkedActivities: [
      { label: "Consultation — 5 Dec 2025", type: "appointment" },
      { label: "Booking Deposit — $1,500", type: "payment" },
    ],
  },
  {
    id: 2,
    name: "Fabric & Lace Selection Form",
    description: "Confirms your chosen fabrics — French Chantilly lace over silk charmeuse — and the colour swatches approved at your 1st fitting.",
    type: "Form",
    uploaded: "20 Jan 2026",
    linkedActivities: [
      { label: "1st Fitting — 20 Jan 2026", type: "appointment" },
      { label: "Dress Journey — Chantilly Lace Gown", type: "milestone" },
    ],
  },
  {
    id: 3,
    name: "Pre-Collection Checklist",
    description: "A checklist for your Final Fitting — what to bring, gown care instructions, and collection day logistics.",
    type: "Checklist",
    uploaded: "14 Mar 2026",
    linkedActivities: [
      { label: "Final Fitting — 24 Mar 2026", type: "appointment" },
    ],
  },
];

const typeColors: Record<string, string> = {
  Contract: "#F5EFE9",
  Form: "#F0F0FF",
  Checklist: "#E8F4E8",
};

export function BridePortalDocuments() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>My Documents</h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Contracts and forms shared by Fatima K for your reference and download</p>
          </div>

          <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Documents", value: docs.length.toString() },
              { label: "Contracts", value: docs.filter(d => d.type === "Contract").length.toString() },
              { label: "Forms & Checklists", value: docs.filter(d => d.type !== "Contract").length.toString() },
            ].map((s, i) => (
              <Card key={i} style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <CardContent style={{ padding: "16px 20px" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: "#D4A373" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {docs.map((doc) => {
              const isOpen = expanded === doc.id;

              return (
                <Card key={doc.id} style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 5px rgba(0,0,0,0.05)", overflow: "hidden" }}>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", cursor: "pointer" }}
                    onClick={() => setExpanded(isOpen ? null : doc.id)}
                  >
                    <div style={{ width: 42, height: 42, background: typeColors[doc.type] ?? "#F5EFE9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={20} color="#A67C52" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C" }}>{doc.name}</span>
                        <span style={{ fontSize: 9, padding: "1px 7px", background: typeColors[doc.type] ?? "#F5EFE9", color: "#666", borderRadius: 10 }}>{doc.type}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#AAA" }}>Uploaded {doc.uploaded}</span>
                        {doc.linkedActivities.length > 0 && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "#A67C52", background: "#F5EFE9", padding: "2px 8px", borderRadius: 10 }}>
                            <Link2 size={9} /> {doc.linkedActivities.length} {doc.linkedActivities.length === 1 ? "activity" : "activities"} linked
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={e => e.stopPropagation()}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#F5EFE9", color: "#A67C52", border: "none", borderRadius: 7, fontSize: 12, cursor: "pointer" }}
                      >
                        <Download size={13} /> Download
                      </button>
                      <button
                        onClick={e => e.stopPropagation()}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, color: "#555", cursor: "pointer" }}
                      >
                        <Eye size={13} /> View
                      </button>
                    </div>

                    <div style={{ color: "#CCC", marginLeft: 4 }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid #F0EBE4", background: "#FDFAF8", display: "flex" }}>

                      <div style={{ flex: 1, padding: "18px 22px" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>About this document</div>
                        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: 0 }}>{doc.description}</p>
                      </div>

                      <div style={{ width: 230, borderLeft: "1px solid #F0EBE4", padding: "18px 16px", flexShrink: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                          <Link2 size={11} color="#D4A373" /> Linked to
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                          {doc.linkedActivities.map((act, j) => {
                            const tagBg = act.type === "appointment" ? "#EDE4DA" : act.type === "payment" ? "#E8F4E8" : "#F5EFE9";
                            return (
                              <div key={j} style={{ padding: "8px 10px", background: "#fff", border: "1px solid #EEEEEE", borderRadius: 7 }}>
                                <div style={{ fontSize: 9, padding: "1px 7px", background: tagBg, color: "#666", borderRadius: 10, marginBottom: 4, display: "inline-block" }}>{act.type}</div>
                                <div style={{ fontSize: 11, color: "#333" }}>{act.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

        </div>
      </main>
    </BridePortalLayout>
  );
}
