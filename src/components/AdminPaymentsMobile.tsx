import { ChevronRight, Menu, DollarSign, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

const payments = [
  { bride: "Sophie Anderson", initials: "SA", item: "Final Balance", amount: "$1,200", date: "Due 24 Mar", status: "due" },
  { bride: "Emma Clarke", initials: "EC", item: "3rd Instalment", amount: "$800", date: "Received 10 Feb", status: "paid" },
  { bride: "Mia Chen", initials: "MC", item: "2nd Instalment", amount: "$1,000", date: "Received 5 Feb", status: "paid" },
  { bride: "Chloe Nguyen", initials: "CN", item: "Deposit", amount: "$800", date: "Received 20 Jan", status: "paid" },
  { bride: "Isabelle Martin", initials: "IM", item: "Deposit", amount: "$800", date: "Due 1 Apr", status: "due" },
];

export function AdminPaymentsMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div>
          <img src="/fatimak-logo.jpg" alt="Fatima K" style={{ height: 20, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", display: "block" }} />
          <div style={{ fontSize: 8, color: "#AAAAAA", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>Admin</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: "1.5px solid #33333340" }}><AvatarFallback style={{ background: "#333", color: "#fff", fontSize: 10, fontWeight: 600 }}>FK</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>Admin</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>Payments</span>
      </div>

      <div style={{ padding: "18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ marginBottom: 8 }}><DollarSign size={16} color={S.accent} /></div>
            <div style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 500, color: S.dark }}>$18,450</div>
            <div style={{ fontSize: 10, color: S.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Total Received</div>
          </div>
          <div style={{ background: "#FFF8F2", border: `1px solid #F0C090`, borderRadius: 10, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ marginBottom: 8 }}><AlertCircle size={16} color="#C8956A" /></div>
            <div style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 500, color: "#B87A4F" }}>$6,200</div>
            <div style={{ fontSize: 10, color: "#C8956A", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Outstanding</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Paid", "Outstanding"].map((tab, i) => (
            <button key={i} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${i === 0 ? "#333" : S.border}`, background: i === 0 ? "#333" : "#fff", color: i === 0 ? "#fff" : S.muted, fontSize: 11, fontWeight: i === 0 ? 600 : 400, cursor: "pointer" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Payment list */}
        <section style={{ paddingBottom: 24 }}>
          <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: "0 0 12px", paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Recent Transactions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {payments.map((p, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.03)", background: p.status === "due" ? "#FFF8F2" : "#fff" } as any}>
                <Avatar style={{ width: 36, height: 36, border: `1.5px solid ${S.accent}30`, flexShrink: 0 }}>
                  <AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>{p.initials}</AvatarFallback>
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: S.dark }}>{p.bride}</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>{p.item} · {p.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.status === "due" ? "#B87A4F" : "#555" }}>{p.amount}</div>
                  <div style={{ marginTop: 2 }}>
                    {p.status === "paid"
                      ? <CheckCircle2 size={13} color={S.accent} />
                      : <Clock size={13} color="#C8956A" />
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
