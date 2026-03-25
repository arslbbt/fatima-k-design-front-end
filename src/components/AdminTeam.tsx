import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminApi, ApiError, type User } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

// ── Add / Edit Modal ──────────────────────────────────────────────────────────

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  editing: User | null;
}

function AdminModal({ open, onClose, editing }: AdminModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editing;

  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setEmail(editing?.email ?? "");
      setPassword("");
      setError(null);
    }
  }, [open, editing]);

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? adminApi.updateAdmin(editing!.id, {
            ...(name.trim() && { name: name.trim() }),
            ...(email.trim() && { email: email.trim() }),
            ...(password && { password }),
          })
        : adminApi.createAdmin({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({
        title: isEdit ? "Admin updated" : "Admin created",
        description: isEdit
          ? `${name} has been updated.`
          : `${name} can now log in.`,
      });
      onClose();
    },
    onError: (err) =>
      setError(err instanceof ApiError ? err.message : "Something went wrong."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isEdit && !password) {
      setError("Password is required.");
      return;
    }
    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    mutation.mutate();
  }

  if (!open) return null;

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #E8E0D5",
    borderRadius: 8,
    fontSize: 13,
    color: "#333",
    background: "#FDFBF8",
    outline: "none",
    boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 5,
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 100,
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 101,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            width: "100%",
            maxWidth: 460,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid #F0EAE2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 4px",
                }}
              >
                {isEdit ? "Edit Admin" : "Add New Admin"}
              </h2>
              <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>
                {isEdit
                  ? "Update name, email or password."
                  : "They'll be able to log in immediately."}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#AAA",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "#FFF0EE",
                  border: "1px solid #F0C0B8",
                  borderRadius: 8,
                }}
              >
                <AlertCircle size={14} color="#D4574A" />
                <span style={{ fontSize: 13, color: "#D4574A" }}>{error}</span>
              </div>
            )}

            <div>
              <label style={lbl}>Full Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatima K"
                style={inp}
              />
            </div>

            <div>
              <label style={lbl}>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={inp}
              />
            </div>

            <div>
              <label style={lbl}>
                {isEdit ? "New Password (leave blank to keep)" : "Password *"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isEdit ? "Leave blank to keep current" : "Min. 6 characters"
                  }
                  style={{ ...inp, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPw ? (
                    <EyeOff size={15} color="#AAA" />
                  ) : (
                    <Eye size={15} color="#AAA" />
                  )}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "11px",
                  border: "1px solid #E8E0D5",
                  borderRadius: 9,
                  fontSize: 13,
                  color: "#666",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                style={{
                  flex: 2,
                  padding: "11px",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  background: mutation.isPending ? "#C4A88C" : "#2C2C2C",
                  cursor: mutation.isPending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Admin"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────

function ConfirmDeleteModal({
  admin,
  onClose,
}: {
  admin: User | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => adminApi.removeAdmin(admin!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({
        title: "Admin removed",
        description: `${admin?.name} has been removed.`,
      });
      onClose();
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  if (!admin) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 100,
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 101,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            padding: "32px 28px",
            fontFamily: "'DM Sans', sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#FFF0EE",
              border: "2px solid #F0C0B8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 20,
            }}
          >
            🗑
          </div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 500,
              color: "#2C2C2C",
              margin: "0 0 8px",
            }}
          >
            Remove Admin?
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "#888",
              margin: "0 0 24px",
              lineHeight: 1.5,
            }}
          >
            <strong>{admin.name}</strong> will lose access immediately. This
            cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                border: "1px solid #E8E0D5",
                borderRadius: 9,
                fontSize: 13,
                color: "#666",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              style={{
                flex: 2,
                padding: "11px",
                border: "none",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: mutation.isPending ? "#E8A090" : "#C04030",
                cursor: mutation.isPending ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Removing…
                </>
              ) : (
                "Yes, Remove"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function AdminTeam() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: () => adminApi.listAdmins(),
  });

  function openEdit(admin: User) {
    setEditing(admin);
    setModalOpen(true);
  }
  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 28,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 4px",
                }}
              >
                Admin Team
              </h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                Manage who has admin access to the studio portal
              </p>
            </div>
            <button
              onClick={openAdd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> Add Admin
            </button>
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
            <div
              style={{
                background: "#fff",
                border: "1px solid #E8E0D5",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              {admins.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No admins found.
                </div>
              )}
              {admins.map((admin, i) => {
                const initials = admin.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const isMe = admin.id === user?.id;
                const memberSince = new Date(
                  admin.createdAt,
                ).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={admin.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 24px",
                      borderBottom:
                        i < admins.length - 1 ? "1px solid #F0EBE4" : "none",
                    }}
                  >
                    <Avatar
                      style={{
                        width: 42,
                        height: 42,
                        border: "2px solid #E8D8CE",
                        flexShrink: 0,
                      }}
                    >
                      <AvatarFallback
                        style={{
                          background: "#2C2C2C",
                          color: "#D4A373",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#2C2C2C",
                          }}
                        >
                          {admin.name}
                        </span>
                        {isMe && (
                          <span
                            style={{
                              fontSize: 10,
                              padding: "2px 8px",
                              borderRadius: 20,
                              background: "#F5EFE9",
                              color: "#A67C52",
                              border: "1px solid #E8D8CE",
                              fontWeight: 600,
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {admin.email}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: "#AAA",
                        flexShrink: 0,
                        textAlign: "right",
                        marginRight: 16,
                      }}
                    >
                      <div>Studio Owner</div>
                      <div>Since {memberSince}</div>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => openEdit(admin)}
                        title="Edit"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid #E8E0D5",
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Pencil size={14} color="#666" />
                      </button>
                      <button
                        onClick={() => setDeleting(admin)}
                        title="Remove"
                        disabled={isMe}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid #E8E0D5",
                          background: "#fff",
                          cursor: isMe ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: isMe ? 0.35 : 1,
                        }}
                      >
                        <Trash2 size={14} color="#C04030" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AdminModal open={modalOpen} onClose={closeModal} editing={editing} />
      <ConfirmDeleteModal admin={deleting} onClose={() => setDeleting(null)} />
    </AdminLayout>
  );
}
