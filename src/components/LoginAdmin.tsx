import { useState } from "react";
import { Link } from "wouter";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

export function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 9, fontSize: 14, color: "#F5F5F5", background: "rgba(255,255,255,0.06)",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1E1E1E", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <img src="/fatimak-portal/fatimak-logo.jpg" alt="Fatima K" style={{ height: 26, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
        <Link href="/login">
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>← Bride portal</span>
        </Link>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "rgba(212,163,115,0.15)", border: "1px solid rgba(212,163,115,0.3)", borderRadius: "50%", marginBottom: 20 }}>
              <ShieldCheck size={22} color="#D4A373" />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 500, color: "#F5F5F5", margin: "0 0 10px" }}>Studio Access</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>Sign in to your admin panel to manage<br />brides, appointments and documents.</p>
          </div>

          {/* Card */}
          <div style={{ background: "#2C2C2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "36px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="fatima@fatimak.com.au"
                  required
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(212,163,115,0.6)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(212,163,115,0.6)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    {showPassword ? <EyeOff size={16} color="rgba(255,255,255,0.3)" /> : <Eye size={16} color="rgba(255,255,255,0.3)" />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div style={{ textAlign: "right", marginBottom: 26 }}>
                <Link href="/forgot-password">
                  <span style={{ fontSize: 12, color: "#D4A373", cursor: "pointer" }}>Forgot password?</span>
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "13px", background: loading ? "#7A6050" : "#D4A373", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
              >
                {loading ? "Signing in…" : (<>Access studio panel <ArrowRight size={16} /></>)}
              </button>

            </form>

            {/* Demo shortcut */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: "0 0 10px" }}>Demo — skip login and explore</p>
              <Link href="/admin">
                <span style={{ fontSize: 13, color: "#D4A373", fontWeight: 500, cursor: "pointer" }}>→ Enter admin panel</span>
              </Link>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.15)", marginTop: 24 }}>
            This is a private area. Authorised studio staff only.
          </p>

        </div>
      </div>

      <div style={{ padding: "16px 32px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.12)" }}>Fatima K Design · Studio Management</span>
      </div>

    </div>
  );
}
