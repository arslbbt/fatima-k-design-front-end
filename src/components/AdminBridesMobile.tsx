import { Search, Plus, ChevronRight, Menu, Camera, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

const coutureBrides = [
  { name: "Sophie Anderson", initials: "SA", stage: "Final Fitting", weddingDate: "4 May 2026", balance: "$1,200" },
  { name: "Emma Clarke", initials: "EC", stage: "2nd Fitting", weddingDate: "12 Jun 2026", balance: "$2,400" },
  { name: "Mia Chen", initials: "MC", stage: "1st Fitting", weddingDate: "28 Aug 2026", balance: "$3,800" },
  { name: "Isabelle Martin", initials: "IM", stage: "Consultation", weddingDate: "14 Nov 2026", balance: "$4,000" },
  { name: "Chloe Nguyen", initials: "CN", stage: "1st Fitting", weddingDate: "20 Sep 2026", balance: "$3,200" },
  { name: "Amelia Scott", initials: "AS", stage: "Complete", weddingDate: "8 Mar 2026", balance: "$0" },
];

const rtwBrides = [
  { name: "Lily Thompson", initials: "LT", stage: "Alterations", weddingDate: "2 Apr 2026", balance: "$350" },
  { name: "Grace Kim", initials: "GK", stage: "Ready for Pickup", weddingDate: "17 May 2026", balance: "$0" },
  { name: "Hannah Davis", initials: "HD", stage: "Consultation", weddingDate: "6 Jul 2026", balance: "$1,200" },
  { name: "Olivia Park", initials: "OP", stage: "Alterations", weddingDate: "19 Oct 2026", balance: "$600" },
];

const stageColor: Record<string, string> = {
  "Consultation": "#E8E0D5", "1st Fitting": "#F0E4D8", "2nd Fitting": "#E8D8CE",
  "Final Fitting": "#D4C0B0", "Alterations": "#F0E4D8", "Ready for Pickup": "#D4EDD4", "Complete": "#D4EDD4",
};
const stageText: Record<string, string> = {
  "Consultation": "#888", "1st Fitting": "#A67C52", "2nd Fitting": "#A67C52",
  "Final Fitting": "#7A4A30", "Alterations": "#A67C52", "Ready for Pickup": "#3A7A3A", "Complete": "#3A7A3A",
};

function BrideCard({ bride }: { bride: typeof coutureBrides[0] }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <Avatar style={{ width: 40, height: 40, border: `2px solid ${S.accent}30`, flexShrink: 0 }}>
          <AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 12, fontWeight: 600 }}>{bride.initials}</AvatarFallback>
        </Avatar>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.dark }}>{bride.name}</div>
            {bride.balance === "$0"
              ? <span style={{ fontSize: 11, color: "#3A7A3A", fontWeight: 600 }}>Paid in full</span>
              : <span style={{ fontSize: 11, color: "#B87A4F", fontWeight: 600 }}>{bride.balance} due</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Badge style={{ background: stageColor[bride.stage] || "#E8E0D5", color: stageText[bride.stage] || S.muted, border: "none", fontSize: 9, padding: "1px 6px" }}>{bride.stage}</Badge>
            <span style={{ fontSize: 10, color: S.muted }}>Wedding {bride.weddingDate}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: `1px solid #F0EBE4` }}>
        <button style={{ flex: 1, padding: "7px", background: "#333", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>View Profile</button>
        <button style={{ flex: 1, padding: "7px", background: S.sidebar, color: S.accentText, border: `1px solid ${S.border}`, borderRadius: 6, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <Camera size={11} /> Upload Photos
        </button>
      </div>
    </div>
  );
}

export function AdminBridesMobile() {
  const [tab, setTab] = useState<"couture" | "rtw">("couture");
  const list = tab === "couture" ? coutureBrides : rtwBrides;

  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div>
          <img src="/fatimak-logo.jpg" alt="Fatima K" style={{ height: 20, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", display: "block" }} />
          <div style={{ fontSize: 8, color: "#AAAAAA", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>Admin</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: "1.5px solid #33333340" }}><AvatarFallback style={{ background: "#333", color: "#fff", fontSize: 10, fontWeight: 600 }}>FK</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>Admin</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>All Brides</span>
      </div>

      {/* Tab switcher */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "0 16px", display: "flex" }}>
        {(["couture", "rtw"] as const).map((t) => {
          const label = t === "couture" ? "Couture Brides" : "Ready to Wear";
          const count = t === "couture" ? coutureBrides.length : rtwBrides.length;
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ flex: 1, padding: "13px 4px 11px", background: "none", border: "none", borderBottom: active ? `2px solid ${S.dark}` : "2px solid transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
            >
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? S.dark : S.muted, fontFamily: active ? S.sans : S.sans }}>{label}</span>
              <span style={{ fontSize: 10, background: active ? S.accent : "#EEEEEE", color: active ? "#fff" : S.muted, borderRadius: 10, padding: "1px 7px", fontWeight: 600 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Context label */}
        <div style={{ background: tab === "couture" ? "linear-gradient(135deg, #F0E4D8, #EAD9CC)" : "#F5F5F5", border: `1px solid ${tab === "couture" ? "#E8D0C0" : "#E0E0E0"}`, borderRadius: 8, padding: "9px 12px" }}>
          <div style={{ fontSize: 11, color: tab === "couture" ? S.accentText : "#666", fontWeight: 500 }}>
            {tab === "couture"
              ? "✦  Bespoke gowns designed and made to measure"
              : "◆  Selected styles with alterations and fitting service"}
          </div>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, background: "#fff", border: `1px solid ${S.border}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 8, padding: "9px 12px" }}>
            <Search size={14} color={S.muted} />
            <span style={{ fontSize: 12, color: "#CCCCCC" }}>Search brides…</span>
          </div>
          <button style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#555", cursor: "pointer" }}>
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        {/* Count + add */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: S.muted }}>{list.length} brides</span>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
            <Plus size={13} /> Add Bride
          </button>
        </div>

        {/* Bride list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 28 }}>
          {list.map((bride, i) => <BrideCard key={i} bride={bride} />)}
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>

    </div>
  );
}
