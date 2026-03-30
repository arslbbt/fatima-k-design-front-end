import { CheckCircle2, Clock, AlertCircle, Download, Info } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi, type Payment } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { PaymentReceiptModal } from "@/components/PaymentReceiptModal";
import { useAuth } from "@/lib/auth";

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  BOOKING_DEPOSIT: "Booking Deposit",
  FABRICATION: "Fabrication",
  CONSTRUCTION: "Construction",
  FINAL_BALANCE: "Final Balance",
};

export function BridePortalPayments() {
  const { user } = useAuth();
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", "me"],
    queryFn: () => paymentsApi.listMine(),
  });

  const total = payments?.reduce((s, p) => s + Number(p.amount), 0) || 0;
  const paid =
    payments
      ?.filter((p) => p.status === "PAID")
      .reduce((s, p) => s + Number(p.amount), 0) || 0;
  const outstanding =
    payments
      ?.filter((p) => p.status !== "PAID")
      .reduce((s, p) => s + Number(p.amount), 0) || 0;
  const paidPct = total > 0 ? Math.round((paid / total) * 100) : 0;

  const nextPayment = payments?.find((p) => p.status !== "PAID");

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 6px",
              }}
            >
              Payments
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Your payment schedule and collection status
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
            {[
              {
                label: "Total Gown Value",
                value: `$${total.toLocaleString()}`,
                sub: "Custom couture",
                accent: false,
              },
              {
                label: "Paid to Date",
                value: `$${paid.toLocaleString()}`,
                sub: `${paidPct}% complete`,
                accent: false,
              },
              {
                label: "Outstanding",
                value: `$${outstanding.toLocaleString()}`,
                sub: nextPayment
                  ? `Due ${new Date(nextPayment.dueDate!).toLocaleDateString()}`
                  : "No pending payments",
                accent: true,
              },
            ].map((s, i) => (
              <Card
                key={i}
                style={{
                  flex: 1,
                  background: s.accent
                    ? "linear-gradient(135deg, #FFF4EC, #FDE8D4)"
                    : "#FFFFFF",
                  border: `1px solid ${s.accent ? "#F5D5B0" : "#E8E0D5"}`,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent style={{ padding: "20px 22px" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 28,
                      fontWeight: 500,
                      color: s.accent ? "#C07840" : "#D4A373",
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: 2,
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{s.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E0D5",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              marginBottom: 28,
            }}
          >
            <CardContent style={{ padding: "18px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
                  Payment Progress
                </span>
                <span
                  style={{ fontSize: 13, color: "#A67C52", fontWeight: 600 }}
                >
                  {paidPct}%
                </span>
              </div>
              <div
                style={{
                  background: "#EDE4DA",
                  borderRadius: 6,
                  height: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${paidPct}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #D4A373, #C8956A)",
                    borderRadius: 6,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                  fontSize: 11,
                  color: "#AAAAAA",
                }}
              >
                <span>${paid.toLocaleString()} paid</span>
                <span>${(total - paid).toLocaleString()} remaining</span>
              </div>
            </CardContent>
          </Card>

          <div style={{ marginBottom: 12 }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 16px",
                borderBottom: "1px solid #E8E0D5",
                paddingBottom: 10,
              }}
            >
              Payment Schedule
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
                Loading schedule...
              </div>
            ) : payments?.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "#888",
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px dashed #E8E0D5",
                }}
              >
                No payment requests yet
              </div>
            ) : (
              payments?.map((pmt) => {
                const isPaid = pmt.status === "PAID";
                const isDue =
                  pmt.status === "PENDING" || pmt.status === "OVERDUE";

                return (
                  <Card
                    key={pmt.id}
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${pmt.status === "OVERDUE" ? "#F5C0C0" : isDue ? "#F5D5B0" : "#E8E0D5"}`,
                      boxShadow: isDue
                        ? "0 2px 10px rgba(200,130,60,0.1)"
                        : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <CardContent
                      style={{
                        padding: "18px 22px",
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: isPaid
                            ? "#E8F4E8"
                            : isDue
                              ? "#FEF3E8"
                              : "#F3F3F3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isPaid && <CheckCircle2 size={20} color="#4CAF50" />}
                        {isDue && (
                          <AlertCircle
                            size={20}
                            color={
                              pmt.status === "OVERDUE" ? "#C04040" : "#E07020"
                            }
                          />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 18,
                              fontWeight: 500,
                              color: "#2C2C2C",
                            }}
                          >
                            {PAYMENT_TYPE_LABELS[pmt.paymentType]}
                          </span>
                          {isPaid && (
                            <Badge
                              style={{
                                background: "#E8F4E8",
                                color: "#3A7A3A",
                                border: "none",
                                fontSize: 9,
                              }}
                            >
                              Paid
                            </Badge>
                          )}
                          {pmt.status === "PENDING" && (
                            <Badge
                              style={{
                                background: "#FEF0E0",
                                color: "#C07840",
                                border: "none",
                                fontSize: 9,
                              }}
                            >
                              Due
                            </Badge>
                          )}
                          {pmt.status === "OVERDUE" && (
                            <Badge
                              style={{
                                background: "#FDE8E8",
                                color: "#C04040",
                                border: "none",
                                fontSize: 9,
                              }}
                            >
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#888",
                            marginBottom: 4,
                          }}
                        >
                          {pmt.notes}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            fontSize: 11,
                            color: "#AAAAAA",
                          }}
                        >
                          <span>
                            Due{" "}
                            {pmt.dueDate
                              ? new Date(pmt.dueDate).toLocaleDateString()
                              : "TBD"}
                          </span>
                          {isPaid && pmt.paidDate && (
                            <span style={{ color: "#4CAF50" }}>
                              ✓ Paid{" "}
                              {new Date(pmt.paidDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 22,
                            fontWeight: 500,
                            color: isPaid
                              ? "#888"
                              : isDue
                                ? "#C07840"
                                : "#BBBBBB",
                          }}
                        >
                          ${Number(pmt.amount).toLocaleString()}
                        </div>
                        {isPaid && (
                          <button
                            onClick={() => setReceiptPayment(pmt)}
                            style={{
                              marginTop: 6,
                              fontSize: 11,
                              color: "#A67C52",
                              background: "#F5EFE9",
                              border: "1px solid #E8D8CE",
                              borderRadius: 6,
                              padding: "4px 10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Download size={11} /> Receipt
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 18px",
              background: "#FDF9F5",
              border: "1px solid #F5D5B0",
              borderRadius: 10,
              marginBottom: 32,
            }}
          >
            <Info size={16} color="#C07840" />
            <span style={{ fontSize: 13, color: "#C07840" }}>
              Payments are collected manually by Fatima K Design. Once paid, the
              admin will update your portal status. Please contact us for
              payment instructions.
            </span>
          </div>
        </div>
      </main>

      <PaymentReceiptModal
        payment={receiptPayment}
        brideName={user?.name ?? ""}
        brideEmail={user?.email ?? ""}
        onClose={() => setReceiptPayment(null)}
      />
    </BridePortalLayout>
  );
}
