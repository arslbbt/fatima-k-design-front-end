import { useState } from "react";
import { useLocation } from "wouter";
import {
  Users,
  Calendar,
  CreditCard,
  Upload,
  Plus,
  DollarSign,
  Camera,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminLayout } from "@/components/AdminLayout";
import { AddBrideModal } from "@/components/AddBrideModal";
import { BrideProfileModal } from "@/components/BrideProfileModal";
import { useQuery } from "@tanstack/react-query";
import {
  adminApi,
  bridesApi,
  APPOINTMENT_TITLE_LABELS,
  BRIDE_STAGE_LABELS,
  type BrideWithProfile,
} from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

// ── helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1} min${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    weekday: "short", // Mon, Tue
    day: "numeric", // 2
    month: "short", // Apr
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtDayShort(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-AU", { weekday: "short" }),
    date: d.getDate(),
  };
}

function fmtWeddingDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [, navigate] = useLocation();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewBride, setViewBride] = useState<BrideWithProfile | null>(null);
  const [brideTypeFilter, setBrideTypeFilter] = useState<
    "CUSTOM" | "READY_TO_WEAR"
  >("CUSTOM");

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminApi.dashboard(),
    refetchOnWindowFocus: false,
  });

  // For BrideProfileModal we need full BrideWithProfile — fetch on demand
  const [selectedBrideId, setSelectedBrideId] = useState<string | null>(null);
  const { data: fullBride } = useQuery({
    queryKey: ["bride", selectedBrideId],
    queryFn: () => bridesApi.get(selectedBrideId!),
    enabled: !!selectedBrideId,
  });

  // When full bride data arrives, open modal
  const handleViewBride = (id: string) => {
    setSelectedBrideId(id);
  };

  // Sync fullBride into viewBride state
  if (fullBride && fullBride.id === selectedBrideId && !viewBride) {
    setViewBride(fullBride);
  }

  const handleCloseModal = () => {
    setViewBride(null);
    setSelectedBrideId(null);
  };

  return (
    <AdminLayout>
      <main className="flex-1 overflow-auto bp-page-main">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page header */}
          <div className="flex justify-between items-end">
            <h1 className="text-3xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
              Dashboard
            </h1>
            <Button
              onClick={() => setAddModalOpen(true)}
              className="cursor-pointer bg-[#333333] text-white hover:bg-[#222222] font-normal shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Bride
            </Button>
          </div>

          {/* Stat Cards */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-[#D4A373]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Brides */}
              <Card
                className="bg-white border-[#E8E0D5] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/admin/brides")}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">
                      Total Brides
                    </span>
                    <Users className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <div className="text-3xl font-['Cormorant_Garamond'] font-medium">
                    {data?.totalBrides ?? 0}
                  </div>
                  {(data?.newBridesThisMonth ?? 0) > 0 ? (
                    <span className="text-xs text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded w-fit">
                      +{data!.newBridesThisMonth} this month
                    </span>
                  ) : (
                    <span className="text-xs text-[#888888]">
                      No new brides this month
                    </span>
                  )}
                </CardContent>
              </Card>

              {/* Appts This Week */}
              <Card
                className="bg-white border-[#E8E0D5] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/admin/appointments")}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">
                      Appts This Week
                    </span>
                    <Calendar className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <div className="text-3xl font-['Cormorant_Garamond'] font-medium">
                    {data?.weekApptsCount ?? 0}
                  </div>
                  {data?.nextAppt ? (
                    <span className="text-xs text-[#888888]">
                      Next: {fmtTime(data.nextAppt.startTime)}
                    </span>
                  ) : (
                    <span className="text-xs text-[#888888]">
                      No upcoming appointments
                    </span>
                  )}
                </CardContent>
              </Card>

              {/* Payments Received */}
              <Card
                className="bg-white border-[#E8E0D5] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/admin/payments")}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">
                      Payments Rec'd
                    </span>
                    <DollarSign className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <div className="text-3xl font-['Cormorant_Garamond'] font-medium">
                    ${(data?.paidThisMonth ?? 0).toLocaleString()}
                  </div>
                  <span className="text-xs text-[#888888]">
                    This month (converted)
                  </span>
                </CardContent>
              </Card>

              {/* Outstanding */}
              <Card
                className="bg-white border-[#E8E0D5] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/admin/payments")}
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">
                      Outstanding
                    </span>
                    <CreditCard className="w-4 h-4 text-[#B87A4F]" />
                  </div>
                  <div className="text-3xl font-['Cormorant_Garamond'] font-medium text-[#B87A4F]">
                    ${(data?.outstanding ?? 0).toLocaleString()}
                  </div>
                  <span className="text-xs text-[#888888]">
                    Across {data?.outstandingBridesCount ?? 0} bride
                    {(data?.outstandingBridesCount ?? 0) !== 1 ? "s" : ""} (converted)
                  </span>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Brides Table */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E0D5] pb-2">
                <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
                  All Brides{" "}
                  <span className="text-sm text-[#888888]">
                    (coming up weddings)
                  </span>
                </h2>
                <button
                  onClick={() => navigate("/admin/brides")}
                  className="text-sm text-[#A67C52] hover:underline cursor-pointer"
                >
                  View all
                </button>
              </div>

              {/* Bride Type Tabs Container - matches table width */}
              <div className="bg-[#F5EFE9] w-full rounded-lg p-1 flex justify-around items-center ">
                <button
                  onClick={() => setBrideTypeFilter("CUSTOM")}
                  className={`w-full flex items-center justify-center text-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all ${
                    brideTypeFilter === "CUSTOM"
                      ? "bg-white text-[#333333] shadow-sm"
                      : "bg-transparent text-[#999999] hover:text-[#666666]"
                  }`}
                >
                  <span className="text-base">✦</span>
                  Custom Brides
                  {brideTypeFilter === "CUSTOM" && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#D4A373] text-white text-xs font-semibold">
                      {
                        (data?.brides ?? []).filter(
                          (b) => b.brideProfile?.brideType === "CUSTOM",
                        ).length
                      }
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setBrideTypeFilter("READY_TO_WEAR")}
                  className={`w-full flex items-center justify-center text-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                    brideTypeFilter === "READY_TO_WEAR"
                      ? "bg-white text-[#333333] shadow-sm"
                      : "bg-transparent text-[#999999] hover:text-[#666666]"
                  }`}
                >
                  <span className="text-base">◇</span>
                  Ready to Wear
                  {brideTypeFilter === "READY_TO_WEAR" && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-[#999999] text-white text-xs font-semibold">
                      {
                        (data?.brides ?? []).filter(
                          (b) => b.brideProfile?.brideType === "READY_TO_WEAR",
                        ).length
                      }
                    </span>
                  )}
                </button>
              </div>

              <Card className="bg-white border-[#E8E0D5] shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2
                      size={20}
                      className="animate-spin text-[#D4A373]"
                    />
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-[#FAF8F5]">
                      <TableRow className="border-[#E8E0D5]">
                        <TableHead className="text-[#888888] font-medium">
                          Name
                        </TableHead>
                        <TableHead className="text-[#888888] font-medium">
                          Wedding Date
                        </TableHead>
                        <TableHead className="text-[#888888] font-medium">
                          Stage
                        </TableHead>
                        <TableHead className="text-[#888888] font-medium">
                          Balance
                        </TableHead>
                        <TableHead className="text-right text-[#888888] font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const filteredBrides = (data?.brides ?? []).filter(
                          (b) => b.brideProfile?.brideType === brideTypeFilter,
                        );

                        return filteredBrides.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-[#AAAAAA] py-8"
                            >
                              No brides in this category
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBrides.map((bride) => (
                            <TableRow
                              key={bride.id}
                              className="border-[#E8E0D5]"
                            >
                              <TableCell className="font-medium text-[#333333]">
                                {bride.name}
                              </TableCell>
                              <TableCell className="text-[#666666] text-sm">
                                {fmtWeddingDate(
                                  bride.brideProfile?.weddingDate,
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-[#FAF8F5] text-[#555555] border-[#E8E0D5] font-normal"
                                >
                                  {bride.brideProfile?.stage
                                    ? BRIDE_STAGE_LABELS[
                                        bride.brideProfile.stage
                                      ]
                                    : "—"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={
                                    bride.hasDue
                                      ? "text-[#B87A4F] font-medium"
                                      : "text-[#888888]"
                                  }
                                >
                                  {bride.balance.toLocaleString()}{" "}
                                  {bride.currency}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#A67C52] hover:bg-[#FAF8F5] hover:text-[#A67C52] cursor-pointer"
                                    onClick={() => navigate("/admin/fittings")}
                                    title="Fitting Photos"
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-[#E8E0D5] text-[#555555] font-normal cursor-pointer"
                                    onClick={() => handleViewBride(bride.id)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        );
                      })()}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </div>

            {/* This Week's Appointments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E0D5] pb-2">
                <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
                  This Week's Appts
                </h2>
                <button
                  onClick={() => navigate("/admin/appointments")}
                  className="text-sm text-[#A67C52] hover:underline cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#D4A373]"
                    />
                  </div>
                ) : (data?.weekAppts ?? []).length === 0 ? (
                  <div className="text-sm text-[#AAAAAA] text-center py-6">
                    No appointments this week
                  </div>
                ) : (
                  (data?.weekAppts ?? []).map((appt) => {
                    const { day, date } = fmtDayShort(appt.startTime);
                    return (
                      <Card
                        key={appt.id}
                        className="bg-white border-[#E8E0D5] shadow-sm"
                      >
                        <CardContent className="p-4 flex gap-3">
                          <div className="flex flex-col items-center justify-center w-12 shrink-0 border-r border-[#E8E0D5] pr-3">
                            <span className="text-[10px] uppercase font-semibold text-[#888888]">
                              {day}
                            </span>
                            <span className="text-lg font-['Cormorant_Garamond'] font-medium text-[#333333]">
                              {date}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-[#333333] truncate">
                                {appt.brideName}
                              </h4>
                              <div className="w-2 h-2 rounded-full mt-1.5 bg-[#D4A373] shrink-0 ml-1" />
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-[#666666]">
                                {APPOINTMENT_TITLE_LABELS[appt.title] ??
                                  appt.title}
                              </span>
                              <span className="text-xs font-medium text-[#A67C52]">
                                {fmtTime(appt.startTime)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C] border-b border-[#E8E0D5] pb-2">
                Recent Activity
              </h2>
              <Card className="bg-white border-[#E8E0D5] shadow-sm">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2
                        size={18}
                        className="animate-spin text-[#D4A373]"
                      />
                    </div>
                  ) : (data?.recentActivity ?? []).length === 0 ? (
                    <div className="text-sm text-[#AAAAAA] text-center py-8">
                      No recent activity
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E8E0D5]">
                      {(data?.recentActivity ?? []).map((item, i) => (
                        <div key={i} className="p-4 flex gap-4">
                          <div
                            className={`mt-1 max-h-8 p-2 rounded-full shrink-0 ${
                              item.type === "photo"
                                ? "bg-[#F5EFE9] text-[#A67C52]"
                                : item.type === "payment"
                                  ? "bg-[#F5EFE9] text-[#22C55E]"
                                  : "bg-[#F5EFE9] text-[#333333]"
                            }`}
                          >
                            {item.type === "photo" ? (
                              <Camera size={14} />
                            ) : item.type === "payment" ? (
                              <DollarSign size={14} />
                            ) : (
                              <Calendar size={14} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-[#333333]">
                              {item.label} for{" "}
                              <span className="font-medium">
                                {item.brideName}
                              </span>
                            </p>
                            <span className="text-xs text-[#888888] flex items-center gap-1 mt-1">
                              <Clock size={10} /> {timeAgo(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C] border-b border-[#E8E0D5] pb-2">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4 ">
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]"
                >
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52] ">
                    <Users size={20} />
                  </div>
                  <span className="text-sm font-medium ">Add New Bride</span>
                </button>

                <button
                  onClick={() => navigate("/admin/appointments")}
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]"
                >
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <Calendar size={20} />
                  </div>
                  <span className="text-sm font-medium">Schedule Appt</span>
                </button>

                <button
                  onClick={() => navigate("/admin/payments")}
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]"
                >
                  <div className="bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <DollarSign size={20} />
                  </div>
                  <span className="text-sm font-medium">Record Payment</span>
                </button>

                <button
                  onClick={() => navigate("/admin/fittings")}
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-[#E8E0D5] bg-white hover:bg-[#FAF8F5] transition-colors shadow-sm text-[#333333]"
                >
                  <div className=" bg-[#E8D8CE]/50 p-3 rounded-full text-[#A67C52]">
                    <Upload size={20} />
                  </div>
                  <span className="text-sm font-medium">Upload Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddBrideModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <BrideProfileModal bride={viewBride} onClose={handleCloseModal} />
    </AdminLayout>
  );
}
