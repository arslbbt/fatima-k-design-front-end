import { useRef } from "react";
import { X, Printer, Download, CheckCircle2 } from "lucide-react";
import type { Payment } from "@/lib/api";
import { APPOINTMENT_TITLE_LABELS } from "@/lib/api";

const PAYMENT_TYPE_LABELS = APPOINTMENT_TITLE_LABELS;

interface PaymentReceiptModalProps {
  payment: Payment | null;
  brideName: string;
  brideEmail: string;
  onClose: () => void;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function receiptNo(id: string) {
  return `FK-REC-${id.slice(-4).toUpperCase().padStart(4, "0")}`;
}

export function PaymentReceiptModal({
  payment,
  brideName,
  brideEmail,
  onClose,
}: PaymentReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const amount = `$${Number(payment.amount).toLocaleString()}`;
  const label = PAYMENT_TYPE_LABELS[payment.paymentType] ?? payment.paymentType;

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=600,height=800");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Receipt — ${label}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background: #fff; color: #2c2c2c; padding: 40px; }
        @media print { body { padding: 0; } }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    // Slight delay so the content renders before print dialog opens
    setTimeout(() => win.print(), 300);
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 200,
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 201,
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
            maxWidth: 480,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            fontFamily: "'DM Sans', sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Modal header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #F0EAE2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2C" }}>
              Payment Receipt
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={handlePrint}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  background: "#fff",
                  fontSize: 12,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                <Printer size={13} /> Print
              </button>
              <button
                onClick={handlePrint}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  background: "#fff",
                  fontSize: 12,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                <Download size={13} /> Download
              </button>
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
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Receipt body */}
          <div ref={printRef} style={{ padding: "32px 36px" }}>
            {/* Brand */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "#2C2C2C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#D4A373",
                    letterSpacing: "0.05em",
                  }}
                >
                  FK
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                FATIMA K
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#AAAAAA",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Luxury Bridal Couture
              </div>
            </div>

            {/* Status badge */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 24px",
                  border: "1.5px solid #27AE60",
                  borderRadius: 30,
                  color: "#27AE60",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <CheckCircle2 size={14} /> Payment Received
              </div>
            </div>

            {/* Divider */}
            <div
              style={{ borderTop: "1px dashed #E8E0D5", marginBottom: 20 }}
            />

            {/* Receipt meta */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#AAAAAA",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  Receipt No.
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2C" }}
                >
                  {receiptNo(payment.id)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#AAAAAA",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  Payment Date
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2C" }}
                >
                  {fmtDate(payment.paidDate)}
                </div>
              </div>
            </div>

            {/* Billed to */}
            <div
              style={{
                background: "#FAF8F5",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#AAAAAA",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Billed To
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2C2C2C",
                  marginBottom: 3,
                }}
              >
                {brideName}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>{brideEmail}</div>
            </div>

            {/* Line item */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: "1px solid #F0EAE2",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#2C2C2C",
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>
                {payment.notes && (
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {payment.notes}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                {amount}
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                background: "#2C2C2C",
                borderRadius: 10,
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Total Paid
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#D4A373",
                }}
              >
                {amount}
              </span>
            </div>

            {/* Footer */}
            <div
              style={{
                textAlign: "center",
                paddingTop: 16,
                borderTop: "1px dashed #E8E0D5",
              }}
            >
              <div style={{ fontSize: 11, color: "#AAAAAA", lineHeight: 1.8 }}>
                Fatima K Bridal Couture · Paddington, NSW 2021
                <br />
                Info@fatimak.com.au · fatimak.com.au
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
