import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import {
  appointmentsApi,
  bridesApi,
  ApiError,
  type AppointmentTitle,
  type AppointmentStatus,
  type AppointmentWithBride,
  type CreateAppointmentPayload,
  type UpdateAppointmentPayload,
  APPOINTMENT_TITLE_LABELS,
} from "@/lib/api";
import { queryKeys, invalidateQueries } from "@/lib/queryKeys";

interface AddAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  editAppointment?: AppointmentWithBride | null;
}

const TITLE_OPTIONS: AppointmentTitle[] = [
  "CONSULTATION",
  "FIRST_FITTING",
  "SECOND_FITTING",
  "THIRD_FITTING",
  "FINAL_FITTING",
  "ALTERATION",
  "COLLECTION_READY",
  "CUSTOM",
];

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "RESCHEDULED", label: "Rescheduled" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface FormState {
  brideId: string;
  title: AppointmentTitle;
  customTitle: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  whatToBring: string;
  status: AppointmentStatus;
}

interface FormErrors {
  brideId?: string;
  title?: string;
  customTitle?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

const EMPTY: FormState = {
  brideId: "",
  title: "CONSULTATION",
  customTitle: "",
  description: "",
  location: "",
  date: "",
  startTime: "",
  endTime: "",
  whatToBring: "",
  status: "SCHEDULED",
};

function toLocalDate(iso: string) {
  const d = new Date(iso);
  return d.toISOString().split("T")[0];
}
function toLocalTime(iso: string) {
  const d = new Date(iso);
  return d.toTimeString().slice(0, 5);
}

function validate(form: FormState, isEdit: boolean): FormErrors {
  const errors: FormErrors = {};
  if (!isEdit && !form.brideId) errors.brideId = "Please select a bride";
  if (!form.title) errors.title = "Please select an appointment type";
  if (form.title === "CUSTOM" && !form.customTitle.trim())
    errors.customTitle = "Please enter a custom title";
  if (!form.date) errors.date = "Date is required";
  if (!form.startTime) errors.startTime = "Start time is required";
  if (!form.endTime) errors.endTime = "End time is required";
  if (form.startTime && form.endTime && form.endTime <= form.startTime)
    errors.endTime = "End time must be after start time";
  return errors;
}

export function AddAppointmentModal({
  open,
  onClose,
  editAppointment,
}: AddAppointmentModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editAppointment;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (open && editAppointment) {
      setForm({
        brideId: editAppointment.bride.id,
        title: editAppointment.title,
        customTitle: "",
        description: editAppointment.description ?? "",
        location: editAppointment.location ?? "",
        date: toLocalDate(editAppointment.startTime),
        startTime: toLocalTime(editAppointment.startTime),
        endTime: toLocalTime(editAppointment.endTime),
        whatToBring: editAppointment.whatToBring ?? "",
        status: editAppointment.status,
      });
    } else if (open) {
      setForm(EMPTY);
    }
    setErrors({});
    setApiError(null);
  }, [open, editAppointment]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Load brides for selector (create mode only)
  const { data: brides = [] } = useQuery({
    queryKey: queryKeys.brides.names(),
    queryFn: () => bridesApi.names(),
    enabled: open && !isEdit,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      appointmentsApi.create(payload),
    onSuccess: () => {
      invalidateQueries.afterAppointmentMutation(queryClient);
      onClose();
    },
    onError: (err) => {
      setApiError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateAppointmentPayload) =>
      appointmentsApi.update(editAppointment!.id, payload),
    onSuccess: () => {
      invalidateQueries.afterAppointmentMutation(queryClient);
      onClose();
    },
    onError: (err) => {
      setApiError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      );
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field as keyof FormErrors])
      setErrors((e) => ({ ...e, [field]: undefined }));
    setApiError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form, isEdit);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const startTime = new Date(`${form.date}T${form.startTime}`).toISOString();
    const endTime = new Date(`${form.date}T${form.endTime}`).toISOString();

    if (isEdit) {
      const payload: UpdateAppointmentPayload = {
        title: form.title,
        ...(form.description.trim() && {
          description: form.description.trim(),
        }),
        ...(form.location.trim() && { location: form.location.trim() }),
        startTime,
        endTime,
        ...(form.whatToBring.trim() && {
          whatToBring: form.whatToBring.trim(),
        }),
        status: form.status,
      };
      updateMutation.mutate(payload);
    } else {
      const payload: CreateAppointmentPayload = {
        brideId: form.brideId,
        title: form.title,
        ...(form.title === "CUSTOM" && {
          customTitle: form.customTitle.trim(),
        }),
        ...(form.description.trim() && {
          description: form.description.trim(),
        }),
        ...(form.location.trim() && { location: form.location.trim() }),
        startTime,
        endTime,
        ...(form.whatToBring.trim() && {
          whatToBring: form.whatToBring.trim(),
        }),
      };
      createMutation.mutate(payload);
    }
  }

  if (!open) return null;

  const today = new Date().toISOString().split("T")[0];

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
            maxWidth: 540,
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
                {isEdit ? "Edit Appointment" : "New Appointment"}
              </h2>
              <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>
                {isEdit
                  ? `Editing appointment for ${editAppointment?.bride.name}`
                  : "A confirmation email with calendar invite will be sent to the bride."}
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

            {/* Bride selector — create mode only */}
            {!isEdit && (
              <Field label="Bride *" error={errors.brideId}>
                <select
                  value={form.brideId}
                  onChange={(e) => set("brideId", e.target.value)}
                  style={inputStyle(!!errors.brideId)}
                >
                  <option value="">Select a bride…</option>
                  {brides.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {/* Appointment type */}
            <Field label="Appointment Type *" error={errors.title}>
              <select
                value={form.title}
                onChange={(e) =>
                  set("title", e.target.value as AppointmentTitle)
                }
                style={inputStyle(!!errors.title)}
              >
                {TITLE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {APPOINTMENT_TITLE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>

            {/* Custom title */}
            {form.title === "CUSTOM" && (
              <Field label="Custom Title *" error={errors.customTitle}>
                <input
                  value={form.customTitle}
                  onChange={(e) => set("customTitle", e.target.value)}
                  placeholder="e.g. Veil & Accessories Review"
                  style={inputStyle(!!errors.customTitle)}
                />
              </Field>
            )}

            {/* Date + times */}
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1fr 1fr", // 2 columns
                gridAutoRows: "auto",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <Field label="Date *" error={errors.date}>
                  <input
                    type="date"
                    value={form.date}
                    min={isEdit ? undefined : today}
                    onChange={(e) => set("date", e.target.value)}
                    style={inputStyle(!!errors.date)}
                  />
                </Field>
              </div>

              <div>
                <Field label="Start Time *" error={errors.startTime}>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => set("startTime", e.target.value)}
                    style={inputStyle(!!errors.startTime)}
                  />
                </Field>
              </div>

              <div>
                <Field label="End Time *" error={errors.endTime}>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => set("endTime", e.target.value)}
                    style={inputStyle(!!errors.endTime)}
                  />
                </Field>
              </div>
            </div>

            {/* Status — edit mode only */}
            {isEdit && (
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) =>
                    set("status", e.target.value as AppointmentStatus)
                  }
                  style={inputStyle(false)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {/* Location */}
            <Field label="Location">
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Fatima K Studio, Paddington"
                style={inputStyle(false)}
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Brief description of the appointment…"
                rows={2}
                style={{
                  ...inputStyle(false),
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
            </Field>

            {/* What to bring */}
            <Field label="What to Bring">
              <textarea
                value={form.whatToBring}
                onChange={(e) => set("whatToBring", e.target.value)}
                placeholder="e.g. Wedding shoes, veil, inspiration photos…"
                rows={2}
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
                disabled={isPending}
                style={{
                  flex: 2,
                  padding: "11px",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  background: isPending ? "#C4A88C" : "#2C2C2C",
                  cursor: isPending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />{" "}
                    {isEdit ? "Saving…" : "Scheduling…"}
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Schedule Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

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
