import { useEffect } from "react";
import { X, Mail, Phone, Calendar, Heart, StickyNote, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  type BrideWithProfile,
  BRIDE_STAGE_LABELS,
  BRIDE_STAGE_ORDER,
} from "@/lib/api";

interface BrideProfileModalProps {
  bride: BrideWithProfile | null;
  onClose: () => void;
}

export function BrideProfileModal({ bride, onClose }: BrideProfileModalProps) {
  useEffect(() => {
    if (!bride) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [bride, onClose]);

  if (!bride) return null;

  const profile = bride.brideProfile;
  const currentStage = profile?.stage ?? "CONSULTATION";
  const stageIndex = BRIDE_STAGE_ORDER.indexOf(currentStage);
  const progressPct = Math.round(((stageIndex + 1) / BRIDE_STAGE_ORDER.length) * 100);

  const initials = bride.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const weddingDate = profile?.weddingDate
    ? new Date(profile.weddingDate).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  const memberSince = new Date(bride.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

  // Days until wedding
  const daysUntil = profile?.weddingDate
    ? Math.ceil((new Date(profile.weddingDate).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, backdropFilter: "blur(2px)" }}
      />

      {/* Modal */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 101, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 540, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", fontFamily: "'DM Sans', sans-serif", maxHeight: "calc(100vh - 32px)", display: "flex", flexDirection: "column" }}>

          {/* Header band */}
          <div style={{ background: "linear-gradient(135deg, #2C2C2C 0%, #4A3728 100%)", borderRadius: "16px 16px 0 0", padding: "28px 28px 24px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={onClose} style={{ padding: 6, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex" }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar style={{ width: 64, height: 64, border: "3px solid rgba(212,163,115,0.6)", flexShrink: 0 }}>
                <AvatarFallback style={{ background: "#E8D8CE", color: "#A67C52", fontSize: 20, fontWeight: 700 }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: "#fff", margin: "0 0 4px" }}>
                  {bride.name}
                </h2>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Member since {memberSince}</div>
              </div>
            </div>

            {/* Wedding countdown */}
            {weddingDate && daysUntil !== null && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(212,163,115,0.15)", borderRadius: 10, border: "1px solid rgba(212,163,115,0.25)", display: "flex", alignItems: "center", gap: 10 }}>
                <Heart size={14} fill="#D4A373" color="#D4A373" />
                <div>
                  <div style={{ fontSize: 12, color: "#D4A373", fontWeight: 600 }}>
                    {daysUntil > 0 ? `${daysUntil} days to go` : daysUntil === 0 ? "Today!" : "Wedding passed"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{weddingDate}</div>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Stage progress */}
            <Section title="Journey Stage">
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{BRIDE_STAGE_LABELS[currentStage]}</span>
                  <span style={{ fontSize: 11, color: "#AAA" }}>{stageIndex + 1} of {BRIDE_STAGE_ORDER.length}</span>
                </div>
                <div style={{ height: 6, background: "#F0EAE2", borderRadius: 6 }}>
                  <div style={{ height: 6, borderRadius: 6, background: "linear-gradient(90deg, #D4A373, #A67C52)", width: `${progressPct}%`, transition: "width 0.4s" }} />
                </div>
              </div>
              {/* Stage steps */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
                {BRIDE_STAGE_ORDER.map((s, i) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 10, padding: "3px 9px", borderRadius: 20,
                      background: i < stageIndex ? "#F5EFE9" : i === stageIndex ? "#E8D8CE" : "#F8F8F8",
                      color: i < stageIndex ? "#A67C52" : i === stageIndex ? "#7A5C3A" : "#CCC",
                      border: `1px solid ${i === stageIndex ? "#D4A373" : "transparent"}`,
                      fontWeight: i === stageIndex ? 600 : 400,
                    }}
                  >
                    {i < stageIndex ? "✓ " : ""}{BRIDE_STAGE_LABELS[s]}
                  </span>
                ))}
              </div>
            </Section>

            {/* Contact info */}
            <Section title="Contact Details">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <InfoRow icon={<Mail size={14} color="#A67C52" />} label="Email" value={bride.email} />
                <InfoRow icon={<Phone size={14} color="#A67C52" />} label="Phone" value={profile?.phone ?? null} />
                <InfoRow icon={<Calendar size={14} color="#A67C52" />} label="Wedding Date" value={weddingDate} />
              </div>
            </Section>

            {/* Style preferences */}
            {profile?.stylePreferences && (
              <Section title="Style Preferences">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Sparkles size={14} color="#A67C52" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.6 }}>
                    {profile.stylePreferences}
                  </p>
                </div>
              </Section>
            )}

            {/* Notes */}
            {profile?.notes && (
              <Section title="Notes">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <StickyNote size={14} color="#A67C52" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.6 }}>
                    {profile.notes}
                  </p>
                </div>
              </Section>
            )}

            {/* No profile data fallback */}
            {!profile?.stylePreferences && !profile?.notes && (
              <div style={{ textAlign: "center", padding: "12px 0", color: "#CCC", fontSize: 13 }}>
                No additional notes or preferences on file.
              </div>
            )}

          </div>

          {/* Footer */}
          <div style={{ padding: "16px 28px", borderTop: "1px solid #F0EAE2", flexShrink: 0 }}>
            <button
              onClick={onClose}
              style={{ width: "100%", padding: "11px", border: "1px solid #E8E0D5", borderRadius: 9, fontSize: 13, color: "#666", background: "#fff", cursor: "pointer" }}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 28, height: 28, background: "#F5EFE9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontSize: 13, color: value ? "#333" : "#CCC", marginTop: 1 }}>
          {value ?? "Not provided"}
        </div>
      </div>
    </div>
  );
}
