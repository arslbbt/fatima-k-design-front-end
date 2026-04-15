import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  adminApi,
  ApiError,
  type RegisterBridePayload,
  type UpdateBridePayload,
  type BrideWithProfile,
  type AppointmentTitle,
  APPOINTMENT_TITLE_LABELS,
  CUSTOM_APPOINTMENT_TITLES,
  RTW_APPOINTMENT_TITLES,
} from "@/lib/api";
import { invalidateQueries } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";

interface AddBrideModalProps {
  open: boolean;
  onClose: () => void;
  editBride?: BrideWithProfile | null;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  brideType: "CUSTOM" | "READY_TO_WEAR";
  weddingDate: string;
  phone: string;
  partnerName: string;
  venueName: string;
  notes: string;
  totalGownAmount: string;
  // Initial payment fields
  initialPaymentAmount: string;
  initialPaymentType: AppointmentTitle;
  initialPaymentNotes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  weddingDate?: string;
  phone?: string;
  totalGownAmount?: string;
  initialPaymentAmount?: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  password: "",
  brideType: "CUSTOM",
  weddingDate: "",
  phone: "",
  partnerName: "",
  venueName: "",
  notes: "",
  totalGownAmount: "",
  initialPaymentAmount: "",
  initialPaymentType: "CONSULTATION",
  initialPaymentNotes: "",
};

function validate(form: FormState, isEdit: boolean): FormErrors {
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

  // Password validation (only for create mode)
  if (!isEdit) {
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
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
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    } else if (digitsOnly.length > 12) {
      errors.phone = "Phone number cannot exceed 12 digits";
    }
  }

  // Total gown amount validation (mandatory for create, optional for edit)
  if (!isEdit) {
    if (!form.totalGownAmount) {
      errors.totalGownAmount = "Total gown amount is required";
    } else if (parseFloat(form.totalGownAmount) <= 0) {
      errors.totalGownAmount = "Amount must be greater than 0";
    }
  } else {
    // For edit mode, only validate if provided
    if (form.totalGownAmount && parseFloat(form.totalGownAmount) < 0) {
      errors.totalGownAmount = "Amount must be positive";
    }
  }

  // Initial payment validation (only for create mode)
  if (!isEdit && form.initialPaymentAmount) {
    const paymentAmount = parseFloat(form.initialPaymentAmount);
    const gownAmount = parseFloat(form.totalGownAmount);

    if (paymentAmount < 0) {
      errors.initialPaymentAmount = "Amount must be positive";
    } else if (gownAmount && paymentAmount > gownAmount) {
      errors.initialPaymentAmount = "Cannot exceed total gown amount";
    }
  }

  return errors;
}

