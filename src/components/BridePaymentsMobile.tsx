import { CheckCircle2, Clock, AlertCircle, Menu, ChevronRight, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

const history = [
  { label: "Deposit", date: "5 Dec 2025", amount: "$800", status: "paid" },
  { label: "2nd Instalment", date: "20 Jan 2026", amount: "$1,000", status: "paid" },
  { label: "3rd Instalment", date: "10 Feb 2026", amount: "$1,000", status: "paid" },
  { label: "Final Balance", date: "Due 24 Mar 2026", amount: "$1,200", status: "due" },
];

export function BridePaymentsMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <img src="/fatimak-logo.jpg" alt="Fatima K" style={{ height: 24, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: `1.5px solid ${S.accent}60` }}><AvatarFallback style={{ background: "#E8D8CE", color: S.accentText, fontSize: 11, fontWeight: 600 }}>SA</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>My Portal</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>Payments</span>
      </div>

      <div style={{ padding: "18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Balance summary card */}
        <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ background: "linear-gradient(135deg, #F0E4D8, #E8D0C0)", padding: "20px 18px" }}>
            <div style={{ fontSize: 10, color: S.accentText, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total Gown Cost</div>
            <div style={{ fontFamily: S.serif, fontSize: 36, fontWeight: 500, color: S.dark, lineHeight: 1 }}>$4,000</div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: S.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Paid</div>
                <div style={{ fontFamily: S.serif, fontSize: 22, color: "#555", fontWeight: 400 }}>$2,800</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: S.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Remaining</div>
                <div style={{ fontFamily: S.serif, fontSize: 22, color: "#B87A4F", fontWeight: 500 }}>$1,200</div>
              </div>
            </div>
            <div style={{ background: "#EDE4DA", borderRadius: 6, height: 8, marginBottom: 6 }}>
              <div style={{ width: "70%", height: "100%", background: `linear-gradient(90deg, ${S.accent}, #C8956A)`, borderRadius: 6 }} />
            </div>
            <div style={{ fontSize: 11, color: S.muted, textAlign: "center" }}>70% paid · Final payment due 24 Mar 2026</div>
          </div>
        </div>

        {/* Outstanding alert */}
        <div style={{ background: "#FFF8F2", border: `1px solid #F0C090`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertCircle size={16} color="#C8956A" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#7A4A20", marginBottom: 2 }}>Final balance due at your fitting</div>
            <div style={{ fontSize: 11, color: "#B07840" }}>$1,200 is due on 24 March 2026 — your Final Fitting appointment. Payment is required before collection.</div>
          </div>
        </div>

        {/* Payment history */}
        <section>
          <h2 style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 500, color: S.dark, margin: "0 0 12px", paddingBottom: 8, borderBottom: `1px solid ${S.border}` }}>Payment History</h2>
          <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {history.map((p, i) => (
              <div key={i} style={{ padding: "13px 14px", borderBottom: i < history.length - 1 ? `1px solid #F0EBE4` : "none", display: "flex", alignItems: "center", gap: 10, background: p.status === "due" ? "#FFF8F2" : "#fff" }}>
                {p.status === "paid"
                  ? <CheckCircle2 size={16} color={S.accent} style={{ flexShrink: 0 }} />
                  : <Clock size={16} color="#C8956A" style={{ flexShrink: 0 }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: S.dark }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{p.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.status === "due" ? "#B87A4F" : "#555" }}>{p.amount}</div>
                  <div style={{ fontSize: 10, marginTop: 1 }}>
                    {p.status === "paid"
                      ? <span style={{ color: S.accentText }}>Paid</span>
                      : <span style={{ color: "#C8956A" }}>Outstanding</span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pay now */}
        <div style={{ paddingBottom: 24 }}>
          <button style={{ width: "100%", padding: 13, background: "#333", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CreditCard size={15} /> Pay $1,200 Final Balance
          </button>
          <div style={{ fontSize: 10, color: S.muted, textAlign: "center", marginTop: 8 }}>Secure payment · All transactions are encrypted</div>
        </div>

      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
