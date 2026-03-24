import { useState } from "react";
import {
  Camera, Download, ZoomIn, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";

const albums = [
  {
    id: 1,
    label: "Consultation",
    date: "5 Dec 2025",
    count: 2,
    colors: ["#F0E4D8", "#DDD0C0"],
    note: "Initial mood board and fabric swatches reviewed together.",
  },
  {
    id: 2,
    label: "1st Fitting — Toile",
    date: "20 Jan 2026",
    count: 4,
    colors: ["#EDE4DA", "#DDD4CA", "#F5EFE9", "#E8D8CE"],
    note: "Muslin mock-up fitted — neckline adjusted to sweetheart.",
  },
  {
    id: 3,
    label: "2nd Fitting — Lace",
    date: "10 Feb 2026",
    count: 6,
    colors: ["#F5EFE9", "#E8D8CE", "#EDE4DA", "#F0E4D8", "#E8D0C0", "#DDD4CA"],
    note: "Chantilly lace overlay attached. Train and bustle fitted.",
  },
];

const lightboxPhotos = [
  { bg: "#F5EFE9", label: "Front view" },
  { bg: "#E8D8CE", label: "Back detail" },
  { bg: "#EDE4DA", label: "Lace sleeve close-up" },
  { bg: "#F0E4D8", label: "Train drape" },
  { bg: "#E8D0C0", label: "Side profile" },
  { bg: "#DDD4CA", label: "Bustle mechanism" },
];

export function BridePortalFittingPhotos() {
  const [activeAlbum, setActiveAlbum] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const album = albums.find(a => a.id === activeAlbum);

  return (
    <BridePortalLayout>
      {/* Lightbox overlay */}
      {lightboxIdx !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setLightboxIdx(null)} style={{ position: "absolute", top: 24, right: 28, background: "none", border: "none", cursor: "pointer", color: "#fff" }}><X size={24} /></button>
          <button onClick={() => setLightboxIdx(i => i !== null && i > 0 ? i - 1 : i)} style={{ position: "absolute", left: 28, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><ChevronLeft size={22} /></button>
          <div style={{ background: lightboxPhotos[lightboxIdx]?.bg, width: 360, height: 480, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
            <Camera size={40} color="rgba(212,163,115,0.4)" />
            <span style={{ fontSize: 13, color: "rgba(212,163,115,0.7)" }}>{lightboxPhotos[lightboxIdx]?.label}</span>
          </div>
          <button onClick={() => setLightboxIdx(i => i !== null && i < lightboxPhotos.length - 1 ? i + 1 : i)} style={{ position: "absolute", right: 28, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><ChevronRight size={22} /></button>
          <div style={{ position: "absolute", bottom: 24, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{(lightboxIdx ?? 0) + 1} / {lightboxPhotos.length} — {lightboxPhotos[lightboxIdx]?.label}</div>
        </div>
      )}

      <main className="bp-page-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>
              {activeAlbum ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => setActiveAlbum(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#A67C52", fontSize: 14, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>
                    <ChevronLeft size={16} /> All Albums
                  </button>
                  <span style={{ color: "#DDD" }}>·</span>
                  {album?.label}
                </span>
              ) : "Fitting Photos"}
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              {activeAlbum ? album?.date + " — " + album?.note : "Photos from your fittings, shared by Fatima after each session"}
            </p>
          </div>

          {!activeAlbum ? (
            <>
              <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Photos", value: "12" },
                  { label: "Fittings Documented", value: "3" },
                  { label: "Latest Update", value: "10 Feb 2026" },
                ].map((stat, i) => (
                  <Card key={i} style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <CardContent style={{ padding: "16px 20px" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: "#D4A373" }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {albums.map((alb) => (
                  <Card
                    key={alb.id}
                    onClick={() => setActiveAlbum(alb.id)}
                    style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", cursor: "pointer", overflow: "hidden" }}
                  >
                    <CardContent style={{ padding: 0, display: "flex" }}>
                      <div style={{ display: "flex", width: 200, flexShrink: 0 }}>
                        {alb.colors.slice(0, 3).map((bg, k) => (
                          <div key={k} style={{ flex: 1, background: bg, minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Camera size={16} color="rgba(212,163,115,0.25)" />
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "1px solid #F0EBE4" }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", marginBottom: 6 }}>{alb.label}</div>
                        <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>{alb.date} · {alb.note}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Badge style={{ background: "#F5EFE9", color: "#A67C52", border: "none", fontSize: 10 }}>{alb.count} photos</Badge>
                          <span style={{ fontSize: 12, color: "#D4A373" }}>View album →</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: "#fff", border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 12, color: "#555", cursor: "pointer" }}>
                  <Download size={13} /> Download All
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {lightboxPhotos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setLightboxIdx(i)}
                    style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #E8E0D5", cursor: "pointer", position: "relative", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                  >
                    <div style={{ background: photo.bg, aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Camera size={22} color="rgba(212,163,115,0.3)" />
                    </div>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
                        <ZoomIn size={16} color="#fff" />
                      </div>
                    </div>
                    <div style={{ background: "#fff", padding: "8px 12px" }}>
                      <div style={{ fontSize: 11, color: "#555" }}>{photo.label}</div>
                      <div style={{ fontSize: 10, color: "#AAAAAA" }}>{album?.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </BridePortalLayout>
  );
}
