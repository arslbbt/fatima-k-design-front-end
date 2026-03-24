import { Calendar, Clock, MapPin, ChevronDown, ChevronRight, Menu, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

function Header({ page }: { page: string }) {
  return (
    <>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, flexShrink: 0 }}>
        <img src="/fatimak-portal/fatimak-logo.jpg" alt="Fatima K" style={{ height: 24, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: `1.5px solid ${S.accent}60` }}>
            <AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>SA</AvatarFallback>
          </Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>My Portal</span>
        <ChevronRight size={12} color={S.muted} />
        <span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>{page}</span>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
      <img src="/fatimak-portal/fatimak-logo.jpg" alt="Fatima K" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
      <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
    </footer>
  );
}

export function BrideAppointmentsMobile() {
  const upcoming = [
    { month: "Mar", date: "24", day: "Tuesday", time: "2:00 PM", type: "Final Fitting", location: "Paddington Studio", note: "Bring your wedding shoes, veil and undergarments for the perfect hem length.", status: "upcoming" },
    { month: "Apr", date: "15", day: "Wednesday", time: "10:30 AM", type: "Dress Collection", location: "Paddington Studio", note: "Bring your garment bag and a trusted person to help carry.", status: "upcoming" },
  ];
  const past = [
    { month: "Feb", date: "10", day: "Monday", time: "11:00 AM", type: "2nd Fitting", location: "Paddington Studio", status: "completed" },
    { month: "Jan", date: "20", day: "Friday", time: "2:00 PM", type: "1st Fitting", location: "Paddington Studio", status: "completed" },
    { month: "Dec", date: "5", day: "Tuesday", time: "10:00 AM", type: "Consultation", location: "Paddington Studio", status: "completed" },
  ];

  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <Header page="My Appointments" />
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>

        <section>
          <h2 style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 500, color: S.dark, margin: "0 0 12px", paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Upcoming</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map((a, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ background: S.sidebar, borderRadius: 8, padding: "6px 10px", textAlign: "center", flexShrink: 0, minWidth: 44 }}>
                    <div style={{ fontSize: 9, color: S.accentText, fontWeight: 600, textTransform: "uppercase" }}>{a.month}</div>
                    <div style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 600, color: S.dark, lineHeight: 1 }}>{a.date}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark }}>{a.type}</div>
                      <Badge style={{ background: "#E8D8CE", color: S.accentText, border: "none", fontSize: 9 }}>Upcoming</Badge>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}><Calendar size={12} color={S.accent} />{a.day} · {a.time}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}><MapPin size={12} color={S.accent} />{a.location}</div>
                    </div>
                  </div>
                </div>
                {a.note && (
                  <div style={{ background: S.bg, borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#666", border: `1px solid ${S.border}` }}>
                    <span style={{ fontWeight: 600, color: S.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>What to bring</span>
                    {a.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ paddingBottom: 24 }}>
          <h2 style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 500, color: S.dark, margin: "0 0 12px", paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Past Appointments</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {past.map((a, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, opacity: 0.75, boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                <div style={{ background: "#F3F3F3", borderRadius: 8, padding: "6px 10px", textAlign: "center", flexShrink: 0, minWidth: 44 }}>
                  <div style={{ fontSize: 9, color: S.muted, fontWeight: 600, textTransform: "uppercase" }}>{a.month}</div>
                  <div style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 600, color: "#666", lineHeight: 1 }}>{a.date}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#666", fontWeight: 500, textDecoration: "line-through" }}>{a.type}</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 3 }}>{a.time} · {a.location}</div>
                </div>
                <CheckCircle2 size={18} color={S.accent} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
