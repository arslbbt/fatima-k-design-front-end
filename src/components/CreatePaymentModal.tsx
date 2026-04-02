import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, AlertCircle, CreditCard } from "lucide-react";
import { paymentsApi, bridesApi, ApiError, type PaymentType } from "@/lib/api";
import { queryKeys, invalidateQueries } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";

interface CreatePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPayment?: {
    id: string;
    paymentType: string;
    amount: number;
    dueDate: string | null;
    notes: string | null;
  } | null;
}

const PAYMENT_LABELS: { value: PaymentType; label: string }[] = [
  { value: "BOOKING_DEPOSIT", label: "Booking Deposit" },
  { value: "FABRICATION", label: "Fabrication" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "FINAL_BALANCE", label: "Final Balance" },
];

const inp: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E8E0D5",
  borderRadius: 10,
  fontSize: 14,
  color: "#333",
  background: "#FDFBF8",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
};

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#1F1F1F",
  marginBottom: 8,
};

export function CreatePaymentModal({
  open,
  onOpenChange,
  editPayment,
}: CreatePaymentModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editPayment;
  const [brideId, setBrideId] = useState("");
  const [paymentType, setPaymentType] =
    useState<PaymentType>("BOOKING_DEPOSIT");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (editPayment) {
        setPaymentType(editPayment.paymentType as PaymentType);
        setAmount(String(Number(editPayment.amount)));
        setDueDate(
          editPayment.dueDate ? editPayment.dueDate.split("T")[0] : "",
        );
        setNotes(editPayment.notes ?? "");
        setMarkAsPaid(false);
      } else {
        setBrideId("");
        setPaymentType("BOOKING_DEPOSIT");
        setAmount("");
        setDueDate("");
        setNotes("");
        setMarkAsPaid(false);
      }
      setError(null);
    }
  }, [open, editPayment]);

  // When "mark as paid" is toggled, set due date to today
  useEffect(() => {
    if (markAsPaid) {
      const today = new Date().toISOString().split("T")[0];
      setDueDate(today);
    }
  }, [markAsPaid]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const { data: brides = [] } = useQuery({
    queryKey: queryKeys.brides.names(),
    queryFn: () => bridesApi.names(),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        return paymentsApi.update(editPayment!.id, {
          amount: parseFloat(amount),
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          notes: notes || undefined,
          markAsPaid: markAsPaid || undefined,
        });
      }
      return paymentsApi.create(data);
    },
    onSuccess: () => {
      invalidateQueries.afterPaymentMutation(queryClient);
      toast({
        title: "Payment created",
        description: "Bride will be notified by email.",
      });
      onOpenChange(false);
    },
    onError: (err) =>
      setError(err instanceof ApiError ? err.message : "Something went wrong."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isEdit && !brideId) {
      setError("Please select a bride.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }
    mutation.mutate({
      brideId,
      paymentType,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate).toISOString(),
      notes: notes || undefined,
      markAsPaid,
    });
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
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
          padding: 16,
          overflowY: "auto",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onOpenChange(false);
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            width: "100%",
            maxWidth: 520,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: "1px solid #F0EAE2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#2C2C2C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#D4A373",
                    letterSpacing: "0.05em",
                  }}
                >
                  FK
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: 0,
                }}
              >
                {isEdit ? "Edit Payment" : "Create Payment"}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid #E8E0D5",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={15} color="#888" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
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

            {/* Bride selector — create mode only */}
            {!isEdit && (
              <div>
                <label style={lbl}>Client *</label>
                <select
                  value={brideId}
                  onChange={(e) => setBrideId(e.target.value)}
                  style={inp}
                >
                  <option value="">Select a bride</option>
                  {brides.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={lbl}>Payment Label *</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                style={inp}
              >
                {PAYMENT_LABELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label style={lbl}>Amount (AUD) *</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 14,
                      color: "#999",
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    style={{ ...inp, paddingLeft: 28 }}
                  />
                </div>
              </div>
              <div>
                <label style={lbl}>Due Date *</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  disabled={markAsPaid}
                  style={{
                    ...inp,
                    cursor: markAsPaid ? "not-allowed" : "text",
                    opacity: markAsPaid ? 0.6 : 1,
                  }}
                />
              </div>
            </div>

            <div>
              <label style={lbl}>
                Notes{" "}
                <span style={{ fontWeight: 400, color: "#AAA" }}>
                  (optional)
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes for this payment…"
                rows={2}
                style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>

            {/* Mark as paid immediately */}
            <div
              onClick={() => setMarkAsPaid(!markAsPaid)}
              style={{
                background: "#FCFCFC",
                padding: "14px 16px",
                borderRadius: 10,
                border: `1px solid ${markAsPaid ? "#D4A373" : "#E8E0D5"}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: `1.5px solid ${markAsPaid ? "#D4A373" : "#D1D5DB"}`,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: markAsPaid ? "#D4A373" : "#fff",
                  flexShrink: 0,
                }}
              >
                {markAsPaid && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: "#fff",
                      borderRadius: 1,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#1F1F1F" }}
                >
                  Mark as paid immediately
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  Record this payment as already collected
                </div>
              </div>
              <CreditCard
                size={18}
                color={markAsPaid ? "#D4A373" : "#D1D5DB"}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 12,
                paddingTop: 4,
              }}
            >
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                style={{
                  padding: "13px",
                  border: "1px solid #E8E0D5",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "#666",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                style={{
                  padding: "13px",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
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
                    {isEdit ? "Saving…" : "Creating…"}
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Payment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
