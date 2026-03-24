import { useState } from "react";
import {
  CheckCircle2, AlertCircle, Clock, Download, ChevronDown,
  TrendingUp, Search, Filter
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const barHeights = [62, 74, 85, 58, 90, 45];

const brides = [
  {
    name: "Sophie Anderson",
    initials: "SA",
    type: "Couture",
    gown: "Chantilly Lace Bias-Cut",
    total: 10000,
    paid: 7500,
    status: "due",
    nextPayment: { label: "Pre-Collection", amount: 2500, due: "24 Mar 2026" },
    payments: [
      { label: "Booking Deposit", amount: 1500, status: "paid", date: "5 Dec 2025" },
      { label: "Fabrication", amount: 3200, status: "paid", date: "19 Jan 2026" },
      { label: "Mid-Construction", amount: 2800, status: "paid", date: "10 Feb 2026" },
      { label: "Pre-Collection", amount: 2500, status: "due", date: "24 Mar 2026" },
    ],
  },
  {
    name: "Isabelle Chen",
    initials: "IC",
    type: "Couture",
    gown: "Silk Mikado Ball Gown",
    total: 14500,
    paid: 14500,
    status: "paid",
    nextPayment: null,
    payments: [
      { label: "Booking Deposit", amount: 2000, status: "paid", date: "3 Oct 2025" },
      { label: "Fabrication", amount: 5800, status: "paid", date: "15 Nov 2025" },
      { label: "Construction", amount: 4200, status: "paid", date: "8 Jan 2026" },
      { label: "Final Balance", amount: 2500, status: "paid", date: "1 Mar 2026" },
    ],
  },
  {
    name: "Natalie Russo",
    initials: "NR",
    type: "Ready to Wear",
    gown: "Bardot Satin Column",
    total: 3200,
    paid: 1600,
    status: "overdue",
    nextPayment: { label: "Balance Payment", amount: 1600, due: "1 Feb 2026" },
    payments: [
      { label: "Deposit", amount: 1600, status: "paid", date: "10 Jan 2026" },
      { label: "Balance", amount: 1600, status: "overdue", date: "1 Feb 2026" },
    ],
  },
  {
    name: "Priya Mehta",
    initials: "PM",
    type: "Couture",
    gown: "Embroidered Cape Gown",
    total: 12000,
    paid: 4000,
    status: "on-track",
    nextPayment: { label: "Second Milestone", amount: 4000, due: "15 Apr 2026" },
    payments: [
      { label: "Booking Deposit", amount: 2000, status: "paid", date: "20 Feb 2026" },
      { label: "Fabrication", amount: 2000, status: "paid", date: "18 Mar 2026" },
      { label: "Second Milestone", amount: 4000, status: "upcoming", date: "15 Apr 2026" },
      { label: "Final Balance", amount: 4000, status: "upcoming", date: "10 Jun 2026" },
    ],
  },
  {
    name: "Zara Williams",
    initials: "ZW",
    type: "Ready to Wear",
    gown: "Halter Crepe Sheath",
    total: 2800,
    paid: 2800,
    status: "paid",
    nextPayment: null,
    payments: [
      { label: "Deposit", amount: 1400, status: "paid", date: "5 Mar 2026" },
      { label: "Balance", amount: 1400, status: "paid", date: "12 Mar 2026" },
    ],
  },
];

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  paid:     { label: "Fully Paid",  bg: "#E8F4E8", color: "#3A7A3A", icon: <CheckCircle2 size={12} /> },
  due:      { label: "Payment Due", bg: "#FEF0E0", color: "#C07840", icon: <AlertCircle size={12} /> },
  overdue:  { label: "Overdue",     bg: "#FDE8E8", color: "#C04040", icon: <AlertCircle size={12} /> },
  "on-track": { label: "On Track",  bg: "#F0F0FF", color: "#5050CC", icon: <Clock size={12} /> },
};

