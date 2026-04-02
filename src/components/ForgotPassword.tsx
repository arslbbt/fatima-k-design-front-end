import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F5",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div style={{ padding: "20px 32px" }}>
        <img
          src="/fatimak-logo.jpg"
          alt="Fatima K"
          style={{ objectFit: "contain" }}
          className="logo-responsive"
        />
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {!sent ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    background: "#F0E4D8",
                    borderRadius: "50%",
                    marginBottom: 20,
                  }}
                >
                  <Mail size={22} color="#A67C52" />
                </div>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 500,
                    color: "#2C2C2C",
                    margin: "0 0 10px",
                  }}
                >
                  Reset your password
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: "#888",
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  Enter your email address and we'll send you a secure link to
                  reset your password.
                </p>
              </div>

              {/* Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E0D5",
                  borderRadius: 16,
                  padding: "32px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 22 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#555",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 7,
                      }}
                    >
                      Your email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sophie@example.com"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        border: "1px solid #E8E0D5",
                        borderRadius: 9,
                        fontSize: 14,
                        color: "#333",
                        background: "#FDFBF8",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#D4A373")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#E8E0D5")
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: loading ? "#C4A88C" : "#2C2C2C",
                      color: "#fff",
                      border: "none",
                      borderRadius: 9,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Sending link…" : "Send reset link"}
                  </button>
                </form>
              </div>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Link href="/login">
                  <span
                    style={{
                      fontSize: 13,
                      color: "#888",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <ArrowLeft size={13} /> Back to login
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success state */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 72,
                    height: 72,
                    background: "#EDF7ED",
                    borderRadius: "50%",
                    marginBottom: 24,
                  }}
                >
                  <CheckCircle2 size={32} color="#5A9E6E" />
                </div>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 32,
                    fontWeight: 500,
                    color: "#2C2C2C",
                    margin: "0 0 12px",
                  }}
                >
                  Check your inbox
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: "#888",
                    lineHeight: 1.65,
                    marginBottom: 8,
                  }}
                >
                  We've sent a password reset link to
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#A67C52",
                    marginBottom: 28,
                  }}
                >
                  {email}
                </p>
                <p style={{ fontSize: 13, color: "#AAA", marginBottom: 36 }}>
                  The link will expire in 24 hours. Check your spam folder if
                  you don't see it within a few minutes.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    maxWidth: 280,
                    margin: "0 auto",
                  }}
                >
                  <button
                    onClick={() => setSent(false)}
                    style={{
                      padding: "12px",
                      background: "#2C2C2C",
                      color: "#fff",
                      border: "none",
                      borderRadius: 9,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Resend email
                  </button>
                  <Link href="/login">
                    <button
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "transparent",
                        color: "#888",
                        border: "1px solid #E8E0D5",
                        borderRadius: 9,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Back to login
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          padding: "16px 32px",
          textAlign: "center",
          borderTop: "1px solid #F0EAE2",
        }}
      >
        <span style={{ fontSize: 11, color: "#CCCCCC" }}>
          Fatima K Design · Luxury Bridal Couture
        </span>
      </div>
    </div>
  );
}