export function AddBrideModal({
  open,
  onClose,
  editBride,
}: AddBrideModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editBride;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get available payment types based on bride type
  const availablePaymentTypes =
    form.brideType === "READY_TO_WEAR"
      ? RTW_APPOINTMENT_TITLES
      : CUSTOM_APPOINTMENT_TITLES;

  // Reset on open or when editBride changes
  useEffect(() => {
    if (open) {
      if (editBride) {
        // Pre-fill form with bride data for editing
        setForm({
          name: editBride.name,
          email: editBride.email,
          password: "", // Never pre-fill password
          brideType: editBride.brideProfile?.brideType || "CUSTOM",
          weddingDate: editBride.brideProfile?.weddingDate
            ? editBride.brideProfile.weddingDate.split("T")[0]
            : "",
          phone: editBride.brideProfile?.phone || "",
          partnerName: editBride.brideProfile?.partnerName || "",
          venueName: editBride.brideProfile?.venueName || "",
          notes: editBride.brideProfile?.notes || "",
          totalGownAmount: editBride.brideProfile?.totalGownAmount
            ? String(editBride.brideProfile.totalGownAmount)
            : "",
          initialPaymentAmount: "",
          initialPaymentType: "CONSULTATION",
          initialPaymentNotes: "",
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
      setApiError(null);
      setShowPassword(false);
    }
  }, [open, editBride]);

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
    mutationFn: async (payload: RegisterBridePayload | UpdateBridePayload) => {
      if (isEdit && editBride) {
        return adminApi.updateBride(
          editBride.id,
          payload as UpdateBridePayload,
        );
      }
      return adminApi.registerBride(payload as RegisterBridePayload);
    },
    onSuccess: () => {
      invalidateQueries.afterBrideCreate(queryClient);
      toast({
        title: isEdit
          ? "Bride updated successfully"
          : "Bride added successfully",
        description: isEdit
          ? `${form.name}'s details have been updated.`
          : `${form.name} can now log in to their portal.`,
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
    const errs = validate(form, isEdit);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit) {
      // Update bride payload
      const payload: UpdateBridePayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        brideType: form.brideType,
        weddingDate: form.weddingDate,
        phone: form.phone.trim(),
        ...(form.partnerName.trim() && {
          partnerName: form.partnerName.trim(),
        }),
        ...(form.venueName.trim() && { venueName: form.venueName.trim() }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        ...(form.totalGownAmount && {
          totalGownAmount: parseFloat(form.totalGownAmount),
        }),
      };
      mutation.mutate(payload);
    } else {
      // Create bride payload
      const payload: RegisterBridePayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        brideType: form.brideType,
        weddingDate: form.weddingDate,
        phone: form.phone.trim(),
        ...(form.partnerName.trim() && {
          partnerName: form.partnerName.trim(),
        }),
        ...(form.venueName.trim() && { venueName: form.venueName.trim() }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        ...(form.totalGownAmount && {
          totalGownAmount: parseFloat(form.totalGownAmount),
        }),
        // Initial payment fields
        ...(form.initialPaymentAmount && {
          initialPaymentAmount: parseFloat(form.initialPaymentAmount),
          initialPaymentType: form.initialPaymentType,
          ...(form.initialPaymentNotes.trim() && {
            initialPaymentNotes: form.initialPaymentNotes.trim(),
          }),
        }),
      };
      mutation.mutate(payload);
    }
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
                {isEdit ? "Edit Bride" : "Add New Bride"}
              </h2>
              <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>
                {isEdit
                  ? "Update bride details and gown amount"
                  : "She'll receive login credentials to access her portal."}
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

            {/* Row: Password + Bride Type */}
            <div className="bride-modal-row">
              {!isEdit && (
                <Field label="Temporary Password *" error={errors.password}>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 6 characters"
                      style={{
                        ...inputStyle(!!errors.password),
                        paddingRight: 40,
                      }}
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
              )}
              {!isEdit && (
                <Field label="Bride Type *">
                  <select
                    value={form.brideType}
                    onChange={(e) =>
                      set(
                        "brideType",
                        e.target.value as "CUSTOM" | "READY_TO_WEAR",
                      )
                    }
                    style={inputStyle(false)}
                  >
                    <option value="CUSTOM">Custom</option>
                    <option value="READY_TO_WEAR">Ready to Wear</option>
                  </select>
                </Field>
              )}
            </div>

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

            {/* Total Gown Amount */}
            <Field
              label={
                isEdit ? "Total Gown Amount (AUD)" : "Total Gown Amount (AUD) *"
              }
              error={errors.totalGownAmount}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    color: "#999",
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.totalGownAmount}
                  onChange={(e) => set("totalGownAmount", e.target.value)}
                  placeholder="e.g. 5000"
                  style={{
                    ...inputStyle(!!errors.totalGownAmount),
                    paddingLeft: 28,
                  }}
                />
              </div>
            </Field>

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

            {/* Initial Payment Section - Only show in create mode */}
            {!isEdit && (
              <>
                <div
                  style={{
                    borderTop: "1px solid #F0EAE2",
                    paddingTop: 18,
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#555",
                      marginBottom: 18,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Initial Payment (Optional)
                  </div>

                  {/* Row: Initial Payment Amount + Payment Type */}
                  <div className="bride-modal-row">
                    <Field
                      label="Payment Amount"
                      error={errors.initialPaymentAmount}
                    >
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 13,
                            color: "#999",
                          }}
                        >
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.initialPaymentAmount}
                          onChange={(e) =>
                            set("initialPaymentAmount", e.target.value)
                          }
                          placeholder="Amount paid today"
                          style={{
                            ...inputStyle(!!errors.initialPaymentAmount),
                            paddingLeft: 28,
                          }}
                        />
                      </div>
                    </Field>
                    <Field label="Payment Type">
                      <select
                        value={form.initialPaymentType}
                        onChange={(e) =>
                          set(
                            "initialPaymentType",
                            e.target.value as AppointmentTitle,
                          )
                        }
                        style={inputStyle(false)}
                        disabled={!form.initialPaymentAmount}
                      >
                        {availablePaymentTypes.map((type) => (
                          <option key={type} value={type}>
                            {APPOINTMENT_TITLE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Payment Notes */}
                  <Field label="Payment Notes">
                    <textarea
                      value={form.initialPaymentNotes}
                      onChange={(e) =>
                        set("initialPaymentNotes", e.target.value)
                      }
                      placeholder="Notes about this payment…"
                      rows={2}
                      style={{
                        ...inputStyle(false),
                        resize: "vertical",
                        lineHeight: 1.5,
                      }}
                      disabled={!form.initialPaymentAmount}
                    />
                  </Field>
                </div>
              </>
            )}

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
                    <Loader2 size={15} className="animate-spin" />{" "}
                    {isEdit ? "Saving…" : "Adding Bride…"}
                  </>
                ) : isEdit ? (
                  "Save Changes"
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
