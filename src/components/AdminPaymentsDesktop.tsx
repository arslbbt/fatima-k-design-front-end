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
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api";
import type { Payment } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";
import { Pagination } from "@/components/ui/Pagination";
import { CreatePaymentModal } from "./CreatePaymentModal";
import { PaymentReceiptModal } from "./PaymentReceiptModal";

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

const PAYMENT_TYPE_LABELS = {
  BOOKING_DEPOSIT: "Booking Deposit",
  FABRICATION: "Fabrication",
  CONSTRUCTION: "Construction",
  FINAL_BALANCE: "Final Balance",
};

const PAYMENT_STEPS = [
  "BOOKING_DEPOSIT",
  "FABRICATION",
  "CONSTRUCTION",
  "FINAL_BALANCE",
] as const;

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
    onSuccess: () => {
      alert("Reminder sent successfully!");
    },
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
              <PlusCircle size={18} /> Create Payment
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 16,
              marginBottom: 32,
            }}
          >
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
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-end",
                  height: 120,
                  paddingBottom: 10,
                  overflow: "visible",
                  position: "relative",
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
              <div
                style={{
                  borderTop: "1px solid #F0EBE4",
                  paddingTop: 16,
                  marginTop: 12,
                  display: "flex",
                  gap: 32,
                  fontSize: 13,
                  color: "#666",
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
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
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
              <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
                Loading tracking data...
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
                      overflow: "hidden",
                      transition: "all 0.3s",
                    }}
                  >
                    <div
                      onClick={() => setExpandedId(isOpen ? null : bride.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        padding: "20px 24px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <Avatar
                        style={{
                          width: 44,
                          height: 44,
                          border: "1.5px solid #F5EFE9",
                          flexShrink: 0,
                        }}
                      >
                        <AvatarFallback
                          style={{
                            background: "#F5EFE9",
                            color: "#A67C52",
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {bride.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: 6 }}>
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: 19,
                              fontWeight: 500,
                              color: "#2C2C2C",
                              marginRight: 10,
                            }}
                          >
                            {bride.name}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              maxWidth: 200,
                              background: "#F0EBE4",
                              height: 5,
                              borderRadius: 3,
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
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#A67C52",
                            }}
                          >
                            ${bride.paid.toLocaleString()} paid • {progress}%
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                          width: 120,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 19,
                            fontWeight: 500,
                            color: "#2C2C2C",
                          }}
                        >
                          ${bride.total.toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#AAA",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          total order
                        </div>
                      </div>

                      <div
                        style={{
                          width: 120,
                          flexShrink: 0,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: cfg.bg,
                            color: cfg.color,
                            padding: "6px 14px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {cfg.icon} {cfg.label}
                        </div>
                      </div>

                      <ChevronDown
                        size={18}
                        color="#CCCCCC"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "none",
                          transition: "transform 0.3s",
                        }}
                      />
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          borderTop: "1px solid #F0EBE4",
                          background: "#FEFBF9",
                          padding: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              color: "#C07840",
                              background: "#FFF9F4",
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            <AlertCircle size={14} /> Tracking milestones for{" "}
                            {bride.name}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const pendingPmt = bride.payments?.find(
                                (p: any) => p.status === "PENDING",
                              );
                              if (pendingPmt)
                                remindMutation.mutate(pendingPmt.id);
                              else alert("No pending payments to remind for.");
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 20px",
                              background: "#1F1F1F",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Send Reminder
                          </button>
                        </div>

                        {/* FULL ROW SCROLL START */}
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            overflowX: "auto",
                            paddingBottom: 16,
                            scrollbarWidth: "thin",
                            scrollbarColor: "#E8E0D5 transparent",
                          }}
                        >
                          {PAYMENT_STEPS.map((step) => {
                            const stepsPayments =
                              bride.payments?.filter(
                                (p: any) => p.paymentType === step,
                              ) || [];

                            if (stepsPayments.length === 0) {
                              return (
                                <Card
                                  key={step}
                                  style={{
                                    flexShrink: 0,
                                    width: 240,
                                    background: "#fff",
                                    border: "1px solid #F0EBE4",
                                    opacity: 0.6,
                                  }}
                                >
                                  <CardContent style={{ padding: "16px" }}>
                                    <Badge
                                      style={{
                                        background: "#F5F5F5",
                                        color: "#AAA",
                                        border: "none",
                                        fontSize: 9,
                                        marginBottom: 8,
                                      }}
                                    >
                                      None
                                    </Badge>
                                    <div
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 4,
                                      }}
                                    >
                                      {PAYMENT_TYPE_LABELS[step]}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 10,
                                        color: "#DDD",
                                        fontStyle: "italic",
                                      }}
                                    >
                                      Not yet requested
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            }

                            return stepsPayments.map((pmt: any) => {
                              const isPaid = pmt.status === "PAID";
                              const isOverdue =
                                pmt.status === "PENDING" &&
                                pmt.dueDate &&
                                new Date(pmt.dueDate) < new Date();

                              return (
                                <Card
                                  key={pmt.id}
                                  style={{
                                    flexShrink: 0,
                                    width: 240,
                                    background: "#fff",
                                    border: "1px solid #F0EBE4",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                  }}
                                >
                                  <CardContent style={{ padding: "16px" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: 10,
                                      }}
                                    >
                                      <Badge
                                        style={{
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
                                          border: "none",
                                          fontSize: 9,
                                        }}
                                      >
                                        {isPaid
                                          ? "Paid"
                                          : isOverdue
                                            ? "Overdue"
                                            : "Pending"}
                                      </Badge>
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#333",
                                        marginBottom: 4,
                                      }}
                                    >
                                      {PAYMENT_TYPE_LABELS[step]}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: "#D4A373",
                                        marginBottom: 12,
                                      }}
                                    >
                                      ${Number(pmt.amount).toLocaleString()}
                                    </div>

                                    <div
                                      style={{
                                        borderTop: "1px solid #F5F5F5",
                                        paddingTop: 12,
                                        marginTop: 4,
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: 10,
                                          color: "#AAA",
                                          marginBottom: 12,
                                        }}
                                      >
                                        {isPaid
                                          ? `Paid on: ${new Date(pmt.paidDate).toLocaleDateString()}`
                                          : `Due: ${new Date(pmt.dueDate).toLocaleDateString()}`}
                                      </div>
                                      <div style={{ display: "flex", gap: 8 }}>
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
                                              gap: 6,
                                              width: "100%",
                                              justifyContent: "center",
                                              fontSize: 10,
                                              fontWeight: 600,
                                              color: "#8B5E3C",
                                              border: "none",
                                              background: "#F5EFE9",
                                              padding: "8px",
                                              borderRadius: 6,
                                              cursor: "pointer",
                                            }}
                                          >
                                            <FileText size={12} /> Receipt
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              markPaidMutation.mutate(pmt.id)
                                            }
                                            style={{
                                              width: "100%",
                                              padding: "8px",
                                              borderRadius: 6,
                                              border: "none",
                                              background: "#1F1F1F",
                                              color: "#fff",
                                              cursor: "pointer",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              gap: 5,
                                              fontSize: 10,
                                              fontWeight: 500,
                                            }}
                                          >
                                            <CheckCircle2 size={12} /> Mark Paid
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            });
                          })}
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

      <PaymentReceiptModal
        payment={receiptPayment}
        brideName={receiptBride?.name ?? ""}
        brideEmail={receiptBride?.email ?? ""}
        onClose={() => {
          setReceiptPayment(null);
          setReceiptBride(null);
        }}
      />
    </AdminLayout>
  );
}
