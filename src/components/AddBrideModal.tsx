import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { adminApi, ApiError, type RegisterBridePayload } from "@/lib/api";
import { invalidateQueries } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";

interface AddBrideModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  weddingDate: string;
  phone: string;
  partnerName: string;
  venueName: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  weddingDate?: string;
  phone?: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  password: "",
  weddingDate: "",
  phone: "",
  partnerName: "",
  venueName: "",
  notes: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!form.name.trim()) {
    errors.name = "Full name is required";
  } else if (form.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }

  // Password validation
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Wedding date validation
  if (!form.weddingDate) {
    errors.weddingDate = "Wedding date is required";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.weddingDate) < today) {
      errors.weddingDate = "Wedding date must be today or in the future";
    }
  }

  // Phone validation (mandatory)
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    // Remove all non-digit characters for validation
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    } else if (digitsOnly.length > 12) {
      errors.phone = "Phone number cannot exceed 12 digits";
    }
  }

  return errors;
}

export function AddBrideModal({ open, onClose }: AddBrideModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setErrors({});
      setApiError(null);
      setShowPassword(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const mutation = useMutation({
    mutationFn: (payload: RegisterBridePayload) =>
      adminApi.registerBride(payload),
    onSuccess: () => {
      invalidateQueries.afterBrideCreate(queryClient);
      toast({
        title: "Bride added successfully",
        description: `${form.name} can now log in to their portal.`,
      });
      onClose();
    },
    onError: (err) => {
      setApiError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    },
  });

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
    setApiError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: RegisterBridePayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      weddingDate: form.weddingDate,
      phone: form.phone.trim(),
      ...(form.partnerName.trim() && { partnerName: form.partnerName.trim() }),
      ...(form.venueName.trim() && { venueName: form.venueName.trim() }),
      ...(form.notes.trim() && { notes: form.notes.trim() }),
    };
    mutation.mutate(payload);
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
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

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 101,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          overflowY: "auto",
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
            maxWidth: 520,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            fontFamily: "'DM Sans', sans-serif",
            maxHeight: "calc(100vh - 32px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid #F0EAE2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexShrink: 0,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 26,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 4px",
                }}
              >
                Add New Bride
              </h2>
              <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>
                She'll receive login credentials to access her portal.
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
                flexShrink: 0,
                marginLeft: 12,
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              overflowY: "auto",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* API error */}
            {apiError && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#FFF0F0",
                  border: "1px solid #F5C6C6",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#C0392B",
                }}
              >
                {apiError}
              </div>
            )}

            {/* Row: Name + Email */}
            <div className="bride-modal-row">
              <Field label="Full Name *" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Sarah Johnson"
                  style={inputStyle(!!errors.name)}
                />
              </Field>
              <Field label="Email Address *" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="sarah@example.com"
                  style={inputStyle(!!errors.email)}
                />
              </Field>
            </div>

            {/* Password */}
            <Field label="Temporary Password *" error={errors.password}>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle(!!errors.password), paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 2,
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={15} color="#AAA" />
                  ) : (
                    <Eye size={15} color="#AAA" />
                  )}
                </button>
              </div>
            </Field>

            {/* Row: Wedding Date + Phone */}
            <div className="bride-modal-row">
              <Field label="Wedding Date *" error={errors.weddingDate}>
                <input
                  type="date"
                  value={form.weddingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => set("weddingDate", e.target.value)}
                  style={inputStyle(!!errors.weddingDate)}
                />
              </Field>
              <Field label="Phone Number *" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and common phone formatting characters
                    const cleaned = value.replace(/[^\d\s\-\+\(\)]/g, "");
                    // Count only digits
                    const digitsOnly = cleaned.replace(/\D/g, "");
                    // Prevent input if more than 12 digits
                    if (digitsOnly.length <= 12) {
                      set("phone", cleaned);
                    }
                  }}
                  placeholder="0412 345 678"
                  style={inputStyle(!!errors.phone)}
                  maxLength={15}
                />
              </Field>
            </div>

            {/* Row: Partner Name + Venue Name */}
            <div className="bride-modal-row">
              <Field label="Partner's Name">
                <input
                  value={form.partnerName}
                  onChange={(e) => set("partnerName", e.target.value)}
                  placeholder="e.g. James"
                  style={inputStyle(false)}
                />
              </Field>
              <Field label="Venue Name">
                <input
                  value={form.venueName}
                  onChange={(e) => set("venueName", e.target.value)}
                  placeholder="e.g. Pasadena Estate"
                  style={inputStyle(false)}
                />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Notes">
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any additional notes about this bride…"
                rows={3}
                style={{
                  ...inputStyle(false),
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
            </Field>

            {/* Footer */}
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
                    <Loader2 size={15} className="animate-spin" /> Adding Bride…
                  </>
                ) : (
                  "Add Bride"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#555",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#C0392B" }}>{error}</span>}
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#F5C6C6" : "#E8E0D5"}`,
    borderRadius: 8,
    fontSize: 13,
    color: "#333",
    background: hasError ? "#FFFAFA" : "#FDFBF8",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  };
}
