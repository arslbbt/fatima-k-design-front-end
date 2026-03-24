import { useState } from "react";
import {
  Search, Plus, Calendar, CreditCard, FileText,
  Filter, ChevronRight, Heart
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";

const allBrides = [
  {
    id: 1, name: "Sophie Anderson", initials: "SA", type: "Couture",
    gown: "Chantilly Lace Bias-Cut", weddingDate: "4 May 2026",
    stage: "Final Fitting", stageNum: 4, totalStages: 5,
    totalAmt: 10000, paid: 8800, outstanding: 1200, color: "#E8D8CE",
    accentColor: "#A67C52", location: "Paddington Studio",
    nextAppt: "Tue 24 Mar · 2:00 PM",
  },
  {
    id: 2, name: "Chloe Mitchell", initials: "CM", type: "Couture",
    gown: "Silk Duchess Strapless", weddingDate: "18 Jun 2026",
    stage: "2nd Fitting", stageNum: 3, totalStages: 5,
    totalAmt: 12000, paid: 10000, outstanding: 2000, color: "#DDD0C0",
    accentColor: "#8A6840", location: "Paddington Studio",
    nextAppt: "Wed 25 Mar · 10:00 AM",
  },
  {
    id: 3, name: "Isabella Davis", initials: "ID", type: "Couture",
    gown: "Mikado Ball Gown", weddingDate: "2 Sep 2026",
    stage: "1st Fitting", stageNum: 2, totalStages: 5,
    totalAmt: 9500, paid: 9500, outstanding: 0, color: "#F0E4D8",
    accentColor: "#A67C52", location: "Paddington Studio",
    nextAppt: "Thu 26 Mar · 1:30 PM",
  },
  {
    id: 4, name: "Mia Chen", initials: "MC", type: "Couture",
    gown: "Silk Satin Cape Gown", weddingDate: "14 Oct 2026",
    stage: "Consultation", stageNum: 1, totalStages: 5,
    totalAmt: 11500, paid: 8000, outstanding: 3500, color: "#E0D4C8",
    accentColor: "#8A6840", location: "Rose Bay Studio",
    nextAppt: "Fri 27 Mar · 3:30 PM",
  },
  {
    id: 5, name: "Emma Clarke", initials: "EC", type: "Couture",
    gown: "Lace Sleeve Mermaid", weddingDate: "22 Nov 2026",
    stage: "2nd Fitting", stageNum: 3, totalStages: 5,
    totalAmt: 13500, paid: 13500, outstanding: 0, color: "#F5EFE9",
    accentColor: "#A67C52", location: "Paddington Studio",
    nextAppt: "Tue 24 Mar · 4:00 PM",
  },
  {
    id: 6, name: "Priya Mehta", initials: "PM", type: "Ready to Wear",
    gown: "The Elara (RTW)", weddingDate: "7 Aug 2026",
    stage: "Alteration", stageNum: 2, totalStages: 3,
    totalAmt: 4200, paid: 4200, outstanding: 0, color: "#DDD0C0",
    accentColor: "#8A6840", location: "Rose Bay Studio",
    nextAppt: "Mon 30 Mar · 11:00 AM",
  },
  {
    id: 7, name: "Zara Williams", initials: "ZW", type: "Ready to Wear",
    gown: "The Seraphine (RTW)", weddingDate: "12 Apr 2026",
    stage: "Collection Ready", stageNum: 3, totalStages: 3,
    totalAmt: 3800, paid: 3800, outstanding: 0, color: "#F0E4D8",
    accentColor: "#A67C52", location: "Paddington Studio",
    nextAppt: null,
  },
  {
    id: 8, name: "Natalie Russo", initials: "NR", type: "Ready to Wear",
    gown: "The Vivienne (RTW)", weddingDate: "28 Jun 2026",
    stage: "Alteration", stageNum: 2, totalStages: 3,
    totalAmt: 5100, paid: 2550, outstanding: 2550, color: "#E8D8CE",
    accentColor: "#A67C52", location: "Rose Bay Studio",
    nextAppt: "Wed 25 Mar · 2:30 PM",
  },
  {
    id: 9, name: "Olivia Park", initials: "OP", type: "Ready to Wear",
    gown: "The Celestine (RTW)", weddingDate: "19 Sep 2026",
    stage: "Consultation", stageNum: 1, totalStages: 3,
    totalAmt: 4600, paid: 0, outstanding: 4600, color: "#DDD0C0",
    accentColor: "#8A6840", location: "Paddington Studio",
    nextAppt: "Tue 31 Mar · 10:00 AM",
  },
];

const stageFilters = ["All Stages", "Consultation", "1st Fitting", "2nd Fitting", "Final Fitting", "Alteration", "Collection Ready"];

export function AdminAllBrides() {
  const [search, setSearch] = useState("");
  const [typeTab, setTypeTab] = useState<"all" | "couture" | "rtw">("all");
  const [stageFilter, setStageFilter] = useState("All Stages");

  const filtered = allBrides.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.gown.toLowerCase().includes(search.toLowerCase());
    const matchType = typeTab === "all" || (typeTab === "couture" && b.type === "Couture") || (typeTab === "rtw" && b.type === "Ready to Wear");
    const matchStage = stageFilter === "All Stages" || b.stage === stageFilter;
    return matchSearch && matchType && matchStage;
  });

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: "#2C2C2C", margin: "0 0 4px" }}>All Brides</h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{allBrides.length} brides · {allBrides.filter(b => b.outstanding > 0).length} with outstanding balance</p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#2C2C2C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={15} /> New Bride
            </button>
          </div>

          {/* Search + type tabs */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={15} color="#AAA" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or gown…"
                style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: "1px solid #E8E0D5", borderRadius: 8, fontSize: 13, background: "#fff", color: "#333", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "couture", "rtw"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeTab(t)}
                  style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${typeTab === t ? "#D4A373" : "#E8E0D5"}`, background: typeTab === t ? "#F5EFE9" : "#fff", color: typeTab === t ? "#A67C52" : "#666", fontSize: 13, fontWeight: typeTab === t ? 600 : 400, cursor: "pointer" }}
                >
                  {t === "all" ? "All" : t === "couture" ? "✦ Couture" : "◇ Ready to Wear"}
                </button>
              ))}
            </div>
          </div>

          {/* Stage filter pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            <Filter size={13} color="#AAA" />
            {stageFilters.map(s => (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${stageFilter === s ? "#A67C52" : "#E8E0D5"}`, background: stageFilter === s ? "#E8D8CE" : "transparent", color: stageFilter === s ? "#7A5C3A" : "#888", fontSize: 11, fontWeight: stageFilter === s ? 600 : 400, cursor: "pointer" }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Results count */}
          {(search || stageFilter !== "All Stages" || typeTab !== "all") && (
            <div style={{ fontSize: 12, color: "#AAA", marginBottom: 16 }}>
              Showing {filtered.length} of {allBrides.length} brides
            </div>
          )}

          {/* Bride grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.map(bride => (
              <BrideCard key={bride.id} bride={bride} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#AAA" }}>
              <Search size={32} color="#DDD" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: 14 }}>No brides match your filters</div>
              <button onClick={() => { setSearch(""); setTypeTab("all"); setStageFilter("All Stages"); }} style={{ marginTop: 12, fontSize: 12, color: "#A67C52", background: "none", border: "none", cursor: "pointer" }}>Clear all filters</button>
            </div>
          )}

        </div>
      </main>
    </AdminLayout>
  );
}

function BrideCard({ bride }: { bride: typeof allBrides[0] }) {
  const progressPct = Math.round((bride.stageNum / bride.totalStages) * 100);

  return (
    <Card style={{ background: "#fff", border: "1px solid #E8E0D5", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", overflow: "hidden" }}>
      {/* Top accent strip */}
      <div style={{ height: 3, background: bride.outstanding > 0 ? "#D4A373" : "#B8D4B0" }} />
      <CardContent style={{ padding: "20px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Avatar style={{ width: 48, height: 48, flexShrink: 0, border: `2px solid ${bride.color}` }}>
            <AvatarFallback style={{ background: bride.color, color: bride.accentColor, fontSize: 14, fontWeight: 700 }}>{bride.initials}</AvatarFallback>
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#2C2C2C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bride.name}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bride.gown}</div>
          </div>
          <Badge style={{ flexShrink: 0, fontSize: 9, padding: "3px 8px", background: bride.type === "Couture" ? "#FAF0E6" : "#F0F0F0", color: bride.type === "Couture" ? "#A67C52" : "#666", border: bride.type === "Couture" ? "1px solid #E8D0B0" : "1px solid #E0E0E0", borderRadius: 20, fontWeight: 600 }}>
            {bride.type === "Couture" ? "✦ Couture" : "◇ RTW"}
          </Badge>
        </div>

        {/* Stage progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>{bride.stage}</span>
            <span style={{ fontSize: 10, color: "#AAA" }}>{bride.stageNum}/{bride.totalStages}</span>
          </div>
          <div style={{ height: 4, background: "#F0EAE2", borderRadius: 4 }}>
            <div style={{ height: 4, borderRadius: 4, background: "#D4A373", width: `${progressPct}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 9, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Wedding</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#444", display: "flex", alignItems: "center", gap: 4 }}>
              <Heart size={10} fill="#D4A373" color="#D4A373" /> {bride.weddingDate}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Balance</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: bride.outstanding > 0 ? "#D4A373" : "#5A9E6E" }}>
              {bride.outstanding > 0 ? `$${bride.outstanding.toLocaleString()} due` : "Paid in full"}
            </div>
          </div>
          {bride.nextAppt && (
            <div>
              <div style={{ fontSize: 9, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Next Appt</div>
              <div style={{ fontSize: 11, color: "#555" }}>{bride.nextAppt}</div>
            </div>
          )}
        </div>

        {/* Quick action links */}
        <div style={{ display: "flex", gap: 8, paddingTop: 14, borderTop: "1px solid #F0EAE2" }}>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 8px", background: "#2C2C2C", color: "#fff", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
            View Profile <ChevronRight size={12} />
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 10px", background: "transparent", color: "#888", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 11, cursor: "pointer" }}>
            <Calendar size={12} />
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 10px", background: "transparent", color: "#888", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 11, cursor: "pointer" }}>
            <CreditCard size={12} />
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 10px", background: "transparent", color: "#888", border: "1px solid #E8E0D5", borderRadius: 7, fontSize: 11, cursor: "pointer" }}>
            <FileText size={12} />
          </button>
        </div>

      </CardContent>
    </Card>
  );
}
