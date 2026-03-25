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
  Search,
  KeyRound,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  adminApi,
  ApiError,
  type User,
  type UserWithProfile,
  BRIDE_STAGE_LABELS,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/hooks/use-toast";

// ── Add / Edit Admin Modal ────────────────────────────────────────────────────

function AdminModal({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing: User | null;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!editing;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: isEdit ? "Admin updated" : "Admin created" });
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

// ── Reset Password Modal ──────────────────────────────────────────────────────

function ResetPasswordModal({
  user,
  onClose,
}: {
  user: UserWithProfile | null;
  onClose: () => void;
}) {
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNewPw("");
      setError(null);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: () => adminApi.resetUserPassword(user!.id, newPw),
    onSuccess: () => {
      toast({
        title: "Password reset",
        description: `${user?.name}'s password has been updated.`,
      });
      onClose();
    },
    onError: (err) =>
      setError(err instanceof ApiError ? err.message : "Something went wrong."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    mutation.mutate();
  }

  if (!user) return null;
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
            maxWidth: 420,
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
                Reset Password
              </h2>
              <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>
                Set a new password for <strong>{user.name}</strong>
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
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 5,
                }}
              >
                New Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Min. 6 characters"
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
                    <Loader2 size={14} className="animate-spin" /> Resetting…
                  </>
                ) : (
                  "Reset Password"
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Admin removed" });
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
            <strong>{admin.name}</strong> will lose access immediately.
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

type RoleFilter = "ALL" | "ADMIN" | "BRIDE";

export function AdminTeam() {
  const { user: me } = useAuth();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [resetting, setResetting] = useState<UserWithProfile | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ADMIN");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, debouncedSearch, roleFilter],
    queryFn: () =>
      adminApi.listUsers({
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
      }),
  });

  const users = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const total = data?.meta.total ?? 0;

  function openEdit(u: User) {
    setEditing(u);
    setAdminModalOpen(true);
  }
  function openAdd() {
    setEditing(null);
    setAdminModalOpen(true);
  }
  function closeAdminModal() {
    setAdminModalOpen(false);
    setEditing(null);
  }

  const ROLE_FILTERS: { id: RoleFilter; label: string }[] = [
    { id: "ALL", label: "All Users" },
    { id: "ADMIN", label: "Admins" },
    { id: "BRIDE", label: "Brides" },
  ];

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 10,
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
                User Management
              </h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                {total} user{total !== 1 ? "s" : ""} in total
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

          {/* Search + filters */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search
                size={14}
                color="#AAA"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 34px",
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#333",
                  background: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {ROLE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setRoleFilter(f.id)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 8,
                    border: "1px solid #E8E0D5",
                    background: roleFilter === f.id ? "#333" : "#fff",
                    color: roleFilter === f.id ? "#fff" : "#666",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: roleFilter === f.id ? 600 : 400,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <Loader2 size={22} className="animate-spin" color="#D4A373" />
            </div>
          ) : (
            <div
              style={{
                background: "#fff",
                border: "1px solid #E8E0D5",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              {users.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No users found.
                </div>
              )}
              {users.map((u, i) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const isMe = u.id === me?.id;
                const isAdmin = u.role === "ADMIN";
                const memberSince = new Date(u.createdAt).toLocaleDateString(
                  "en-AU",
                  { day: "numeric", month: "short", year: "numeric" },
                );
                const stage = u.brideProfile?.stage;

                return (
                  <div
                    key={u.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 22px",
                      borderBottom:
                        i < users.length - 1 ? "1px solid #F0EBE4" : "none",
                    }}
                  >
                    <Avatar
                      style={{
                        width: 40,
                        height: 40,
                        border: "2px solid #E8D8CE",
                        flexShrink: 0,
                      }}
                    >
                      <AvatarFallback
                        style={{
                          background: isAdmin ? "#2C2C2C" : "#E8D8CE",
                          color: isAdmin ? "#D4A373" : "#A67C52",
                          fontSize: 12,
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
                          gap: 7,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#2C2C2C",
                          }}
                        >
                          {u.name}
                        </span>
                        <Badge
                          style={{
                            fontSize: 9,
                            padding: "1px 7px",
                            background: isAdmin ? "#2C2C2C" : "#F5EFE9",
                            color: isAdmin ? "#D4A373" : "#A67C52",
                            border: "none",
                          }}
                        >
                          {isAdmin ? "Admin" : "Bride"}
                        </Badge>
                        {isMe && (
                          <Badge
                            style={{
                              fontSize: 9,
                              padding: "1px 7px",
                              background: "#F5EFE9",
                              color: "#A67C52",
                              border: "1px solid #E8D8CE",
                            }}
                          >
                            You
                          </Badge>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {u.email}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: "#AAA",
                        flexShrink: 0,
                        textAlign: "right",
                        marginRight: 12,
                      }}
                    >
                      {stage && !isAdmin && (
                        <div
                          style={{
                            fontSize: 10,
                            color: "#A67C52",
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {BRIDE_STAGE_LABELS[stage]}
                        </div>
                      )}
                      <div>Since {memberSince}</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => openEdit(u)}
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
                            <Pencil size={13} color="#666" />
                          </button>
                          <button
                            onClick={() => setDeleting(u)}
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
                            <Trash2 size={13} color="#C04030" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setResetting(u)}
                          title="Reset Password"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid #E8E0D5",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 11,
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          <KeyRound size={12} color="#A67C52" /> Reset Password
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ marginTop: 20 }}>
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={LIMIT}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </main>

      <AdminModal
        open={adminModalOpen}
        onClose={closeAdminModal}
        editing={editing}
      />
      <ResetPasswordModal user={resetting} onClose={() => setResetting(null)} />
      <ConfirmDeleteModal admin={deleting} onClose={() => setDeleting(null)} />
    </AdminLayout>
  );
}
