import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { adminApi, authApi, ApiError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Tab = "profile" | "security";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  border: "1px solid #E8E0D5",
  borderRadius: 8,
  fontSize: 14,
  color: "#333",
  background: "#FDFBF8",
  outline: "none",
  boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 6,
};

export function AdminSettings() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const { data: me, isLoading } = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => adminApi.me(),
  });

  useEffect(() => {
    if (!me) return;
    setName(me.name);
    setEmail(me.email);
  }, [me]);

  const profileMutation = useMutation({
    mutationFn: () =>
      adminApi.updateMe({ name: name.trim(), email: email.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-me"] });
      toast({
        title: "Profile updated",
        description: "Your details have been saved.",
      });
      setProfileError(null);
    },
    onError: (err) =>
      setProfileError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      ),
  });

  const pwMutation = useMutation({
    mutationFn: () => authApi.changePassword(currentPw, newPw),
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your new password is active.",
      });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwError(null);
    },
    onError: (err) =>
      setPwError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      ),
  });

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError("Name is required.");
      return;
    }
    if (!email.trim()) {
      setProfileError("Email is required.");
      return;
    }
    profileMutation.mutate();
  }

  function handlePwSave(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords don't match.");
      return;
    }
    pwMutation.mutate();
  }

  const pwStrength =
    newPw.length === 0
      ? null
      : newPw.length < 8
        ? "weak"
        : newPw.length < 12
          ? "fair"
          : "strong";
  const pwStrengthColor = {
    weak: "#D4574A",
    fair: "#D4A373",
    strong: "#5A9E6E",
  };
  const pwStrengthWidth = { weak: "33%", fair: "66%", strong: "100%" };

  const initials =
    me?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "FK";

  const tabs: { id: Tab; icon: typeof User; label: string }[] = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "security", icon: Lock, label: "Security" },
  ];

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 6px",
              }}
            >
              Settings
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Manage your admin profile and password
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 28,
              background: "#F5EFE9",
              padding: 4,
              borderRadius: 10,
            }}
          >
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "9px 12px",
                    borderRadius: 7,
                    border: "none",
                    background: tab === t.id ? "#FFFFFF" : "transparent",
                    color: tab === t.id ? "#333" : "#888",
                    fontSize: 13,
                    fontWeight: tab === t.id ? 600 : 400,
                    cursor: "pointer",
                    boxShadow:
                      tab === t.id ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>

          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <Loader2 size={22} className="animate-spin" color="#D4A373" />
            </div>
          )}

          {!isLoading && (
            <>
              {tab === "profile" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E0D5",
                    borderRadius: 14,
                    padding: "32px",
                  }}
                >
                  <form onSubmit={handleProfileSave}>
                    {/* Avatar row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        marginBottom: 28,
                        paddingBottom: 24,
                        borderBottom: "1px solid #F0EAE2",
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: "#2C2C2C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#D4A373",
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#2C2C2C",
                            marginBottom: 3,
                          }}
                        >
                          {me?.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#AAA" }}>
                          Studio Owner · Admin
                        </div>
                      </div>
                    </div>

                    {profileError && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "10px 14px",
                          background: "#FFF0EE",
                          border: "1px solid #F0C0B8",
                          borderRadius: 8,
                          marginBottom: 18,
                        }}
                      >
                        <AlertCircle size={14} color="#D4574A" />
                        <span style={{ fontSize: 13, color: "#D4574A" }}>
                          {profileError}
                        </span>
                      </div>
                    )}

                    <div style={{ marginBottom: 18 }}>
                      <label style={labelStyle}>Full name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#D4A373")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#E8E0D5")
                        }
                      />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label style={labelStyle}>Email address</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = "#D4A373")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor = "#E8E0D5")
                        }
                      />
                    </div>

                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        type="submit"
                        disabled={profileMutation.isPending}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "11px 22px",
                          background: "#2C2C2C",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: profileMutation.isPending
                            ? "not-allowed"
                            : "pointer",
                          opacity: profileMutation.isPending ? 0.8 : 1,
                        }}
                      >
                        {profileMutation.isPending ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Saving…
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {tab === "security" && (
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E0D5",
                    borderRadius: 14,
                    padding: "32px",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#2C2C2C",
                      margin: "0 0 22px",
                    }}
                  >
                    Change password
                  </h2>
                  <form onSubmit={handlePwSave}>
                    <div style={{ marginBottom: 18 }}>
                      <label style={labelStyle}>Current password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={currentPw}
                          onChange={(e) => setCurrentPw(e.target.value)}
                          placeholder="••••••••"
                          required
                          style={{ ...inputStyle, paddingRight: 44 }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#D4A373")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#E8E0D5")
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {showCurrent ? (
                            <EyeOff size={15} color="#AAA" />
                          ) : (
                            <Eye size={15} color="#AAA" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <label style={labelStyle}>New password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="Min. 6 characters"
                          required
                          style={{ ...inputStyle, paddingRight: 44 }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#D4A373")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#E8E0D5")
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {showNew ? (
                            <EyeOff size={15} color="#AAA" />
                          ) : (
                            <Eye size={15} color="#AAA" />
                          )}
                        </button>
                      </div>
                      {pwStrength && (
                        <div style={{ marginTop: 8 }}>
                          <div
                            style={{
                              height: 3,
                              background: "#F0EAE2",
                              borderRadius: 3,
                            }}
                          >
                            <div
                              style={{
                                height: 3,
                                borderRadius: 3,
                                width: pwStrengthWidth[pwStrength],
                                background: pwStrengthColor[pwStrength],
                                transition: "width 0.3s",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: pwStrengthColor[pwStrength],
                              marginTop: 4,
                              textTransform: "capitalize",
                            }}
                          >
                            {pwStrength} password
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label style={labelStyle}>Confirm new password</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          placeholder="••••••••"
                          required
                          style={{ ...inputStyle, paddingRight: 44 }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "#D4A373")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#E8E0D5")
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {showConfirm ? (
                            <EyeOff size={15} color="#AAA" />
                          ) : (
                            <Eye size={15} color="#AAA" />
                          )}
                        </button>
                      </div>
                    </div>

                    {pwError && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "10px 14px",
                          background: "#FFF0EE",
                          border: "1px solid #F0C0B8",
                          borderRadius: 8,
                          marginBottom: 16,
                        }}
                      >
                        <AlertCircle size={14} color="#D4574A" />
                        <span style={{ fontSize: 13, color: "#D4574A" }}>
                          {pwError}
                        </span>
                      </div>
                    )}

                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        type="submit"
                        disabled={pwMutation.isPending}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "11px 22px",
                          background: "#2C2C2C",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: pwMutation.isPending
                            ? "not-allowed"
                            : "pointer",
                          opacity: pwMutation.isPending ? 0.8 : 1,
                        }}
                      >
                        {pwMutation.isPending ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Updating…
                          </>
                        ) : (
                          "Update password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
