import { useState } from "react";
import {
  CheckCircle2, Clock, FileText, ChevronDown, ChevronUp, Camera
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";

const stages = [
  {
    id: 1,
    label: "Consultation",
    date: "5 December 2025",
    status: "done",
    description: "Initial design consultation and vision alignment.",
    notes: [
      "Discussed your dream gown — a flowing bias-cut silhouette with Chantilly lace sleeves and a deep V back.",
      "Fabric swatches reviewed and selected: French Chantilly lace over silk charmeuse.",
      "Measurements taken across 14 points for a precise custom fit.",
      "Mood board reviewed and approved. Sketch presented and signed off.",
    ],
    designer: "Fatima K",
    photos: 2,
  },
  {
    id: 2,
    label: "1st Fitting",
    date: "20 January 2026",
    status: "done",
    description: "Toile (muslin mock-up) fitted to your body.",
    notes: [
      "Toile fitted and assessed against your measurements.",
      "Neckline revised from scoop to sweetheart — much more flattering.",
      "Sleeve length extended by 2cm at the wrist.",
      "Overall silhouette and train length approved.",
    ],
    designer: "Fatima K",
    photos: 4,
  },
  {
    id: 3,
    label: "2nd Fitting",
    date: "10 February 2026",
    status: "done",
    description: "Lace overlay and construction details fitted.",
    notes: [
      "Chantilly lace overlay hand-pressed and attached to the bodice and sleeves.",
      "Bustle mechanism installed and tested — works perfectly.",
      "Minor waist darts taken in by 0.5cm on each side.",
      "Chapel train lining secured and pressed.",
    ],
    designer: "Fatima K",
    photos: 6,
  },
  {
    id: 4,
    label: "Final Fitting",
    date: "24 March 2026",
    status: "current",
    description: "Last fitting before your wedding day.",
    notes: [
      "Hem will be finalized — please bring your wedding shoes and veil.",
      "Final check of all seams, closures and embellishments.",
      "Steaming and pressing of the full gown.",
      "Any last-minute adjustments to be made.",
    ],
    designer: "Fatima K",
    photos: 0,
  },
  {
    id: 5,
    label: "Collection",
    date: "4 May 2026",
    status: "upcoming",
    description: "Your gown is ready — collect it on your wedding morning.",
    notes: [
      "Gown will be steamed and carefully packaged in a garment bag.",
      "Please bring someone with you to help carry.",
      "Final care and wearing instructions will be provided.",
    ],
    designer: "Fatima K",
    photos: 0,
  },
];

const photoColors = [
  ["#F0E4D8", "#E8D8CE", "#EDE4DA", "#F5EFE9", "#E8D0C0", "#F0E8E0"],
  ["#EDE4DA", "#F0E4D8", "#E8D0C0", "#F5EFE9"],
  ["#F5EFE9", "#E8D8CE", "#EDE4DA", "#F0E4D8", "#E8D0C0", "#DDD4CA"],
];

export function BridePortalDressJourney() {
  const [expanded, setExpanded] = useState<number | null>(4);

  const doneCount = stages.filter(s => s.status === "done").length;
  const progress = Math.round((doneCount / stages.length) * 100);

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>My Dress Journey</h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Bias-cut Chantilly lace gown · Designed by Fatima K</p>
          </div>

          <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", marginBottom: 28 }}>
            <CardContent style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C" }}>Journey Progress</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{doneCount} of {stages.length} stages complete</div>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, color: "#D4A373", lineHeight: 1 }}>{progress}%</div>
              </div>
              <div style={{ background: "#EDE4DA", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #D4A373, #C8956A)", borderRadius: 6, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                {stages.map((s, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.status === "done" ? "#D4A373" : s.status === "current" ? "#fff" : "#E8E0D5", border: s.status === "current" ? "2.5px solid #D4A373" : "none" }} />
                    <span style={{ fontSize: 9, color: s.status === "done" ? "#A67C52" : s.status === "current" ? "#2C2C2C" : "#CCCCCC", fontWeight: s.status === "current" ? 600 : 400, whiteSpace: "nowrap" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {stages.map((stage, idx) => {
              const isDone = stage.status === "done";
              const isCurrent = stage.status === "current";
              const isUpcoming = stage.status === "upcoming";
              const isOpen = expanded === stage.id;

              return (
                <div key={stage.id} style={{ display: "flex", gap: 20, marginBottom: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0, paddingTop: 18 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: isDone ? "#D4A373" : isCurrent ? "#FFFFFF" : "#F0EBE4", border: isCurrent ? "2.5px solid #D4A373" : isDone ? "none" : "2px solid #E8E0D5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, boxShadow: isCurrent ? "0 0 0 4px rgba(212,163,115,0.15)" : "none" }}>
                      {isDone && <CheckCircle2 size={14} color="#fff" />}
                      {isCurrent && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4A373" }} />}
                    </div>
                    {idx < stages.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: isDone ? "#D4A373" : "#E8E0D5", marginTop: 2 }} />
                    )}
                  </div>

                  <div style={{ flex: 1, paddingBottom: idx < stages.length - 1 ? 12 : 0 }}>
                    <div
                      style={{ background: "#FFFFFF", border: `1px solid ${isCurrent ? "#D4A373" : "#E8E0D5"}`, borderRadius: 12, overflow: "hidden", boxShadow: isCurrent ? "0 2px 10px rgba(212,163,115,0.15)" : "0 1px 4px rgba(0,0,0,0.04)", opacity: isUpcoming ? 0.7 : 1, cursor: "pointer" }}
                      onClick={() => setExpanded(isOpen ? null : stage.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: isDone ? "#888" : "#2C2C2C", textDecoration: isDone ? "line-through" : "none" }}>
                              {stage.label}
                            </span>
                            {isDone && <Badge style={{ background: "#E8F4E8", color: "#3A7A3A", border: "none", fontSize: 9 }}>Complete</Badge>}
                            {isCurrent && <Badge style={{ background: "#E8D8CE", color: "#A67C52", border: "none", fontSize: 9 }}>In Progress</Badge>}
                            {isUpcoming && <Badge style={{ background: "#F3F3F3", color: "#888", border: "none", fontSize: 9 }}>Upcoming</Badge>}
                          </div>
                          <div style={{ display: "flex", gap: 16 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
                              <Clock size={11} color="#D4A373" /> {stage.date}
                            </span>
                            <span style={{ fontSize: 12, color: "#888" }}>{stage.description}</span>
                          </div>
                        </div>
                        {isDone && stage.photos > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#A67C52", background: "#F5EFE9", padding: "4px 10px", borderRadius: 6 }}>
                            <Camera size={12} /> {stage.photos} photos
                          </div>
                        )}
                        <div style={{ color: "#CCCCCC" }}>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{ borderTop: "1px solid #F0EBE4", background: "#FDFAF8" }}>
                          <div style={{ display: "flex", gap: 0 }}>
                            <div style={{ flex: 1, padding: "18px 22px" }}>
                              <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                                <FileText size={11} color="#D4A373" />
                                {isDone ? "Fitting Notes" : isCurrent ? "What to Bring" : "What to Expect"}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {stage.notes.map((note, j) => (
                                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4A373", flexShrink: 0, marginTop: 6 }} />
                                    {note}
                                  </div>
                                ))}
                              </div>
                              {isCurrent && (
                                <div style={{ marginTop: 14, padding: "10px 14px", background: "linear-gradient(135deg, #F5EFE9, #EDE4DA)", borderRadius: 8, fontSize: 12, color: "#A67C52", fontWeight: 500 }}>
                                  Your appointment is on <strong>Tuesday 24 March at 2:00 PM</strong> — Paddington Studio
                                </div>
                              )}
                            </div>

                            {isDone && stage.photos > 0 && (
                              <div style={{ width: 220, borderLeft: "1px solid #F0EBE4", padding: "18px 16px", flexShrink: 0 }}>
                                <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                                  <Camera size={11} color="#D4A373" /> Fitting Photos
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                                  {(photoColors[idx - 1] || photoColors[0]).slice(0, stage.photos > 4 ? 4 : stage.photos).map((bg, k) => (
                                    <div key={k} style={{ borderRadius: 8, background: bg, aspectRatio: "3/4", border: "1px solid #E8E0D5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <Camera size={14} color="rgba(212,163,115,0.3)" />
                                    </div>
                                  ))}
                                </div>
                                {stage.photos > 4 && (
                                  <div style={{ marginTop: 6, fontSize: 11, color: "#A67C52", textAlign: "center", cursor: "pointer" }}>+{stage.photos - 4} more photos →</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </BridePortalLayout>
  );
}
