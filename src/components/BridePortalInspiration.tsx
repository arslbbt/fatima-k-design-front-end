import { useState } from "react";
import {
  Image as ImageIcon, Upload, Plus, Trash2, Tag, Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";

const categories = ["All", "Lace & Fabric", "Necklines", "Veils & Headpieces", "Trains", "Details"];

const photos = [
  { id: 1, label: "Chantilly lace sleeves", tag: "Lace & Fabric", aspect: "portrait", bg: "linear-gradient(145deg, #F0E4D8, #DDD0C0)", note: "Love the density of this lace pattern" },
  { id: 2, label: "Sweetheart neckline", tag: "Necklines", aspect: "landscape", bg: "linear-gradient(145deg, #EDE4DA, #DDD4CA)", note: "" },
  { id: 3, label: "Cathedral veil", tag: "Veils & Headpieces", aspect: "portrait", bg: "linear-gradient(145deg, #F5EFE9, #E8D8CE)", note: "Cathedral length — so elegant" },
  { id: 4, label: "Chapel train drape", tag: "Trains", aspect: "portrait", bg: "linear-gradient(145deg, #E8D8CE, #DDD0C0)", note: "" },
  { id: 5, label: "Bias-cut silhouette", tag: "Lace & Fabric", aspect: "portrait", bg: "linear-gradient(145deg, #EDE4DA, #F0E4D8)", note: "This flow is exactly what I want" },
  { id: 6, label: "Open V back", tag: "Necklines", aspect: "landscape", bg: "linear-gradient(145deg, #F0E8E0, #E8D0C0)", note: "" },
  { id: 7, label: "Pearl button detail", tag: "Details", aspect: "portrait", bg: "linear-gradient(145deg, #F5EFE9, #EDE4DA)", note: "Along the back closure" },
  { id: 8, label: "Lace cuff trim", tag: "Details", aspect: "portrait", bg: "linear-gradient(145deg, #E8D8CE, #F0E4D8)", note: "" },
];

export function BridePortalInspiration() {
  const [activeTag, setActiveTag] = useState("All");
  const [selected, setSelected] = useState<number | null>(1);
  const [note, setNote] = useState("Love the density of this lace pattern");

  const filtered = activeTag === "All" ? photos : photos.filter(p => p.tag === activeTag);
  const selectedPhoto = photos.find(p => p.id === selected);

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>Inspiration Board</h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Share your vision with Fatima — upload anything that inspires you</p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#333", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Upload size={15} /> Upload Photos
            </button>
          </div>

          <div style={{ border: "1.5px dashed #D4A373", borderRadius: 12, padding: "20px 24px", background: "rgba(212,163,115,0.04)", display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, background: "#F5EFE9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Upload size={20} color="#D4A373" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 3 }}>Drop photos here to add to your board</div>
              <div style={{ fontSize: 12, color: "#888" }}>JPEG, PNG or HEIC · Max 10MB per image · Any aspect ratio welcome</div>
            </div>
            <button style={{ padding: "8px 18px", background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, color: "#555", cursor: "pointer" }}>Browse files</button>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTag(cat)}
                style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${activeTag === cat ? "#333" : "#E8E0D5"}`, background: activeTag === cat ? "#333" : "#fff", color: activeTag === cat ? "#fff" : "#666", fontSize: 12, fontWeight: activeTag === cat ? 600 : 400, cursor: "pointer" }}
              >
                {cat}
                {cat !== "All" && <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>{photos.filter(p => p.tag === cat).length}</span>}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 20 }}>

            <div style={{ flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {filtered.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelected(photo.id)}
                    style={{ borderRadius: 10, overflow: "hidden", border: `2px solid ${selected === photo.id ? "#D4A373" : "#E8E0D5"}`, cursor: "pointer", boxShadow: selected === photo.id ? "0 2px 12px rgba(212,163,115,0.25)" : "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.15s" }}
                  >
                    <div style={{ background: photo.bg, aspectRatio: photo.aspect === "portrait" ? "3/4" : "4/3", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <ImageIcon size={22} color="rgba(212,163,115,0.3)" />
                      {selected === photo.id && (
                        <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, background: "#D4A373", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={11} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.3))", padding: "12px 10px 8px" }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{photo.label}</div>
                      </div>
                    </div>
                    <div style={{ background: "#fff", padding: "7px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#A67C52", background: "#F5EFE9", padding: "2px 7px", borderRadius: 10 }}>{photo.tag}</span>
                      <Trash2 size={12} color="#DDDDDD" />
                    </div>
                  </div>
                ))}

                <div style={{ borderRadius: 10, border: "1.5px dashed #E8E0D5", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", background: "#FAFAFA" }}>
                  <div style={{ width: 36, height: 36, background: "#F5EFE9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={18} color="#D4A373" />
                  </div>
                  <span style={{ fontSize: 11, color: "#AAAAAA" }}>Add photo</span>
                </div>
              </div>
            </div>

            {selectedPhoto && (
              <div style={{ width: 240, flexShrink: 0 }}>
                <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 0 }}>
                  <CardContent style={{ padding: 0 }}>
                    <div style={{ background: selectedPhoto.bg, aspectRatio: "3/4", borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImageIcon size={28} color="rgba(212,163,115,0.3)" />
                    </div>

                    <div style={{ padding: "16px 16px" }}>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: "#2C2C2C", marginBottom: 6 }}>{selectedPhoto.label}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Tag size={11} color="#D4A373" />
                          <span style={{ fontSize: 11, color: "#A67C52" }}>{selectedPhoto.tag}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid #F0EBE4", paddingTop: 12, marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>Your Note</div>
                        <div style={{ background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 7, padding: "9px 11px", fontSize: 12, color: "#555", lineHeight: 1.5, minHeight: 60 }}>
                          {selectedPhoto.note || <span style={{ color: "#CCCCCC", fontStyle: "italic" }}>Add a note for Fatima…</span>}
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        <button style={{ width: "100%", padding: "8px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Edit Note</button>
                        <button style={{ width: "100%", padding: "8px", background: "#FFF5F5", color: "#CC4444", border: "1px solid #FFCCCC", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <Trash2 size={12} /> Remove Photo
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div style={{ marginTop: 28, paddingBottom: 32 }}>
            <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <CardContent style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", marginBottom: 3 }}>Overall Note for Fatima</div>
                    <div style={{ fontSize: 12, color: "#888" }}>Describe your overall vision — she'll read this alongside your photos</div>
                  </div>
                  <button style={{ padding: "6px 14px", background: "#333", color: "#fff", border: "none", borderRadius: 7, fontSize: 11, cursor: "pointer" }}>Save</button>
                </div>
                <div style={{ background: "#FAF8F5", border: "1px solid #E8E0D5", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "#555", lineHeight: 1.65, minHeight: 80 }}>
                  "I love the idea of Chantilly lace sleeves and a deep V back with pearl buttons along the closure. The chapel train in photo 4 is exactly the length I'm dreaming of. Overall the feel I want is romantic, timeless — like something out of a film."
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </BridePortalLayout>
  );
}
