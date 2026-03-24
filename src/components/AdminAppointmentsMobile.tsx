import { Plus, ChevronRight, ChevronLeft, Menu, Clock, MapPin, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

const weekDays = [
  { day: "Mon", date: 23, hasAppt: false },
  { day: "Tue", date: 24, hasAppt: true, active: true },
  { day: "Wed", date: 25, hasAppt: true },
  { day: "Thu", date: 26, hasAppt: false },
  { day: "Fri", date: 27, hasAppt: true },
  { day: "Sat", date: 28, hasAppt: false },
  { day: "Sun", date: 29, hasAppt: false },
];

const appointments = [
  { bride: "Sophie Anderson", initials: "SA", type: "Final Fitting", time: "2:00 PM", duration: "90 min", location: "Paddington Studio", note: "Sophie to bring shoes + veil", color: "#E8D8CE" },
  { bride: "Emma Clarke", initials: "EC", type: "2nd Fitting", time: "4:00 PM", duration: "60 min", location: "Paddington Studio", note: "Check sleeve lace attachment", color: "#EDE4DA" },
];

const upcomingWeek = [
  { bride: "Mia Chen", initials: "MC", type: "1st Fitting", date: "Fri 27 Mar", time: "3:30 PM" },
  { bride: "Isabelle Martin", initials: "IM", type: "Consultation", date: "Mon 30 Mar", time: "10:00 AM" },
  { bride: "Chloe Nguyen", initials: "CN", type: "2nd Fitting", date: "Wed 1 Apr", time: "2:00 PM" },
];

export function AdminAppointmentsMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div>
          <img src="/fatimak-portal/fatimak-logo.jpg" alt="Fatima K" style={{ height: 20, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", display: "block" }} />
          <div style={{ fontSize: 8, color: "#AAAAAA", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>Admin</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: "1.5px solid #33333340" }}><AvatarFallback style={{ background: "#333", color: "#fff", fontSize: 10, fontWeight: 600 }}>FK</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>Admin</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>Appointments</span>
      </div>

      <div style={{ padding: "18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Week strip */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><ChevronLeft size={18} color="#555" /></button>
            <span style={{ fontFamily: S.serif, fontSize: 17, fontWeight: 500, color: S.dark }}>March 2026</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><ChevronRight size={18} color="#555" /></button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
            {weekDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9, color: S.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.day}</span>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: d.active ? "#333" : "transparent", border: d.hasAppt && !d.active ? `2px solid ${S.accent}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <span style={{ fontSize: 13, fontWeight: d.active ? 600 : 400, color: d.active ? "#fff" : d.hasAppt ? S.dark : S.muted }}>{d.date}</span>
                </div>
                {d.hasAppt && <div style={{ width: 5, height: 5, borderRadius: "50%", background: d.active ? "#333" : S.accent }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Selected day */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>
            <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: 0 }}>Tuesday 24 Mar</h2>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 11, cursor: "pointer" }}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {appointments.map((a, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ background: a.color, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar style={{ width: 28, height: 28 }}><AvatarFallback style={{ background: "#fff", color: S.accentText, fontSize: 10, fontWeight: 600 }}>{a.initials}</AvatarFallback></Avatar>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: S.dark }}>{a.bride}</div>
                      <div style={{ fontSize: 11, color: S.accentText }}>{a.type}</div>
                    </div>
                  </div>
                  <Badge style={{ background: "rgba(255,255,255,0.7)", color: S.accentText, border: "none", fontSize: 10 }}>{a.time}</Badge>
                </div>
                <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ display: "flex", gap: 5, fontSize: 11, color: "#555", alignItems: "center" }}><Clock size={11} color={S.accent} />{a.time} · {a.duration}</div>
                  <div style={{ display: "flex", gap: 5, fontSize: 11, color: "#555", alignItems: "center" }}><MapPin size={11} color={S.accent} />{a.location}</div>
                  <div style={{ display: "flex", gap: 5, fontSize: 11, color: S.muted, alignItems: "flex-start" }}><FileText size={11} color={S.accent} style={{ marginTop: 1 }} />{a.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section style={{ paddingBottom: 24 }}>
          <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: "0 0 12px", paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Coming Up</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcomingWeek.map((a, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                <Avatar style={{ width: 32, height: 32 }}><AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>{a.initials}</AvatarFallback></Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: S.dark }}>{a.bride}</div>
                  <div style={{ fontSize: 11, color: S.muted }}>{a.type} · {a.date}</div>
                </div>
                <span style={{ fontSize: 11, color: S.muted }}>{a.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-portal/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
