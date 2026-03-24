import { useState } from "react";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { CheckCircle2, ChevronRight } from "lucide-react";

const styleOptions = [
  "Classic & Timeless", "Romantic & Feminine", "Modern & Minimalist",
  "Boho & Relaxed", "Dramatic & Ballgown", "Sleek & Sculptural",
  "Vintage & Lace-heavy", "Garden Party",
];

const silhouetteOptions = [
  "A-Line", "Ballgown", "Mermaid / Fit & Flare", "Sheath / Column",
  "Tea Length", "Midi", "Mini",
];

const fabricOptions = [
  "Silk Satin", "Chantilly Lace", "Mikado", "Tulle", "Organza",
  "Crepe", "Duchess Satin", "Charmeuse",
];

const necklineOptions = [
  "Sweetheart", "V-Neck", "Off-Shoulder", "Square Neck",
  "High Neck / Mandarin", "Bateau / Boat", "Halter",
];

type Step = 1 | 2 | 3;

export function BrideProfileSetup() {
  const [step, setStep] = useState<Step>(1);
  const [saved, setSaved] = useState(false);

  const [weddingDate, setWeddingDate] = useState("2026-05-04");
  const [partnerName, setPartnerName] = useState("");
  const [venueName, setVenueName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");

  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Romantic & Feminine"]);
  const [selectedSilhouettes, setSelectedSilhouettes] = useState<string[]>(["Mermaid / Fit & Flare"]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(["Chantilly Lace"]);
  const [selectedNecklines, setSelectedNecklines] = useState<string[]>(["Sweetheart"]);
  const [styleNotes, setStyleNotes] = useState("");

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 13px", border: "1px solid #E8E0D5", borderRadius: 8,
    fontSize: 14, color: "#333", background: "#FDFBF8", outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, color: "#555",
    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6,
  };

  const steps: { num: Step; label: string }[] = [
    { num: 1, label: "Wedding Details" },
    { num: 2, label: "Style Preferences" },
    { num: 3, label: "Contact Info" },
  ];

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>Profile Setup</h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Help Fatima get to know you and your vision</p>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 0, marginBottom: 32, background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, overflow: "hidden" }}>
            {steps.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                style={{ flex: 1, padding: "13px 16px", background: step === s.num ? "#F0E4D8" : "transparent", border: "none", borderRight: i < 2 ? "1px solid #E8E0D5" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.15s" }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: step === s.num ? "#D4A373" : step > s.num ? "#5A9E6E" : "#E8E0D5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {step > s.num ? <CheckCircle2 size={14} color="#fff" /> : <span style={{ fontSize: 11, fontWeight: 700, color: step === s.num ? "#fff" : "#888" }}>{s.num}</span>}
                </div>
                <span style={{ fontSize: 12, fontWeight: step === s.num ? 600 : 400, color: step === s.num ? "#7A5C3A" : "#888" }}>{s.label}</span>
              </button>
            ))}
          </div>

          {/* ── Step 1: Wedding Details ── */}
          {step === 1 && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 14, padding: "32px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", margin: "0 0 24px" }}>Tell us about your wedding</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                <div>
                  <label style={labelStyle}>Wedding date</label>
                  <input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                </div>
                <div>
                  <label style={labelStyle}>Partner's name</label>
                  <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="e.g. James" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Venue name</label>
                <input type="text" value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="e.g. Pasadena Estate, Blackheath" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Approximate guest count</label>
                <select value={guestCount} onChange={e => setGuestCount(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select…</option>
                  <option>Under 30 (Micro wedding)</option>
                  <option>30 – 80</option>
                  <option>80 – 150</option>
                  <option>150 – 250</option>
                  <option>250+</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Dietary or accessibility notes</label>
                <textarea value={dietaryNotes} onChange={e => setDietaryNotes(e.target.value)} placeholder="Any notes for in-studio fittings…" rows={3} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
                <button onClick={() => setStep(2)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", background: "#2C2C2C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Next: Style Preferences <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Style Preferences ── */}
          {step === 2 && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 14, padding: "32px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", margin: "0 0 24px" }}>Your style vision</h2>

              <StyleSection label="Overall aesthetic" subtitle="Choose all that resonate" items={styleOptions} selected={selectedStyles} onToggle={item => toggleItem(selectedStyles, setSelectedStyles, item)} />
              <StyleSection label="Silhouette" subtitle="Select your preferred shape" items={silhouetteOptions} selected={selectedSilhouettes} onToggle={item => toggleItem(selectedSilhouettes, setSelectedSilhouettes, item)} />
              <StyleSection label="Fabrics" subtitle="Textures you're drawn to" items={fabricOptions} selected={selectedFabrics} onToggle={item => toggleItem(selectedFabrics, setSelectedFabrics, item)} />
              <StyleSection label="Neckline" subtitle="Select one or more" items={necklineOptions} selected={selectedNecklines} onToggle={item => toggleItem(selectedNecklines, setSelectedNecklines, item)} />

              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Any other notes or inspirations?</label>
                <textarea value={styleNotes} onChange={e => setStyleNotes(e.target.value)} placeholder="Describe your dream gown, share Pinterest links, note any must-haves or deal-breakers…" rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
                <button onClick={() => setStep(1)} style={{ padding: "11px 18px", background: "transparent", color: "#888", border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", background: "#2C2C2C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Next: Contact Info <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Contact Info ── */}
          {step === 3 && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 14, padding: "32px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", margin: "0 0 24px" }}>Contact details</h2>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Mobile number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 4XX XXX XXX" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Home / mailing address</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, Suburb, State, Postcode" rows={2} style={{ ...inputStyle, resize: "none" }} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
              </div>

              {/* Summary card */}
              <div style={{ background: "#FAF8F5", border: "1px solid #E8D8CE", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#A67C52", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Profile summary</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 2 }}>
                  <div>Wedding date: <strong>{weddingDate || "Not set"}</strong></div>
                  {partnerName && <div>Partner: <strong>{partnerName}</strong></div>}
                  {venueName && <div>Venue: <strong>{venueName}</strong></div>}
                  <div>Style: <strong>{selectedStyles.slice(0, 2).join(", ") || "Not set"}{selectedStyles.length > 2 ? ` +${selectedStyles.length - 2}` : ""}</strong></div>
                  <div>Silhouette: <strong>{selectedSilhouettes.join(", ") || "Not set"}</strong></div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => setStep(2)} style={{ padding: "11px 18px", background: "transparent", color: "#888", border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>← Back</button>
                <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", background: saved ? "#5A9E6E" : "#D4A373", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.3s" }}>
                  {saved ? <><CheckCircle2 size={15} /> Saved!</> : "Save profile"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </BridePortalLayout>
  );
}

function StyleSection({ label, subtitle, items, selected, onToggle }: { label: string; subtitle: string; items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#AAA" }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map(item => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? "#D4A373" : "#E8E0D5"}`, background: active ? "#F0E4D8" : "transparent", color: active ? "#7A5C3A" : "#666", fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
