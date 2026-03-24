import {
  CheckCircle2, Clock, AlertCircle, Download, Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";

const payments = [
  {
    id: 1,
    label: "Booking Deposit",
    description: "Secures your design slot with Fatima K",
    amount: 1500,
    due: "5 Dec 2025",
    paid: "5 Dec 2025",
    status: "paid",
    receipt: true,
  },
  {
    id: 2,
    label: "Fabrication Payment",
    description: "Fabric and lace procurement — 40% of balance",
    amount: 3200,
    due: "20 Jan 2026",
    paid: "19 Jan 2026",
    status: "paid",
    receipt: true,
  },
  {
    id: 3,
    label: "Mid-Construction Payment",
    description: "Atelier labour — second stage milestone",
    amount: 2800,
    due: "10 Feb 2026",
    paid: "10 Feb 2026",
    status: "paid",
    receipt: true,
  },
  {
    id: 4,
    label: "Pre-Collection Payment",
    description: "Final balance before gown collection",
    amount: 2500,
    due: "24 Mar 2026",
    paid: null,
    status: "due",
    receipt: false,
  },
  {
    id: 5,
    label: "Alternations (if required)",
    description: "Post-wedding alterations — billed after event",
    amount: null,
    due: "TBD",
    paid: null,
    status: "upcoming",
    receipt: false,
  },
];

const total = 10000;
const paid = payments.filter(p => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);
const outstanding = payments.filter(p => p.status === "due").reduce((s, p) => s + (p.amount || 0), 0);
const paidPct = Math.round((paid / total) * 100);

export function BridePortalPayments() {
  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>Payments</h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Your payment schedule for the Chantilly lace gown</p>
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Total Gown Value", value: `$${total.toLocaleString()}`, sub: "Custom couture", accent: false },
              { label: "Paid to Date", value: `$${paid.toLocaleString()}`, sub: `${paidPct}% complete`, accent: false },
              { label: "Outstanding", value: `$${outstanding.toLocaleString()}`, sub: "Due 24 Mar 2026", accent: true },
            ].map((s, i) => (
              <Card key={i} style={{ flex: 1, background: s.accent ? "linear-gradient(135deg, #FFF4EC, #FDE8D4)" : "#FFFFFF", border: `1px solid ${s.accent ? "#F5D5B0" : "#E8E0D5"}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <CardContent style={{ padding: "20px 22px" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: s.accent ? "#C07840" : "#D4A373", marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{s.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", marginBottom: 28 }}>
            <CardContent style={{ padding: "18px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>Payment Progress</span>
                <span style={{ fontSize: 13, color: "#A67C52", fontWeight: 600 }}>{paidPct}%</span>
              </div>
              <div style={{ background: "#EDE4DA", borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${paidPct}%`, height: "100%", background: "linear-gradient(90deg, #D4A373, #C8956A)", borderRadius: 6 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#AAAAAA" }}>
                <span>${paid.toLocaleString()} paid</span>
                <span>${(total - paid).toLocaleString()} remaining</span>
              </div>
            </CardContent>
          </Card>

          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", margin: "0 0 16px", borderBottom: "1px solid #E8E0D5", paddingBottom: 10 }}>Payment Schedule</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {payments.map((pmt) => {
              const isPaid = pmt.status === "paid";
              const isDue = pmt.status === "due";
              const isUpcoming = pmt.status === "upcoming";

              return (
                <Card key={pmt.id} style={{ background: "#FFFFFF", border: `1px solid ${isDue ? "#F5D5B0" : "#E8E0D5"}`, boxShadow: isDue ? "0 2px 10px rgba(200,130,60,0.1)" : "0 1px 4px rgba(0,0,0,0.04)", opacity: isUpcoming ? 0.65 : 1 }}>
                  <CardContent style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 18 }}>

                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: isPaid ? "#E8F4E8" : isDue ? "#FEF3E8" : "#F3F3F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isPaid && <CheckCircle2 size={20} color="#4CAF50" />}
                      {isDue && <AlertCircle size={20} color="#E07020" />}
                      {isUpcoming && <Clock size={20} color="#AAAAAA" />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C" }}>{pmt.label}</span>
                        {isPaid && <Badge style={{ background: "#E8F4E8", color: "#3A7A3A", border: "none", fontSize: 9 }}>Paid</Badge>}
                        {isDue && <Badge style={{ background: "#FEF0E0", color: "#C07840", border: "none", fontSize: 9 }}>Due</Badge>}
                        {isUpcoming && <Badge style={{ background: "#F3F3F3", color: "#888", border: "none", fontSize: 9 }}>Upcoming</Badge>}
                      </div>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{pmt.description}</div>
                      <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#AAAAAA" }}>
                        <span>Due {pmt.due}</span>
                        {isPaid && pmt.paid && <span style={{ color: "#4CAF50" }}>✓ Paid {pmt.paid}</span>}
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {pmt.amount ? (
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: isPaid ? "#888" : isDue ? "#C07840" : "#BBBBBB", marginBottom: 8 }}>
                          ${pmt.amount.toLocaleString()}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: "#BBBBBB", marginBottom: 8 }}>TBD</div>
                      )}
                      {isPaid && pmt.receipt && (
                        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "#F5EFE9", color: "#A67C52", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                          <Download size={11} /> Receipt
                        </button>
                      )}
                      {isDue && (
                        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                          Pay Now
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "#F5F5F5", borderRadius: 10, marginBottom: 32 }}>
            <Lock size={14} color="#AAAAAA" />
            <span style={{ fontSize: 12, color: "#888" }}>Payments are processed securely via Stripe. Your card details are never stored by Fatima K. All transactions are encrypted and PCI-DSS compliant.</span>
          </div>

        </div>
      </main>
    </BridePortalLayout>
  );
}
