import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  TrendingUp,
  Search,
  PlusCircle,
  FileText,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi, ApiError, APPOINTMENT_TITLE_LABELS } from "@/lib/api";
import type { Payment, AppointmentTitle } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";
import { Pagination } from "@/components/ui/Pagination";
import { CreatePaymentModal } from "./CreatePaymentModal";
import { PaymentReceiptModal } from "./PaymentReceiptModal";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<
  string,
  { label: string; bg: string; color: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Fully Paid",
    bg: "#E8F4E8",
    color: "#3A7A3A",
    icon: <CheckCircle2 size={12} />,
  },
  due: {
    label: "Payment Due",
    bg: "#FEF0E0",
    color: "#C07840",
    icon: <AlertCircle size={12} />,
  },
  overdue: {
    label: "Overdue",
    bg: "#FDE8E8",
    color: "#C04040",
    icon: <AlertCircle size={12} />,
  },
  "on-track": {
    label: "On Track",
    bg: "#E8F4E8",
    color: "#3A7A3A",
    icon: <CheckCircle2 size={12} />,
  },
};

// Common payment stages that most brides go through
const COMMON_PAYMENT_STEPS: AppointmentTitle[] = [
  "CONSULTATION",
  "MEASUREMENTS",
  "GOWN_IN_FABRIC",
  "COLLECTION_READY",
];

