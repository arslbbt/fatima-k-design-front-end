import { Camera, ZoomIn, Menu, ChevronRight, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

const sessions = [
  {
    label: "Final Fitting", date: "Scheduled 24 Mar 2026", upcoming: true,
    photos: [],
    note: "Photos will be added here after your appointment."
  },
  {
    label: "2nd Fitting", date: "10 Feb 2026", upcoming: false,
    photos: [
      { bg: "linear-gradient(135deg, #F0E4D8, #DDD0C0)" },
      { bg: "linear-gradient(225deg, #EDE4DA, #E8D0C0)" },
      { bg: "linear-gradient(45deg, #F5EFE9, #E0D4C8)" },
      { bg: "linear-gradient(315deg, #E8D8CE, #F0E8E0)" },
    ],
    note: "Added by Fatima · 11 Feb 2026"
  },
  {
    label: "1st Fitting", date: "20 Jan 2026", upcoming: false,
    photos: [
      { bg: "linear-gradient(135deg, #EDE4DA, #DDD4CA)" },
      { bg: "linear-gradient(225deg, #F0E8E0, #E0D4C8)" },
    ],
    note: "Added by Fatima · 21 Jan 2026"
  },
];

export function BrideFittingPhotosMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <img src="/fatimak-portal/fatimak-logo.jpg" alt="Fatima K" style={{ height: 24, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: `1.5px solid ${S.accent}60` }}><AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>SA</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>My Portal</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>Fitting Photos</span>
      </div>

      <div style={{ padding: "18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>Photos from each fitting session, added by Fatima after your appointment.</p>

        {sessions.map((session, i) => (
          <section key={i} style={{ paddingBottom: i < sessions.length - 1 ? 20 : 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>
              <div>
                <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: "0 0 2px" }}>{session.label}</h2>
                <div style={{ fontSize: 11, color: S.muted }}>{session.date}</div>
              </div>
              {session.upcoming
                ? <Badge style={{ background: "#E8D8CE", color: S.accentText, border: "none", fontSize: 9 }}>Upcoming</Badge>
                : <span style={{ fontSize: 11, color: S.accentText }}>{session.photos.length} photos</span>
              }
            </div>

            {session.upcoming ? (
              <div style={{ background: "#fff", border: `1px dashed ${S.border}`, borderRadius: 10, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Camera size={28} color={`${S.accent}60`} />
                <span style={{ fontSize: 12, color: S.muted, textAlign: "center" }}>{session.note}</span>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {session.photos.map((p, j) => (
                    <div key={j} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${S.border}`, position: "relative" }}>
                      <div style={{ background: p.bg, aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Camera size={20} color="rgba(212,163,115,0.35)" />
                      </div>
                      <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(255,255,255,0.85)", borderRadius: 6, padding: "4px", display: "flex", alignItems: "center" }}>
                        <ZoomIn size={10} color={S.accentText} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: S.muted }}>
                    <Avatar style={{ width: 16, height: 16 }}><AvatarFallback style={{ background: "#333", color: "#fff", fontSize: 7 }}>FK</AvatarFallback></Avatar>
                    {session.note}
                  </div>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: S.accentText, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Download size={12} /> Save all
                  </button>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-portal/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