export function AdminPaymentsDesktop() {
  const [expanded, setExpanded] = useState<string | null>("Sophie Anderson");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const totalRevenue = brides.reduce((s, b) => s + b.paid, 0);
  const totalOutstanding = brides.reduce((s, b) => s + (b.total - b.paid), 0);
  const overdueCount = brides.filter(b => b.status === "overdue").length;
  const dueCount = brides.filter(b => b.status === "due").length;

  const filtered = brides.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 6px" }}>Payments</h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Revenue overview and per-bride payment tracking</p>
          </div>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Revenue Collected", value: `$${totalRevenue.toLocaleString()}`, sub: "All time", icon: <TrendingUp size={16} color="#D4A373" /> },
              { label: "Outstanding", value: `$${totalOutstanding.toLocaleString()}`, sub: "Across all brides", icon: <Clock size={16} color="#D4A373" /> },
              { label: "Payments Due", value: String(dueCount), sub: "This month", icon: <AlertCircle size={16} color="#E07020" />, warn: true },
              { label: "Overdue", value: String(overdueCount), sub: "Needs follow-up", icon: <AlertCircle size={16} color="#C04040" />, danger: true },
            ].map((kpi, i) => (
              <Card key={i} style={{ background: (kpi as any).danger ? "linear-gradient(135deg,#FDE8E8,#F9D5D5)" : (kpi as any).warn ? "linear-gradient(135deg,#FFF4EC,#FDE8D4)" : "#FFFFFF", border: `1px solid ${(kpi as any).danger ? "#F5C0C0" : (kpi as any).warn ? "#F5D5B0" : "#E8E0D5"}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <CardContent style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: (kpi as any).danger ? "#C04040" : (kpi as any).warn ? "#C07840" : "#D4A373" }}>{kpi.value}</div>
                    {kpi.icon}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 2 }}>{kpi.label}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{kpi.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue chart */}
          <Card style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", marginBottom: 28 }}>
            <CardContent style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C" }}>Monthly Revenue</div>
                  <div style={{ fontSize: 12, color: "#888" }}>2026 — collected payments by month</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#F5EFE9", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 12, color: "#555", cursor: "pointer" }}>
                  2026 <ChevronDown size={13} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 100 }}>
                {months.map((m, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: "100%", background: i === 2 ? "linear-gradient(180deg,#D4A373,#C8956A)" : "#EDE4DA", borderRadius: "4px 4px 0 0", height: `${barHeights[i]}px`, transition: "height 0.3s" }} />
                    <span style={{ fontSize: 10, color: i === 2 ? "#A67C52" : "#AAAAAA", fontWeight: i === 2 ? 600 : 400 }}>{m}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #F0EBE4", paddingTop: 12, marginTop: 12, display: "flex", gap: 24, fontSize: 12, color: "#888" }}>
                <span>Peak month: <strong style={{ color: "#A67C52" }}>Mar — $14,500</strong></span>
                <span>YTD total: <strong style={{ color: "#333" }}>$30,100</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Bride payment list */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>All Brides</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E0D5", borderRadius: 8, padding: "7px 12px" }}>
                <Search size={13} color="#AAAAAA" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bride…" style={{ border: "none", outline: "none", fontSize: 12, color: "#333", background: "transparent", width: 130 }} />
              </div>
              {["All", "due", "overdue", "paid"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 13px", borderRadius: 7, border: `1px solid ${filter === f ? "#333" : "#E8E0D5"}`, background: filter === f ? "#333" : "#fff", color: filter === f ? "#fff" : "#666", fontSize: 11, cursor: "pointer", textTransform: "capitalize" }}>{f === "All" ? "All" : statusConfig[f]?.label ?? f}</button>
              ))}
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", border: "1px solid #E8E0D5", background: "#fff", borderRadius: 7, fontSize: 11, color: "#555", cursor: "pointer" }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 32 }}>
            {filtered.map((bride) => {
              const pct = Math.round((bride.paid / bride.total) * 100);
              const isOpen = expanded === bride.name;
              const cfg = statusConfig[bride.status];

              return (
                <Card key={bride.name} style={{ background: "#FFFFFF", border: `1px solid ${bride.status === "overdue" ? "#F5C0C0" : "#E8E0D5"}`, boxShadow: bride.status === "overdue" ? "0 2px 8px rgba(192,64,64,0.08)" : "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                  <div
                    onClick={() => setExpanded(isOpen ? null : bride.name)}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }}
                  >
                    <Avatar style={{ width: 38, height: 38, border: "1.5px solid #E8D8CE", flexShrink: 0 }}>
                      <AvatarFallback style={{ background: "#E8D8CE", color: "#A67C52", fontSize: 13, fontWeight: 600 }}>{bride.initials}</AvatarFallback>
                    </Avatar>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: "#2C2C2C" }}>{bride.name}</span>
                        <Badge style={{ background: bride.type === "Couture" ? "#F5EFE9" : "#F0F0F0", color: bride.type === "Couture" ? "#A67C52" : "#666", border: "none", fontSize: 9 }}>{bride.type}</Badge>
                      </div>
                      <div style={{ fontSize: 11, color: "#AAA" }}>{bride.gown}</div>
                    </div>

                    <div style={{ width: 120 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888", marginBottom: 4 }}>
                        <span>${bride.paid.toLocaleString()} paid</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ background: "#EDE4DA", borderRadius: 4, height: 5, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: bride.status === "paid" ? "#4CAF50" : "linear-gradient(90deg,#D4A373,#C8956A)", borderRadius: 4 }} />
                      </div>
                    </div>

                    <div style={{ textAlign: "right", width: 80, flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: "#2C2C2C" }}>${bride.total.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: "#AAA" }}>total</div>
                    </div>

                    <div style={{ width: 100, flexShrink: 0 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.color, padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600 }}>
                        {cfg.icon} {cfg.label}
                      </div>
                    </div>

                    <ChevronDown size={16} color="#CCCCCC" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid #F0EBE4", background: "#FDFAF8", padding: "16px 20px 20px" }}>
                      {bride.nextPayment && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: bride.status === "overdue" ? "linear-gradient(135deg,#FDE8E8,#F9D5D5)" : "linear-gradient(135deg,#FFF4EC,#FDE8D4)", borderRadius: 9, marginBottom: 14, border: `1px solid ${bride.status === "overdue" ? "#F5C0C0" : "#F5D5B0"}` }}>
                          <AlertCircle size={16} color={bride.status === "overdue" ? "#C04040" : "#C07840"} />
                          <div style={{ flex: 1, fontSize: 12, color: bride.status === "overdue" ? "#C04040" : "#C07840", fontWeight: 500 }}>
                            {bride.status === "overdue" ? "Overdue — " : "Payment due — "}
                            <strong>{bride.nextPayment.label}</strong> · ${bride.nextPayment.amount.toLocaleString()} · {bride.nextPayment.due}
                          </div>
                          <button style={{ padding: "5px 14px", background: "#333", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Send Reminder</button>
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        {bride.payments.map((pmt, j) => {
                          const pmtStatus = pmt.status as "paid" | "due" | "overdue" | "upcoming";
                          const pmtCfg = { paid: { bg: "#E8F4E8", color: "#3A7A3A", icon: <CheckCircle2 size={11} /> }, due: { bg: "#FEF0E0", color: "#C07840", icon: <AlertCircle size={11} /> }, overdue: { bg: "#FDE8E8", color: "#C04040", icon: <AlertCircle size={11} /> }, upcoming: { bg: "#F3F3F3", color: "#888", icon: <Clock size={11} /> } }[pmtStatus] ?? { bg: "#F3F3F3", color: "#888", icon: null };
                          return (
                            <div key={j} style={{ background: "#fff", border: "1px solid #EEEEEE", borderRadius: 8, padding: "12px 14px" }}>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: pmtCfg.bg, color: pmtCfg.color, padding: "2px 7px", borderRadius: 10, fontSize: 9, fontWeight: 600, marginBottom: 7 }}>
                                {pmtCfg.icon} {pmtStatus.charAt(0).toUpperCase() + pmtStatus.slice(1)}
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 500, color: "#333", marginBottom: 3 }}>{pmt.label}</div>
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#2C2C2C", marginBottom: 3 }}>${pmt.amount.toLocaleString()}</div>
                              <div style={{ fontSize: 10, color: "#AAAAAA" }}>{pmt.date}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