export function AdminPaymentsDesktop() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [receiptBride, setReceiptBride] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [editPayment, setEditPayment] = useState<any | null>(null);
  const [confirmDeletePaymentId, setConfirmDeletePaymentId] = useState<
    string | null
  >(null);

  const { data: overview } = useQuery({
    queryKey: ["payments", "revenue"],
    queryFn: () => paymentsApi.getRevenueOverview(),
  });

  const { data: monthlyRevenue } = useQuery({
    queryKey: ["payments", "monthly", chartYear],
    queryFn: () => paymentsApi.getMonthlyRevenue(chartYear),
  });

  const { data: bridesData, isLoading } = useQuery({
    queryKey: ["payments", "brides-tracking", page, search, filter],
    queryFn: () =>
      paymentsApi.listBridesTracking({
        page,
        limit: 5,
        search: search || undefined,
        status: filter === "All" ? undefined : filter.toLowerCase(),
      }),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  const remindMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.sendReminder(id),
    onSuccess: () => toast({ title: "Reminder sent" }),
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Failed to send reminder.",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast({ title: "Payment deleted" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  const peakMonthObj = monthlyRevenue?.reduce(
    (max, current) => (current.amount > max.amount ? current : max),
    { name: "", amount: 0 },
  );
  const ytdTotal =
    monthlyRevenue?.reduce((sum, current) => sum + current.amount, 0) || 0;

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 36,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 6px",
                }}
              >
                Payments
              </h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                Revenue overview and per-bride payment tracking
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                background: "#333",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <PlusCircle size={18} /> Create{" "}
              <span className="hidden sm:block">Payment</span>
            </button>
          </div>

          <div className="payments-kpi-grid">
            {[
              {
                label: "Revenue Collected",
                value: `$${(overview?.revenueCollected || 0).toLocaleString()}`,
                sub: "All time",
                icon: <TrendingUp size={18} color="#D4A373" />,
              },
              {
                label: "Outstanding",
                value: `$${(overview?.outstanding || 0).toLocaleString()}`,
                sub: "Across all brides",
                icon: <Clock size={18} color="#D4A373" />,
              },
              {
                label: "Payments Due",
                value: String(overview?.paymentsDue || 0),
                sub: "This month",
                icon: <AlertCircle size={18} color="#C07840" />,
                warn: true,
              },
              {
                label: "Overdue",
                value: String(overview?.overdueCount || 0),
                sub: "Needs follow-up",
                icon: <AlertCircle size={18} color="#C04040" />,
                danger: true,
              },
            ].map((kpi, i) => (
              <Card
                key={i}
                style={{
                  background: (kpi as any).danger
                    ? "#FFF5F5"
                    : (kpi as any).warn
                      ? "#FFF9F4"
                      : "#FFFFFF",
                  border: `1px solid ${(kpi as any).danger ? "#FBD5D5" : (kpi as any).warn ? "#F9E2D2" : "#E8E0D5"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <CardContent style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 28,
                        fontWeight: 500,
                        color: (kpi as any).danger
                          ? "#C04040"
                          : (kpi as any).warn
                            ? "#C07840"
                            : "#2C2C2C",
                      }}
                    >
                      {kpi.value}
                    </div>
                    <div
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        background: (kpi as any).danger
                          ? "#FEE2E2"
                          : (kpi as any).warn
                            ? "#FFEDD5"
                            : "#F5EFE9",
                      }}
                    >
                      {kpi.icon}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#333",
                      marginBottom: 2,
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{kpi.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E0D5",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
              marginBottom: 32,
              overflow: "hidden",
            }}
          >
            <CardContent style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#2C2C2C",
                    }}
                  >
                    Monthly Revenue
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {chartYear} — collected payments by month
                  </div>
                </div>
                <select
                  value={chartYear}
                  onChange={(e) => setChartYear(parseInt(e.target.value))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #E8E0D5",
                    fontSize: 13,
                    outline: "none",
                    cursor: "pointer",
                    background: "#F9F9F9",
                  }}
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="monthly-revenue-chart-wrapper"
                style={{
                  overflowX: "auto",
                  overflowY: "visible",
                  marginLeft: -24,
                  marginRight: -24,
                  paddingLeft: 24,
                  paddingRight: 24,
                }}
              >
                <div
                  className="monthly-revenue-chart"
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-end",
                    height: 120,
                    paddingBottom: 10,
                    position: "relative",
                    minWidth: "600px",
                  }}
                >
                  {monthlyRevenue?.map((m, i) => {
                    const maxVal =
                      Math.max(...monthlyRevenue.map((d) => d.amount)) || 1;
                    const height = (m.amount / maxVal) * 100;
                    return (
                      <div
                        key={i}
                        title={
                          m.amount > 0
                            ? `$${m.amount.toLocaleString()}`
                            : "No revenue"
                        }
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                          position: "relative",
                          cursor: m.amount > 0 ? "default" : "default",
                        }}
                        onMouseEnter={(e) => {
                          if (m.amount > 0) {
                            const tip =
                              e.currentTarget.querySelector<HTMLElement>(
                                ".bar-tip",
                              );
                            if (tip) tip.style.opacity = "1";
                          }
                        }}
                        onMouseLeave={(e) => {
                          const tip =
                            e.currentTarget.querySelector<HTMLElement>(
                              ".bar-tip",
                            );
                          if (tip) tip.style.opacity = "0";
                        }}
                      >
                        {/* Tooltip */}
                        {m.amount > 0 && (
                          <div
                            className="bar-tip"
                            style={{
                              position: "absolute",
                              bottom: "calc(100% - 20px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "#2C2C2C",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "4px 8px",
                              borderRadius: 6,
                              whiteSpace: "nowrap",
                              opacity: 0,
                              transition: "opacity 0.15s",
                              pointerEvents: "none",
                              zIndex: 10,
                            }}
                          >
                            ${m.amount.toLocaleString()}
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "4px solid transparent",
                                borderRight: "4px solid transparent",
                                borderTop: "4px solid #2C2C2C",
                              }}
                            />
                          </div>
                        )}
                        <div
                          style={{
                            width: "100%",
                            background:
                              m.amount > 0
                                ? "linear-gradient(180deg,#D4A373,#C8956A)"
                                : "#F0EBE4",
                            borderRadius: "4px 4px 0 0",
                            height: `${Math.max(height, 4)}px`,
                            transition: "height 0.4s ease-out",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            color: m.amount > 0 ? "#8B6F5A" : "#AAAAAA",
                            fontWeight: m.amount > 0 ? 600 : 400,
                          }}
                        >
                          {m.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid #F0EBE4",
                  paddingTop: 16,
                  marginTop: 12,
                  display: "flex",
                  gap: 32,
                  fontSize: 13,
                  color: "#666",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  Peak month:{" "}
                  <strong style={{ color: "#D4A373" }}>
                    {peakMonthObj?.name} — $
                    {peakMonthObj?.amount.toLocaleString()}
                  </strong>
                </span>
                <span>
                  YTD total:{" "}
                  <strong style={{ color: "#333" }}>
                    ${ytdTotal.toLocaleString()}
                  </strong>
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="payments-filters-header">
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: 0,
              }}
            >
              All Brides
            </h2>
            <div className="payments-filters-controls">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  padding: "8px 16px",
                }}
              >
                <Search size={14} color="#AAAAAA" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search bride…"
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: 13,
                    color: "#333",
                    background: "transparent",
                    width: 160,
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["All", "Due", "Overdue", "Paid"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setPage(1);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: `1px solid ${filter === f ? "#333" : "#E8E0D5"}`,
                      background: filter === f ? "#333" : "#fff",
                      color: filter === f ? "#fff" : "#666",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingBottom: 40,
            }}
          >
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 60,
                }}
              >
                <Loader2 size={24} className="animate-spin" color="#D4A373" />
              </div>
            ) : !bridesData || bridesData.items.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "#888",
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px dashed #E8E0D5",
                }}
              >
                No brides found
              </div>
            ) : (
              bridesData.items.map((bride: any) => {
                const isOpen = expandedId === bride.id;
                const cfg = statusConfig[bride.status] || statusConfig.due;
                const progress =
                  bride.total > 0
                    ? Math.round((bride.paid / bride.total) * 100)
                    : 0;

                return (
                  <Card
                    key={bride.id}
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${bride.status === "overdue" ? "#F5C0C0" : "#E8E0D5"}`,
                      boxShadow:
                        bride.status === "overdue"
                          ? "0 4px 12px rgba(192,64,64,0.06)"
                          : "0 2px 6px rgba(0,0,0,0.02)",
                      overflow: "visible",
                      transition: "all 0.3s",
                    }}
                  >
                    <div
                      onClick={() => setExpandedId(isOpen ? null : bride.id)}
                      className="bride-card-header"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        flexWrap: "wrap",
                        padding: "16px 20px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <Avatar
                        style={{
                          width: 40,
                          height: 40,
                          border: "1.5px solid #F5EFE9",
                          flexShrink: 0,
                        }}
                      >
                        <AvatarFallback
                          style={{
                            background: "#F5EFE9",
                            color: "#A67C52",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {bride.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            gap: 12,
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
                            {bride.name}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 17,
                                  fontWeight: 500,
                                  color: "#2C2C2C",
                                }}
                              >
                                ${bride.total.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  fontSize: 9,
                                  color: "#AAA",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                total
                              </div>
                            </div>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: cfg.bg,
                                color: cfg.color,
                                padding: "4px 10px",
                                borderRadius: 12,
                                fontSize: 9,
                                fontWeight: 600,
                              }}
                            >
                              {cfg.icon} {cfg.label}
                            </div>
                            <ChevronDown
                              size={16}
                              color="#CCCCCC"
                              style={{
                                transform: isOpen ? "rotate(180deg)" : "none",
                                transition: "transform 0.3s",
                                flexShrink: 0,
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className="bride-progress-bar"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              maxWidth: 180,
                              background: "#F0EBE4",
                              height: 4,
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "#D4A373",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#A67C52",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ${bride.paid.toLocaleString()} • {progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          borderTop: "1px solid #F0EBE4",
                          background: "#FEFBF9",
                          padding: "24px",
                        }}
                      >
                        {/* Only show reminder section if there are pending payments */}
                        {bride.status !== "paid" && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 20,
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                color:
                                  bride.status === "overdue"
                                    ? "#C04040"
                                    : "#C07840",
                                background:
                                  bride.status === "overdue"
                                    ? "#FDE8E8"
                                    : "#FFF9F4",
                                padding: "6px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 500,
                                border: `1px solid ${bride.status === "overdue" ? "#F5C0C0" : "#F5D5B0"}`,
                                width: "fit-content",
                              }}
                            >
                              <AlertCircle
                                size={12}
                                style={{ flexShrink: 0 }}
                              />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {bride.status === "overdue"
                                  ? "Overdue"
                                  : "Payment Due"}
                                <span className="bride-name-desktop">
                                  {" "}
                                  — {bride.name}
                                </span>
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                remindMutation.mutate(bride.id);
                              }}
                              disabled={remindMutation.isPending}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "7px 14px",
                                background: remindMutation.isPending
                                  ? "#888"
                                  : "#1F1F1F",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 500,
                                cursor: remindMutation.isPending
                                  ? "not-allowed"
                                  : "pointer",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                            >
                              {remindMutation.isPending ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />{" "}
                                  Sending…
                                </>
                              ) : (
                                "Send Reminder"
                              )}
                            </button>
                          </div>
                        )}

                        {/* Payment cards — horizontally scrollable */}
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            overflowX: "auto",
                            paddingBottom: 8,
                            scrollbarWidth: "thin",
                            scrollbarColor: "#E8E0D5 transparent",
                          }}
                        >
                          {/* Show all payments for this bride */}
                          {bride.payments && bride.payments.length > 0 ? (
                            bride.payments.map((pmt: any) => {
                              const isPaid = pmt.status === "PAID";

                              const now = new Date();
                              const today = new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate(),
                              );

                              const isOverdue =
                                pmt.status === "PENDING" &&
                                pmt.dueDate &&
                                new Date(pmt.dueDate) < today;

                              return (
                                <div
                                  key={pmt.id}
                                  style={{
                                    flexShrink: 0,
                                    width: "calc(25% - 9px)",
                                    minWidth: 180,
                                    background: "#fff",
                                    border: `1px solid ${isOverdue ? "#F5C0C0" : "#F0EBE4"}`,
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0,
                                    position: "relative",
                                  }}
                                >
                                  {/* Delete icon — top right, only for unpaid */}
                                  {!isPaid && (
                                    <button
                                      onClick={() =>
                                        setConfirmDeletePaymentId(pmt.id)
                                      }
                                      title="Delete payment"
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 2,
                                        opacity: 0.4,
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.opacity = "1")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.opacity = "0.4")
                                      }
                                    >
                                      <Trash2 size={12} color="#C04040" />
                                    </button>
                                  )}

                                  {/* Status badge */}
                                  <div style={{ marginBottom: 8 }}>
                                    <span
                                      style={{
                                        fontSize: 9,
                                        fontWeight: 600,
                                        padding: "2px 8px",
                                        borderRadius: 10,
                                        background: isPaid
                                          ? "#ECFDF5"
                                          : isOverdue
                                            ? "#FEF2F2"
                                            : "#FFFBEB",
                                        color: isPaid
                                          ? "#059669"
                                          : isOverdue
                                            ? "#DC2626"
                                            : "#D97706",
                                      }}
                                    >
                                      {isPaid
                                        ? "Paid"
                                        : isOverdue
                                          ? "Overdue"
                                          : "Pending"}
                                    </span>
                                  </div>

                                  <div
                                    style={{
                                      fontSize: 13,
                                      fontWeight: 600,
                                      color: "#333",
                                      marginBottom: 4,
                                    }}
                                  >
                                    {APPOINTMENT_TITLE_LABELS[
                                      pmt.paymentType
                                    ] || pmt.paymentType}
                                  </div>
                                  <div
                                    style={{
                                      fontFamily: "'Cormorant Garamond', serif",
                                      fontSize: 18,
                                      color: "#2C2C2C",
                                      marginBottom: 4,
                                    }}
                                  >
                                    ${Number(pmt.amount).toLocaleString()}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: "#AAA",
                                      marginBottom: 12,
                                    }}
                                  >
                                    {isPaid
                                      ? `Paid ${new Date(pmt.paidDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`
                                      : pmt.dueDate
                                        ? `Due ${new Date(pmt.dueDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`
                                        : "No due date"}
                                  </div>

                                  {/* Action buttons */}
                                  {isPaid ? (
                                    <button
                                      onClick={() => {
                                        setReceiptPayment(pmt);
                                        setReceiptBride({
                                          name: bride.name,
                                          email: bride.email,
                                        });
                                      }}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 5,
                                        width: "100%",
                                        padding: "7px",
                                        borderRadius: 6,
                                        border: "none",
                                        background: "#F5EFE9",
                                        color: "#8B5E3C",
                                        fontSize: 10,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <FileText size={11} /> Receipt
                                    </button>
                                  ) : (
                                    <div style={{ display: "flex", gap: 6 }}>
                                      <button
                                        onClick={() =>
                                          setEditPayment({
                                            ...pmt,
                                            brideId: bride.id,
                                          })
                                        }
                                        style={{
                                          flex: 1,
                                          padding: "7px",
                                          borderRadius: 6,
                                          border: "1px solid #E8E0D5",
                                          background: "#fff",
                                          color: "#555",
                                          fontSize: 10,
                                          cursor: "pointer",
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          markPaidMutation.mutate(pmt.id)
                                        }
                                        disabled={markPaidMutation.isPending}
                                        style={{
                                          flex: 2,
                                          padding: "7px",
                                          borderRadius: 6,
                                          border: "none",
                                          background: "#1F1F1F",
                                          color: "#fff",
                                          fontSize: 10,
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          gap: 4,
                                        }}
                                      >
                                        <CheckCircle2 size={11} /> Mark Paid
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div
                              style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                color: "#AAA",
                                fontSize: 13,
                                width: "100%",
                              }}
                            >
                              No payments created yet
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {bridesData && (
            <Pagination
              page={page}
              totalPages={bridesData.meta.totalPages}
              total={bridesData.meta.total}
              limit={5}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>

      <CreatePaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* Edit Payment — reuse CreatePaymentModal in edit mode */}
      <CreatePaymentModal
        open={!!editPayment}
        onOpenChange={(open) => {
          if (!open) setEditPayment(null);
        }}
        editPayment={editPayment}
      />

      <PaymentReceiptModal
        payment={receiptPayment}
        brideName={receiptBride?.name ?? ""}
        brideEmail={receiptBride?.email ?? ""}
        onClose={() => {
          setReceiptPayment(null);
          setReceiptBride(null);
        }}
      />

      {/* Confirm delete payment */}
      {confirmDeletePaymentId && (
        <>
          <div
            onClick={() => setConfirmDeletePaymentId(null)}
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
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                width: "100%",
                maxWidth: 380,
                padding: "28px 24px",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 8px",
                }}
              >
                Delete this payment?
              </h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>
                This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmDeletePaymentId(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #E8E0D5",
                    borderRadius: 9,
                    fontSize: 13,
                    color: "#666",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteMutation.mutate(confirmDeletePaymentId);
                    setConfirmDeletePaymentId(null);
                  }}
                  disabled={deleteMutation.isPending}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: "#CC4444",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
