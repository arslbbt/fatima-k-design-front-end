import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, AlertCircle, CreditCard } from "lucide-react";
import {
  paymentsApi,
  bridesApi,
  ApiError,
  type PaymentType,
  type BrideType,
  APPOINTMENT_TITLE_LABELS,
  CUSTOM_APPOINTMENT_TITLES,
  RTW_APPOINTMENT_TITLES,
} from "@/lib/api";
import { queryKeys, invalidateQueries } from "@/lib/queryKeys";
import { toast } from "@/hooks/use-toast";
import { SearchableSelect } from "@/components/ui/SearchableSelect";

interface CreatePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPayment?: {
    id: string;
    paymentType: string;
    amount: number;
    dueDate: string | null;
    notes: string | null;
    brideId?: string;
  } | null;
}

export function CreatePaymentModal({
  open,
  onOpenChange,
  editPayment,
}: CreatePaymentModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editPayment;
  const [brideId, setBrideId] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("CONSULTATION");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brideSearch, setBrideSearch] = useState("");
  const [selectedBrideType, setSelectedBrideType] = useState<BrideType | null>(
    null,
  );

  // Fetch selected bride details to get their type and outstanding balance
  const { data: selectedBride } = useQuery({
    queryKey: queryKeys.brides.detail(brideId),
    queryFn: () => bridesApi.get(brideId),
    enabled: !!brideId && open,
  });

  // Update bride type when bride is selected
  useEffect(() => {
    if (selectedBride?.brideProfile?.brideType) {
      setSelectedBrideType(selectedBride.brideProfile.brideType);
    }
  }, [selectedBride]);

  // Get financial info from selected bride
  const totalGownAmount = selectedBride?.brideProfile?.totalGownAmount
    ? Number(selectedBride.brideProfile.totalGownAmount)
    : null;
  const duePayments =
    selectedBride?.duePayments !== undefined &&
    selectedBride?.duePayments !== null
      ? Number(selectedBride.duePayments)
      : 0;
  const outstandingBalance =
    selectedBride?.outstanding !== undefined &&
    selectedBride?.outstanding !== null
      ? Number(selectedBride.outstanding)
      : null;
  const amountPaid =
    totalGownAmount !== null && outstandingBalance !== null
      ? totalGownAmount - outstandingBalance
      : null;

  // Get bride's currency
  const brideCurrency = selectedBride?.brideProfile?.currency || "AUD";
  const brideCountry = selectedBride?.brideProfile?.country || "AU";

  // For display in modal: outstanding after accounting for due payments
  // In edit mode, add back the original payment amount to get available balance
  const displayOutstanding =
    outstandingBalance !== null && duePayments !== null
      ? Math.max(0, outstandingBalance - duePayments)
      : outstandingBalance;

  // When editing, calculate max allowed amount (add back the original payment amount)
  const maxAllowedAmount =
    isEdit && editPayment
      ? (displayOutstanding ?? 0) + Number(editPayment.amount)
      : displayOutstanding;

  // Get available payment types based on bride type
  const availablePaymentTypes =
    selectedBrideType === "READY_TO_WEAR"
      ? RTW_APPOINTMENT_TITLES
      : CUSTOM_APPOINTMENT_TITLES;

  useEffect(() => {
    if (open) {
      if (editPayment) {
        setBrideId(editPayment.brideId || "");
        setPaymentType(editPayment.paymentType as PaymentType);
        setAmount(String(Number(editPayment.amount)));
        setDueDate(
          editPayment.dueDate ? editPayment.dueDate.split("T")[0] : "",
        );
        setNotes(editPayment.notes ?? "");
        setMarkAsPaid(false);
      } else {
        setBrideId("");
        setPaymentType("CONSULTATION");
        setAmount("");
        setDueDate("");
        setNotes("");
        setMarkAsPaid(false);
        setSelectedBrideType(null);
      }
      setError(null);
      setBrideSearch("");
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

  const { data: brides = [], isLoading: bridesLoading } = useQuery({
    queryKey: queryKeys.brides.names(brideSearch),
    queryFn: () => bridesApi.names({ search: brideSearch || undefined }),
    enabled: open,
  });

  const handleBrideSearch = useCallback((search: string) => {
    setBrideSearch(search);
  }, []);

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
    // Validate amount doesn't exceed outstanding balance (after due payments)
    if (maxAllowedAmount !== null && Number(amount) > maxAllowedAmount) {
      setError(
        `Amount cannot exceed outstanding balance of ${maxAllowedAmount.toLocaleString()} ${brideCurrency}. To create a larger payment, please update the Total Gown Amount first.`,
      );
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
                <label style={lbl}>
                  Bride *
                  {brideId && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 400,
                        color: "#888",
                      }}
                    >
                      ({brideCountry} • {brideCurrency})
                    </span>
                  )}
                </label>
                <SearchableSelect
                  value={brideId}
                  onChange={setBrideId}
                  options={brides}
                  onSearch={handleBrideSearch}
                  placeholder="Select a bride..."
                  isLoading={bridesLoading}
                />
              </div>
            )}

            {/* Financial Summary - show when bride is selected */}
            {brideId && totalGownAmount !== null && (
              <div
                style={{
                  background: "#FCFCFC",
                  padding: "16px 18px",
                  borderRadius: 10,
                  border: "1px solid #E8E0D5",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#666" }}>
                    Total Gown Amount
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#2C2C2C",
                    }}
                  >
                    {totalGownAmount.toLocaleString()} {brideCurrency}
                  </span>
                </div>
                <div
                  style={{
                    height: 1,
                    background: "#E8E0D5",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#666" }}>
                    Amount Paid
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#4CAF50",
                    }}
                  >
                    {amountPaid?.toLocaleString() ?? "0"} {brideCurrency}
                  </span>
                </div>
                {/* Show due payments row only if > 0 */}
                {duePayments > 0 && (
                  <>
                    <div
                      style={{
                        height: 1,
                        background: "#E8E0D5",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#666" }}>
                        Due Payments
                      </span>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#E07020",
                        }}
                      >
                        {duePayments.toLocaleString()} {brideCurrency}
                      </span>
                    </div>
                  </>
                )}
                <div
                  style={{
                    height: 1,
                    background: "#E8E0D5",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#666" }}>
                    Outstanding Balance
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color:
                        displayOutstanding && displayOutstanding > 0
                          ? "#D4574A"
                          : "#4CAF50",
                    }}
                  >
                    {displayOutstanding?.toLocaleString() ?? "0"}{" "}
                    {brideCurrency}
                  </span>
                </div>
                {displayOutstanding !== null && displayOutstanding === 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#4CAF50",
                      marginTop: 2,
                      fontWeight: 500,
                    }}
                  >
                    ✓ Fully paid
                  </div>
                )}
              </div>
            )}

            <div>
              <label style={lbl}>
                Payment Label *
                {selectedBrideType && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#888",
                    }}
                  >
                    ({selectedBrideType === "READY_TO_WEAR" ? "RTW" : "Custom"}{" "}
                    bride)
                  </span>
                )}
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                style={{
                  ...inp,
                  cursor: !brideId && !isEdit ? "not-allowed" : "pointer",
                  opacity: !brideId && !isEdit ? 0.6 : 1,
                }}
                disabled={!brideId && !isEdit}
              >
                {!brideId && !isEdit && (
                  <option value="">Select a bride first...</option>
                )}
                {availablePaymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {APPOINTMENT_TITLE_LABELS[type]}
                  </option>
                ))}
              </select>
              {!brideId && !isEdit && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#888",
                    marginTop: 6,
                  }}
                >
                  Payment options will appear after selecting a bride
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label style={lbl}>Amount ({brideCurrency}) *</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#999",
                    }}
                  >
                    {brideCurrency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    style={{ ...inp, paddingLeft: 52 }}
                  />
                </div>
                {maxAllowedAmount !== null && maxAllowedAmount > 0 && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      marginTop: 6,
                    }}
                  >
                    Max: {maxAllowedAmount.toLocaleString()} {brideCurrency}
                  </div>
                )}
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
