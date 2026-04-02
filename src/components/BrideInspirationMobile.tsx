import { Upload, Plus, Trash2, Image as ImageIcon, Menu, ChevronRight, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

const categories = [
  { label: "All", active: true }, { label: "Lace" }, { label: "Necklines" }, { label: "Veils" }, { label: "Trains" },
];

const photos = [
  { bg: "linear-gradient(135deg, #F0E4D8, #E8D0C0)", label: "Chantilly lace detail", tag: "Lace" },
  { bg: "linear-gradient(225deg, #EDE4DA, #DDD0C0)", label: "Sweetheart neckline", tag: "Necklines" },
  { bg: "linear-gradient(45deg, #F5EFE9, #E8D8CE)", label: "Cathedral veil", tag: "Veils" },
  { bg: "linear-gradient(315deg, #E8D0C0, #F0E8E0)", label: "Chapel train", tag: "Trains" },
  { bg: "linear-gradient(135deg, #EDE4DA, #F5EFE9)", label: "Sleeve lace pattern", tag: "Lace" },
  { bg: "linear-gradient(225deg, #F0E8E0, #E8D0C0)", label: "Open back detail", tag: "Necklines" },
];

export function BrideInspirationMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <img src="/fatimak-logo.jpg" alt="Fatima K" style={{ height: 24, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: `1.5px solid ${S.accent}60` }}><AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>SA</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>My Portal</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>Inspiration Board</span>
      </div>

      <div style={{ padding: "18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Upload CTA */}
        <div style={{ background: "#fff", border: `1.5px dashed ${S.accent}`, borderRadius: 10, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 40, height: 40, background: "#F5EFE9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Upload size={18} color={S.accent} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.dark }}>Upload your inspiration</div>
          <div style={{ fontSize: 11, color: S.muted, textAlign: "center" }}>Share lace details, necklines, veils or any style you love</div>
          <button style={{ marginTop: 4, padding: "8px 20px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Choose Photos</button>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {categories.map((c, i) => (
            <button key={i} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${c.active ? S.accent : S.border}`, background: c.active ? S.accent : "#fff", color: c.active ? "#fff" : S.muted, fontSize: 11, fontWeight: c.active ? 600 : 400, flexShrink: 0, cursor: "pointer" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>
            <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: 0 }}>My Uploads</h2>
            <span style={{ fontSize: 11, color: S.muted }}>{photos.length} photos</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {photos.map((p, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${S.border}` }}>
                <div style={{ background: p.bg, height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <ImageIcon size={24} color="rgba(212,163,115,0.35)" />
                  <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "2px 7px", fontSize: 9, color: S.accentText, fontWeight: 600 }}>{p.tag}</div>
                </div>
                <div style={{ background: "#fff", padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#555" }}>{p.label}</span>
                  <Trash2 size={12} color="#CCCCCC" />
                </div>
              </div>
            ))}
            {/* Add more tile */}
            <div style={{ borderRadius: 10, border: `1.5px dashed ${S.border}`, height: 152, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", background: "#FAFAFA" }}>
              <Plus size={22} color={S.border} />
              <span style={{ fontSize: 11, color: S.muted }}>Add more</span>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 24 }}>
          <div style={{ paddingBottom: 8, borderBottom: `1px solid ${S.border}`, marginBottom: 10 }}>
            <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: 0 }}>A note for Fatima</h2>
          </div>
          <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#555", lineHeight: 1.6 }}>
            "I love the idea of Chantilly lace sleeves and a deep V back. The chapel train in the 4th photo is exactly what I'm dreaming of!"
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
