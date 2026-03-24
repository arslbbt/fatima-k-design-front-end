import { useState } from "react";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { CheckCircle2, Eye, EyeOff, Bell, Lock, User, AlertCircle } from "lucide-react";

type Tab = "profile" | "security" | "notifications";

export function BrideAccountManagement() {
  const [tab, setTab] = useState<Tab>("profile");

  const [firstName, setFirstName] = useState("Sophie");
  const [lastName, setLastName] = useState("Anderson");
  const [email, setEmail] = useState("sophie.anderson@example.com");
  const [phone, setPhone] = useState("+61 412 345 678");
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const [notifAppt, setNotifAppt] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifDocs, setNotifDocs] = useState(false);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 13px", border: "1px solid #E8E0D5", borderRadius: 8,
    fontSize: 14, color: "#333", background: "#FDFBF8", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, color: "#555",
    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6,
  };

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2800);
  }

  function handlePwSave(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match."); return; }
    setPwSaved(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 2800);
  }

  function handleNotifSave() {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2800);
  }

  const pwStrength = newPw.length === 0 ? null : newPw.length < 8 ? "weak" : newPw.length < 12 ? "fair" : "strong";
  const pwStrengthColor = { weak: "#D4574A", fair: "#D4A373", strong: "#5A9E6E" };
  const pwStrengthWidth = { weak: "33%", fair: "66%", strong: "100%" };

  const tabs: { id: Tab; icon: typeof User; label: string }[] = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "security", icon: Lock, label: "Security" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>My Account</h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Manage your profile, password, and notification preferences</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#F5EFE9", padding: 4, borderRadius: 10 }}>
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 12px", borderRadius: 7, border: "none", background: tab === t.id ? "#FFFFFF" : "transparent", color: tab === t.id ? "#333" : "#888", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, cursor: "pointer", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.07)" : "none", transition: "all 0.15s" }}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* ── Profile Tab ── */}
          {tab === "profile" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 14, padding: "32px" }}>
              <form onSubmit={handleProfileSave}>

                {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #F0EAE2" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E8D8CE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#A67C52", flexShrink: 0, border: "2px solid #D4A373" }}>SA</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#2C2C2C", marginBottom: 4 }}>Sophie Anderson</div>
                    <div style={{ fontSize: 12, color: "#AAA", marginBottom: 10 }}>Couture bride · Wedding 4 May 2026</div>
                    <button type="button" style={{ fontSize: 12, color: "#A67C52", background: "none", border: "1px solid #E8D8CE", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Change photo</button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={labelStyle}>First name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Email address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>Mobile number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", background: profileSaved ? "#5A9E6E" : "#2C2C2C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.3s" }}>
                    {profileSaved ? <><CheckCircle2 size={15} /> Saved</> : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Security Tab ── */}
          {tab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Change password */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 14, padding: "32px" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", margin: "0 0 22px" }}>Change password</h2>
                <form onSubmit={handlePwSave}>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>Current password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showCurrent ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                        {showCurrent ? <EyeOff size={15} color="#AAA" /> : <Eye size={15} color="#AAA" />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label style={labelStyle}>New password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" required style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                      <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                        {showNew ? <EyeOff size={15} color="#AAA" /> : <Eye size={15} color="#AAA" />}
                      </button>
                    </div>
                    {pwStrength && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 3, background: "#F0EAE2", borderRadius: 3 }}>
                          <div style={{ height: 3, borderRadius: 3, width: pwStrengthWidth[pwStrength], background: pwStrengthColor[pwStrength], transition: "width 0.3s, background 0.3s" }} />
                        </div>
                        <div style={{ fontSize: 11, color: pwStrengthColor[pwStrength], marginTop: 4, textTransform: "capitalize" }}>{pwStrength} password</div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Confirm new password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showConfirm ? "text" : "password"} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.currentTarget.style.borderColor = "#D4A373"} onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                        {showConfirm ? <EyeOff size={15} color="#AAA" /> : <Eye size={15} color="#AAA" />}
                      </button>
                    </div>
                  </div>

                  {pwError && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "#FFF0EE", border: "1px solid #F0C0B8", borderRadius: 8, marginBottom: 16 }}>
                      <AlertCircle size={14} color="#D4574A" />
                      <span style={{ fontSize: 13, color: "#D4574A" }}>{pwError}</span>
                    </div>
                  )}

                  {pwSaved && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "#EDF7ED", border: "1px solid #B8D4B0", borderRadius: 8, marginBottom: 16 }}>
                      <CheckCircle2 size={14} color="#5A9E6E" />
                      <span style={{ fontSize: 13, color: "#5A9E6E" }}>Password updated successfully.</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" style={{ padding: "11px 22px", background: "#2C2C2C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Update password
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger zone */}
              <div style={{ background: "#FFFFFF", border: "1px solid #F0C0B8", borderRadius: 14, padding: "24px 32px" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#C04030", margin: "0 0 8px" }}>Danger zone</h2>
                <p style={{ fontSize: 13, color: "#888", margin: "0 0 18px", lineHeight: 1.6 }}>Once you delete your account, all your data is permanently removed. This action cannot be undone. Please contact the studio before proceeding.</p>
                <button style={{ padding: "9px 18px", background: "transparent", color: "#C04030", border: "1px solid #F0C0B8", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                  Request account deletion
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {tab === "notifications" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 14, padding: "32px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", margin: "0 0 22px" }}>Email notifications</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Appointment reminders", description: "48 hr and 2 hr reminder before each fitting", value: notifAppt, set: setNotifAppt },
                  { label: "Payment updates", description: "Receipts, upcoming due dates and balance changes", value: notifPayment, set: setNotifPayment },
                  { label: "New documents", description: "When Fatima uploads a contract or alteration sheet", value: notifDocs, set: setNotifDocs },
                  { label: "Studio news & offers", description: "Occasional updates from the Fatima K studio", value: notifMarketing, set: setNotifMarketing },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: i < arr.length - 1 ? "1px solid #F5F0EB" : "none" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2C", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#AAA" }}>{item.description}</div>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
                      style={{ width: 44, height: 24, borderRadius: 12, background: item.value ? "#D4A373" : "#E0E0E0", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s" }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: item.value ? 22 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>
                ))}
              </div>

              {notifSaved && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "#EDF7ED", border: "1px solid #B8D4B0", borderRadius: 8, margin: "16px 0" }}>
                  <CheckCircle2 size={14} color="#5A9E6E" />
                  <span style={{ fontSize: 13, color: "#5A9E6E" }}>Preferences saved.</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button onClick={handleNotifSave} style={{ padding: "11px 22px", background: "#2C2C2C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Save preferences
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </BridePortalLayout>
  );
}
