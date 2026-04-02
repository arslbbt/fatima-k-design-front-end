import { Users, Calendar, DollarSign, TrendingUp, Upload, Plus, ChevronRight, Camera, Clock, Menu, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const coutureBrides = [
  { name: "Sophie Anderson", initials: "SA", stage: "Final Fitting", date: "4 May 2026", balance: "$1,200" },
  { name: "Emma Clarke", initials: "EC", stage: "2nd Fitting", date: "12 Jun 2026", balance: "$2,400" },
  { name: "Mia Chen", initials: "MC", stage: "1st Fitting", date: "28 Aug 2026", balance: "$3,800" },
  { name: "Isabelle Martin", initials: "IM", stage: "Consultation", date: "14 Nov 2026", balance: "$4,000" },
];

const rtwBrides = [
  { name: "Lily Thompson", initials: "LT", stage: "Alterations", date: "2 Apr 2026", balance: "$350" },
  { name: "Grace Kim", initials: "GK", stage: "Ready for Pickup", date: "17 May 2026", balance: "$0" },
  { name: "Hannah Davis", initials: "HD", stage: "Consultation", date: "6 Jul 2026", balance: "$1,200" },
  { name: "Olivia Park", initials: "OP", stage: "Alterations", date: "19 Oct 2026", balance: "$600" },
];

export function AdminDashboardMobile() {
  const [brideTab, setBrideTab] = useState<"couture" | "rtw">("couture");
  const brideList = brideTab === "couture" ? coutureBrides : rtwBrides;

  const appointments = [
    { bride: "Sophie Anderson", type: "Final Fitting", date: "24", month: "Mar", time: "2:00 PM" },
    { bride: "Emma Clarke", type: "2nd Fitting", date: "25", month: "Mar", time: "11:00 AM" },
    { bride: "Mia Chen", type: "1st Fitting", date: "27", month: "Mar", time: "3:30 PM" },
  ];

  return (
    <div style={{ width: 390, minHeight: 844, background: "#FAF8F5", fontFamily: "'DM Sans', sans-serif", color: "#333333" }}>

      {/* ── Site Header ── */}
      <header style={{ background: "#F5EFE9", borderBottom: "1px solid #E8E0D5", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div>
          <img
            src="/fatimak-logo.jpg"
            alt="Fatima K Designs"
            style={{ height: 22, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", display: "block" }}
          />
          <div style={{ fontSize: 8, color: "#AAAAAA", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Admin Portal</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: "1.5px solid #33333340" }}>
            <AvatarFallback style={{ background: "#333333", color: "white", fontSize: 10, fontWeight: 600 }}>FK</AvatarFallback>
          </Avatar>
          <Menu size={22} color="#555555" />
        </div>
      </header>

      {/* ── Page title strip ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E0D5", padding: "10px 20px" }}>
        <div style={{ fontSize: 10, color: "#AAAAAA", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Admin</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", margin: 0, lineHeight: 1 }}>Dashboard</h1>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Stats 2x2 grid ── */}
        <section>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: "0 0 10px", paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: <Users size={16} color="#D4A373" />, label: "Total Brides", value: "12" },
              { icon: <Calendar size={16} color="#D4A373" />, label: "Appts This Week", value: "4" },
              { icon: <DollarSign size={16} color="#D4A373" />, label: "Payments Received", value: "$18,450" },
              { icon: <TrendingUp size={16} color="#D4A373" />, label: "Outstanding", value: "$6,200" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, padding: "14px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick actions ── */}
        <section>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: "0 0 10px", paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: <Plus size={14} />, label: "Add New Bride", primary: true },
              { icon: <Calendar size={14} />, label: "Schedule Appointment" },
              { icon: <CreditCard size={14} />, label: "Record Payment" },
              { icon: <Upload size={14} />, label: "Upload Photos" },
            ].map((a, i) => (
              <button key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 10px", background: a.primary ? "#333333" : "#FFFFFF", color: a.primary ? "white" : "#555555", border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── This week's appointments ── */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>This Week</h2>
            <a href="#" style={{ fontSize: 12, color: "#A67C52", display: "flex", alignItems: "center", gap: 2 }}>View all <ChevronRight size={12} /></a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {appointments.map((appt, i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ background: "#F5EFE9", borderRadius: 8, padding: "6px 10px", textAlign: "center", flexShrink: 0, minWidth: 42 }}>
                  <div style={{ fontSize: 9, color: "#A67C52", fontWeight: 600, textTransform: "uppercase" }}>{appt.month}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#2C2C2C", lineHeight: 1 }}>{appt.date}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>{appt.bride}</div>
                  <div style={{ fontSize: 11, color: "#666666", marginTop: 2 }}>{appt.type}</div>
                  <div style={{ fontSize: 11, color: "#888888", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Clock size={10} color="#D4A373" /> {appt.time}
                  </div>
                </div>
                <button style={{ background: "#F5EFE9", border: "1px solid #E8E0D5", borderRadius: 6, padding: "6px 12px", fontSize: 11, color: "#A67C52", cursor: "pointer", whiteSpace: "nowrap" }}>
                  View
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── All Brides (tabbed) ── */}
        <section>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>All Brides</h2>
            <a href="#" style={{ fontSize: 12, color: "#A67C52", display: "flex", alignItems: "center", gap: 2 }}>View all <ChevronRight size={12} /></a>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#F5EFE9", border: "1px solid #E8E0D5", borderRadius: 10, padding: 4, gap: 4, marginBottom: 10 }}>
            {(["couture", "rtw"] as const).map((t) => {
              const active = brideTab === t;
              const label = t === "couture" ? "✦  Couture" : "◆  Ready to Wear";
              const count = t === "couture" ? coutureBrides.length : rtwBrides.length;
              return (
                <button
                  key={t}
                  onClick={() => setBrideTab(t)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 6px", borderRadius: 7, border: "none", cursor: "pointer", background: active ? "#FFFFFF" : "transparent", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}
                >
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "#2C2C2C" : "#888888" }}>{label}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, background: active ? (t === "couture" ? "#D4A373" : "#555555") : "#E0D8D0", color: active ? "#fff" : "#888", borderRadius: 10, padding: "1px 8px" }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Context label */}
          <div style={{ background: brideTab === "couture" ? "linear-gradient(135deg, #F0E4D8, #EAD9CC)" : "#F5F5F5", border: `1px solid ${brideTab === "couture" ? "#E8D0C0" : "#E0E0E0"}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: brideTab === "couture" ? "#A67C52" : "#666666", marginBottom: 10 }}>
            {brideTab === "couture" ? "Bespoke gowns — designed and made to measure" : "Selected styles with alterations and fitting service"}
          </div>

          {/* Bride cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {brideList.map((bride, i) => (
              <div key={`${brideTab}-${i}`} style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Avatar style={{ width: 38, height: 38, border: "1.5px solid #E8D8CE", flexShrink: 0 }}>
                    <AvatarFallback style={{ background: "#E8D8CE", color: "#A67C52", fontSize: 12, fontWeight: 600 }}>{bride.initials}</AvatarFallback>
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>{bride.name}</div>
                      <span style={{ fontSize: 11, color: bride.balance === "$0" ? "#888888" : "#B87A4F", fontWeight: 600 }}>{bride.balance === "$0" ? "Paid" : bride.balance}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <Badge style={{ background: "#E8D8CE", color: "#A67C52", border: "none", fontSize: 9, padding: "1px 6px" }}>{bride.stage}</Badge>
                      <span style={{ fontSize: 10, color: "#888888" }}>{bride.date}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid #F0EBE4" }}>
                  <button style={{ flex: 1, padding: "7px", background: "#333333", color: "white", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>View Profile</button>
                  <button style={{ flex: 1, padding: "7px", background: "#F5EFE9", color: "#A67C52", border: "1px solid #E8E0D5", borderRadius: 6, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <Camera size={11} /> Upload Photos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        <section style={{ paddingBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: "0 0 10px", paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>Recent Activity</h2>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {[
              { text: "Uploaded fitting photos for Sophie Anderson", time: "2h ago" },
              { text: "Payment recorded: Emma Clarke $800", time: "1d ago" },
              { text: "Appointment scheduled: Mia Chen Final Fitting", time: "2d ago" },
              { text: "New bride added: Isabelle Martin", time: "3d ago" },
            ].map((item, i, arr) => (
              <div key={i} style={{ padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F0EBE4" : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A373", marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#333333", lineHeight: 1.4 }}>{item.text}</div>
                  <div style={{ fontSize: 10, color: "#AAAAAA", marginTop: 3 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Site footer ── */}
      <footer style={{ borderTop: "1px solid #E8E0D5", background: "#F5EFE9", padding: "16px 20px", textAlign: "center" }}>
        <img
          src="/fatimak-logo.jpg"
          alt="Fatima K Designs"
          style={{ height: 20, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 6 }}
        />
        <div style={{ fontSize: 10, color: "#AAAAAA", letterSpacing: "0.06em" }}>© 2026 Fatima K Designs Australia</div>
      </footer>

    </div>
  );
}
