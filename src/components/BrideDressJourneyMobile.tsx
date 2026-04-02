import { CheckCircle2, Clock, Circle, ChevronRight, Menu, Calendar, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

function Header({ page }: { page: string }) {
  return (
    <>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <img src="/fatimak-logo.jpg" alt="Fatima K" style={{ height: 24, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: `1.5px solid ${S.accent}60` }}><AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>SA</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>My Portal</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>{page}</span>
      </div>
    </>
  );
}

const stages = [
  { label: "Consultation", date: "5 Dec 2025", status: "done", note: "Discussed your vision — a flowing bias-cut gown with Chantilly lace sleeves. Fabric samples chosen. Measurements taken." },
  { label: "1st Fitting", date: "20 Jan 2026", status: "done", note: "Toile fitted and adjusted. Neckline revised to a sweetheart shape. Sleeve length confirmed. Overall silhouette approved." },
  { label: "2nd Fitting", date: "10 Feb 2026", status: "done", note: "Lace overlay attached and hand-pressed. Bustle mechanism fitted. Minor waist adjustments made. Looking beautiful!" },
  { label: "Final Fitting", date: "24 Mar 2026", status: "current", note: "Last chance to check everything before your big day. Bring your shoes and veil. Hem will be finalized at this appointment." },
  { label: "Pickup", date: "4 May 2026", status: "upcoming", note: "Your gown will be steamed, bagged and ready for collection the morning of your wedding." },
];

export function BrideDressJourneyMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <Header page="My Dress Journey" />
      <div style={{ padding: "18px 16px", flex: 1 }}>

        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 500, color: S.dark, margin: "0 0 4px" }}>Sophie's Gown Journey</h1>
          <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>Wedding: 4th May 2026 · Bias-cut Chantilly lace gown</p>
        </div>

        {/* Progress bar */}
        <div style={{ background: "#EDE4DA", borderRadius: 6, height: 6, marginBottom: 24 }}>
          <div style={{ width: "75%", height: "100%", background: `linear-gradient(90deg, ${S.accent}, #C8956A)`, borderRadius: 6 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {stages.map((stage, i) => {
            const isDone = stage.status === "done";
            const isCurrent = stage.status === "current";
            const isUpcoming = stage.status === "upcoming";
            return (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < stages.length - 1 ? 0 : 0 }}>
                {/* Timeline column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: isDone ? S.accent : isCurrent ? "#fff" : "#E8E0D5", border: isCurrent ? `2.5px solid ${S.accent}` : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                    {isDone && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    {isCurrent && <div style={{ width: 6, height: 6, borderRadius: "50%", background: S.accent }} />}
                  </div>
                  {i < stages.length - 1 && <div style={{ width: 2, flex: 1, background: isDone ? S.accent : "#E8E0D5", minHeight: 28 }} />}
                </div>
                {/* Content column */}
                <div style={{ flex: 1, paddingBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: isDone ? S.muted : isCurrent ? S.dark : "#AAAAAA", textDecoration: isDone ? "line-through" : "none" }}>{stage.label}</div>
                      <div style={{ fontSize: 11, color: S.muted, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Calendar size={10} color={S.accent} />{stage.date}
                      </div>
                    </div>
                    {isCurrent && <Badge style={{ background: "#E8D8CE", color: S.accentText, border: "none", fontSize: 9 }}>In progress</Badge>}
                    {isUpcoming && <Badge style={{ background: "#F3F3F3", color: S.muted, border: "none", fontSize: 9 }}>Upcoming</Badge>}
                    {isDone && <CheckCircle2 size={16} color={S.accent} />}
                  </div>
                  {(isDone || isCurrent) && (
                    <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <FileText size={12} color={S.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                        {stage.note}
                      </div>
                    </div>
                  )}
                  {isUpcoming && (
                    <div style={{ background: "#FAFAFA", border: `1px dashed ${S.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: S.muted, lineHeight: 1.5 }}>
                      {stage.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
