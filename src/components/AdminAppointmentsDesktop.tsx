import { useState } from "react";
import {
  Upload, Plus, Clock, MapPin, ChevronLeft,
  ChevronRight, FileText, X
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";

const weekDays = [
  { short: "MON", date: 23, appts: 0 },
  { short: "TUE", date: 24, appts: 2, active: true },
  { short: "WED", date: 25, appts: 1 },
  { short: "THU", date: 26, appts: 0 },
  { short: "FRI", date: 27, appts: 1 },
  { short: "SAT", date: 28, appts: 0 },
  { short: "SUN", date: 29, appts: 0 },
];

const todayAppts = [
  {
    id: 1, bride: "Sophie Anderson", initials: "SA", type: "Final Fitting",
    time: "2:00 PM", duration: "90 min", accentColor: "#D4A373", bgColor: "#F5EFE9",
    note: "Sophie to bring wedding shoes + veil for hem length. Check lace bodice fit.",
    tags: ["Couture"],
  },
  {
    id: 2, bride: "Emma Clarke", initials: "EC", type: "2nd Fitting",
    time: "4:00 PM", duration: "60 min", accentColor: "#A67C52", bgColor: "#EDE4DA",
    note: "Lace sleeve attachment to review. Zip and busk closure to be fitted.",
    tags: ["Couture"],
  },
];

const upcomingAppts = [
  { bride: "Mia Chen", initials: "MC", type: "1st Fitting", date: "Fri 27 Mar", time: "3:30 PM", tag: "Couture" },
  { bride: "Isabelle Martin", initials: "IM", type: "Consultation", date: "Mon 30 Mar", time: "10:00 AM", tag: "Couture" },
  { bride: "Lily Thompson", initials: "LT", type: "Alterations Review", date: "Mon 30 Mar", time: "2:00 PM", tag: "RTW" },
  { bride: "Chloe Nguyen", initials: "CN", type: "2nd Fitting", date: "Wed 1 Apr", time: "2:00 PM", tag: "Couture" },
  { bride: "Grace Kim", initials: "GK", type: "Final Pickup", date: "Thu 2 Apr", time: "11:00 AM", tag: "RTW" },
];

export function AdminAppointmentsDesktop() {
  const [selectedAppt, setSelectedAppt] = useState<number | null>(1);
  const selected = todayAppts.find(a => a.id === selectedAppt);

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 500, color: "#2C2C2C", margin: "0 0 4px" }}>Appointments</h1>
            <div style={{ fontSize: 12, color: "#888" }}>Paddington Studio · March 2026</div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            <Plus size={15} /> New Appointment
          </button>
        </div>

        {/* Week strip */}
        <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", marginBottom: 24 }}>
          <CardContent style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><ChevronLeft size={18} color="#555" /></button>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C" }}>Week of 23 March 2026</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><ChevronRight size={18} color="#555" /></button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Week", "Month"].map((v, i) => (
                  <button key={i} style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid #E8E0D5", background: i === 0 ? "#333" : "#fff", color: i === 0 ? "#fff" : "#666", fontSize: 11, cursor: "pointer" }}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {weekDays.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, color: "#AAAAAA", letterSpacing: "0.08em" }}>{d.short}</span>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: d.active ? "#333" : "transparent", border: d.appts > 0 && !d.active ? "2px solid #D4A373" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: d.active ? 600 : 400, color: d.active ? "#fff" : d.appts > 0 ? "#2C2C2C" : "#888" }}>{d.date}</span>
                  </div>
                  {d.appts > 0
                    ? <span style={{ fontSize: 10, background: d.active ? "#D4A373" : "#F0E4D8", color: d.active ? "#fff" : "#A67C52", borderRadius: 10, padding: "1px 7px", fontWeight: 600 }}>{d.appts}</span>
                    : <span style={{ fontSize: 10, color: "transparent" }}>·</span>
                  }
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day schedule + detail panel */}
        <div style={{ display: "flex", gap: 20 }}>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #E8E0D5" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>Tuesday 24 March</h2>
              <span style={{ fontSize: 12, color: "#888" }}>{todayAppts.length} appointments</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {todayAppts.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => setSelectedAppt(appt.id)}
                  style={{ background: "#FFFFFF", border: `1px solid ${selectedAppt === appt.id ? "#D4A373" : "#E8E0D5"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", boxShadow: selectedAppt === appt.id ? "0 2px 8px rgba(212,163,115,0.2)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.15s" }}
                >
                  <div style={{ background: appt.bgColor, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar style={{ width: 34, height: 34, border: "2px solid rgba(255,255,255,0.6)" }}>
                      <AvatarFallback style={{ background: "#fff", color: appt.accentColor, fontSize: 11, fontWeight: 700 }}>{appt.initials}</AvatarFallback>
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>{appt.bride}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>{appt.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>{appt.time}</div>
                      <div style={{ fontSize: 10, color: "#888" }}>{appt.duration}</div>
                    </div>
                  </div>
                  {selectedAppt !== appt.id && (
                    <div style={{ padding: "8px 16px", fontSize: 12, color: "#888888" }}>{appt.note.slice(0, 60)}…</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: "#2C2C2C", margin: "0 0 12px", paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>Coming Up This Week</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcomingAppts.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 8 }}>
                    <Avatar style={{ width: 30, height: 30 }}>
                      <AvatarFallback style={{ background: "#E8D8CE", color: "#A67C52", fontSize: 10, fontWeight: 600 }}>{a.initials}</AvatarFallback>
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{a.bride}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{a.type}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#888", textAlign: "right" }}>
                      <div>{a.date}</div>
                      <div style={{ color: "#A67C52", fontWeight: 500 }}>{a.time}</div>
                    </div>
                    <Badge style={{ background: a.tag === "RTW" ? "#EEEEEE" : "#E8D8CE", color: a.tag === "RTW" ? "#666" : "#A67C52", border: "none", fontSize: 9 }}>{a.tag}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ width: 280, flexShrink: 0 }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 0 }}>
                <div style={{ background: selected.bgColor, padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C" }}>{selected.type}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{selected.bride}</div>
                    </div>
                    <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <X size={16} color="#888" />
                    </button>
                  </div>
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#555" }}>
                      <Clock size={13} color="#D4A373" /> {selected.time} · {selected.duration}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#555" }}>
                      <MapPin size={13} color="#D4A373" /> Paddington Studio
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #F0EBE4", paddingTop: 12 }}>
                    <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Fitting Notes</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.55 }}>{selected.note}</div>
                  </div>
                  <div style={{ borderTop: "1px solid #F0EBE4", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button style={{ width: "100%", padding: "9px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>View Bride Profile</button>
                    <button style={{ width: "100%", padding: "9px", background: "#F5EFE9", color: "#A67C52", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <Upload size={13} /> Upload Photos
                    </button>
                    <button style={{ width: "100%", padding: "9px", background: "#FFFFFF", color: "#555", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <FileText size={13} /> Add Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
    </AdminLayout>
  );
}
