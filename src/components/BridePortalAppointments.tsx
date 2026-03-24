import { useState } from "react";
import {
  CheckCircle2, Clock, MapPin, ChevronRight, Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";

const upcoming = [
  {
    id: 1, bride: "Sophie Anderson", type: "Final Fitting", day: "Tuesday", date: "24 Mar 2026", time: "2:00 PM",
    duration: "90 min", location: "Paddington Studio", address: "12 William St, Paddington NSW 2021",
    note: "Please bring your wedding shoes, veil and undergarments so we can perfect the hem length and overall silhouette.",
    status: "upcoming",
  },
  {
    id: 2, bride: "Sophie Anderson", type: "Dress Collection", day: "Wednesday", date: "4 May 2026", time: "10:00 AM",
    duration: "30 min", location: "Paddington Studio", address: "12 William St, Paddington NSW 2021",
    note: "Your gown will be steamed, pressed and carefully packaged for collection. Bring a trusted person and a garment bag.",
    status: "upcoming",
  },
];

const past = [
  { type: "2nd Fitting", date: "10 Feb 2026", time: "11:00 AM", notes: "Lace overlay and bustle mechanism fitted. Minor waist adjustments." },
  { type: "1st Fitting", date: "20 Jan 2026", time: "2:00 PM", notes: "Toile fitted and adjusted. Sweetheart neckline confirmed." },
  { type: "Consultation", date: "5 Dec 2025", time: "10:00 AM", notes: "Vision discussed. Chantilly lace selected. Measurements taken." },
];

export function BridePortalAppointments() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>My Appointments</h1>
            <p style={{ fontSize: 13, color: "#888888", margin: 0 }}>Your fitting schedule with Fatima K Designs, Paddington</p>
          </div>

          {/* ── Upcoming ── */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #E8E0D5" }}>Upcoming Appointments</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {upcoming.map((appt) => {
                const open = expanded === appt.id;
                return (
                  <div key={appt.id} style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                    <div
                      onClick={() => setExpanded(open ? null : appt.id)}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", cursor: "pointer" }}
                    >
                      <div style={{ background: "#F5EFE9", borderRadius: 10, padding: "10px 14px", textAlign: "center", flexShrink: 0, minWidth: 58 }}>
                        <div style={{ fontSize: 9, color: "#A67C52", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {appt.date.split(" ")[1]}
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#2C2C2C", lineHeight: 1 }}>
                          {appt.date.split(" ")[0]}
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C" }}>
                            {appt.type}
                          </span>
                          <Badge style={{ background: "#E8D8CE", color: "#A67C52", border: "none", fontSize: 10 }}>Upcoming</Badge>
                        </div>
                        <div style={{ display: "flex", gap: 20 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#666" }}>
                            <Clock size={12} color="#D4A373" /> {appt.day} · {appt.time} ({appt.duration})
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#666" }}>
                            <MapPin size={12} color="#D4A373" /> {appt.location}
                          </span>
                        </div>
                      </div>

                      <div style={{ color: "#AAAAAA", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    {open && (
                      <div style={{ borderTop: "1px solid #F0EBE4", padding: "18px 22px", display: "flex", gap: 24, background: "#FDFAF8" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Location</div>
                            <div style={{ fontSize: 13, color: "#555" }}>{appt.address}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>What to bring</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "linear-gradient(135deg, #F5EFE9, #EDE4DA)", borderRadius: 8, padding: "12px 14px" }}>
                              <Info size={14} color="#A67C52" style={{ flexShrink: 0, marginTop: 1 }} />
                              <div style={{ fontSize: 13, color: "#555555", lineHeight: 1.55 }}>{appt.note}</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, minWidth: 160 }}>
                          <button style={{ padding: "10px 18px", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Add to Calendar</button>
                          <button style={{ padding: "10px 18px", background: "#FFFFFF", color: "#555", border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>Get Directions</button>
                          <a href="#" style={{ textAlign: "center", fontSize: 11, color: "#A67C52", marginTop: 4, textDecoration: "none" }}>Contact Fatima</a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Past appointments ── */}
          <section>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #E8E0D5" }}>Past Appointments</h2>
            <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <CardContent style={{ padding: 0 }}>
                {past.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 22px", borderBottom: i < past.length - 1 ? "1px solid #F0EBE4" : "none", opacity: 0.75 }}>
                    <CheckCircle2 size={18} color="#D4A373" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: "#555", textDecoration: "line-through" }}>{p.type}</span>
                        <span style={{ fontSize: 12, color: "#AAAAAA" }}>{p.date} · {p.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#888888", lineHeight: 1.5 }}>{p.notes}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
    </BridePortalLayout>
  );
}
