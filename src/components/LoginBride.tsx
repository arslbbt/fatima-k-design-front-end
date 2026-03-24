import { useState } from "react";
import { Link } from "wouter";
import { Eye, EyeOff, Heart, ArrowRight } from "lucide-react";

export function LoginBride() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="/fatimak-portal/fatimak-logo.jpg" alt="Fatima K" style={{ height: 28, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }} />
        <Link href="/admin/login">
          <span style={{ fontSize: 12, color: "#AAA", cursor: "pointer" }}>Studio access →</span>
        </Link>
      </div>

      {/* Main centered card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Decorative header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "#F0E4D8", borderRadius: "50%", marginBottom: 20 }}>
              <Heart size={22} fill="#D4A373" color="#D4A373" />
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 500, color: "#2C2C2C", margin: "0 0 10px" }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: "#888", margin: 0, lineHeight: 1.6 }}>Sign in to your bridal portal to view your<br />appointments, dress journey, and more.</p>
          </div>

          {/* Card */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sophie@example.com"
                  required
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #E8E0D5", borderRadius: 9, fontSize: 14, color: "#333", background: "#FDFBF8", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#D4A373"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ width: "100%", padding: "12px 44px 12px 14px", border: "1px solid #E8E0D5", borderRadius: 9, fontSize: 14, color: "#333", background: "#FDFBF8", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#D4A373"}
                    onBlur={e => e.currentTarget.style.borderColor = "#E8E0D5"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    {showPassword ? <EyeOff size={16} color="#AAA" /> : <Eye size={16} color="#AAA" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginBottom: 26 }}>
                <Link href="/forgot-password">
                  <span style={{ fontSize: 12, color: "#A67C52", cursor: "pointer" }}>Forgot password?</span>
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "13px", background: loading ? "#C4A88C" : "#2C2C2C", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
              >
                {loading ? "Signing in…" : (<>Sign in to my portal <ArrowRight size={16} /></>)}
              </button>

            </form>

            {/* Demo shortcut */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #F0EAE2", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#AAA", margin: "0 0 10px" }}>Demo — skip login and explore</p>
              <Link href="/bride">
                <span style={{ fontSize: 13, color: "#A67C52", fontWeight: 500, cursor: "pointer" }}>→ Enter bride portal</span>
              </Link>
            </div>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#BBBBBB", marginTop: 24 }}>
            Need help? Contact us at{" "}
            <a href="mailto:studio@fatimak.com.au" style={{ color: "#A67C52", textDecoration: "none" }}>studio@fatimak.com.au</a>
          </p>

        </div>
      </div>

      {/* Bottom brand strip */}
      <div style={{ padding: "16px 32px", textAlign: "center", borderTop: "1px solid #F0EAE2" }}>
        <span style={{ fontSize: 11, color: "#CCCCCC" }}>Fatima K Design · Luxury Bridal Couture · Paddington, Sydney</span>
      </div>

    </div>
  );
}
