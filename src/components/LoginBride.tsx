import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export function LoginBride() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const [, navigate] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "ADMIN" ? "/admin" : "/bride");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401 ? "Invalid email or password." : err.message,
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
      <div
        style={{
          padding: "20px 32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/fatimak-portal/fatimak-logo.jpg"
          alt="Fatima K"
          style={{
            height: 28,
            objectFit: "contain",
            mixBlendMode: "multiply",
            filter: "brightness(0.15)",
          }}
        />
      </div>

      {/* Main centered card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 34,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 10px",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#888",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Sign in to access your portal.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E0D5",
              borderRadius: 16,
              padding: "36px 32px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Error */}
              {error && (
                <div
                  style={{
                    marginBottom: 18,
                    padding: "10px 14px",
                    background: "#FFF0F0",
                    border: "1px solid #F5C6C6",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#C0392B",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
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
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D4A373")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E8E0D5")
                  }
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 26 }}>
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
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 44px 12px 14px",
                      border: "1px solid #E8E0D5",
                      borderRadius: 9,
                      fontSize: 14,
                      color: "#333",
                      background: "#FDFBF8",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#D4A373")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E8E0D5")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={16} color="#AAA" />
                    ) : (
                      <Eye size={16} color="#AAA" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.2s",
                }}
              >
                {loading ? (
                  "Signing in…"
                ) : (
                  <>
                    Sign in <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#BBBBBB",
              marginTop: 24,
            }}
          >
            Need help? Contact us at{" "}
            <a
              href="mailto:studio@fatimak.com.au"
              style={{ color: "#A67C52", textDecoration: "none" }}
            >
              studio@fatimak.com.au
            </a>
          </p>
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
