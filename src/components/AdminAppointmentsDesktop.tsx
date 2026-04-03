import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Plus,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/AdminLayout";
import { AddAppointmentModal } from "@/components/AddAppointmentModal";
import { BrideProfileModal } from "@/components/BrideProfileModal";
import {
  appointmentsApi,
  bridesApi,
  APPOINTMENT_TITLE_LABELS,
  type AppointmentWithBride,
  type BrideWithProfile,
} from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

type ViewMode = "week" | "month";

function startOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
function endOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}
function startOfWeek(d: Date) {
  const r = new Date(d);
  const day = r.getDay();
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1));
  return startOfDay(r);
}
function endOfWeek(d: Date) {
  const r = startOfWeek(d);
  r.setDate(r.getDate() + 6);
  return endOfDay(r);
}
function startOfMonth(d: Date) {
  return startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));
}
function endOfMonth(d: Date) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
function fmtMonthYear(d: Date) {
  return d.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}
function fmtWeekRange(d: Date) {
  const s = startOfWeek(d);
  const e = endOfWeek(d);
  return `${s.getDate()} – ${e.getDate()} ${s.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}`;
}

const ACCENT_COLORS = ["#D4A373", "#A67C52", "#8A6840", "#C4956A", "#B87A4F"];
function statusColor(s: string) {
  if (s === "CANCELLED") return { bg: "#FFF0F0", color: "#C0392B" };
  if (s === "COMPLETED") return { bg: "#F0FFF4", color: "#27AE60" };
  if (s === "RESCHEDULED") return { bg: "#FFF8E7", color: "#B7860B" };
  return { bg: "#F5EFE9", color: "#A67C52" };
}

export function AdminAppointmentsDesktop() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date());
  const [profileBride, setProfileBride] = useState<BrideWithProfile | null>(
    null,
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [editAppointment, setEditAppointment] =
    useState<AppointmentWithBride | null>(null);
  const [confirmCompleteId, setConfirmCompleteId] = useState<string | null>(
    null,
  );

  const from = viewMode === "week" ? startOfWeek(cursor) : startOfMonth(cursor);
  const to = viewMode === "week" ? endOfWeek(cursor) : endOfMonth(cursor);
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: queryKeys.appointments.list(from.toISOString(), to.toISOString()),
    queryFn: () =>
      appointmentsApi.list({ from: from.toISOString(), to: to.toISOString() }),
  });

  useEffect(() => {
    if (appointments.length === 0 || selectedId) return;
    const now = Date.now();
    const upcoming = appointments.find(
      (a) => new Date(a.startTime).getTime() >= now,
    );
    setSelectedId((upcoming ?? appointments[appointments.length - 1]).id);
  }, [appointments]);

  const markCompleteMutation = useMutation({
    mutationFn: (id: string) =>
      appointmentsApi.update(id, { status: "COMPLETED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.lists(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      setConfirmCompleteId(null);
    },
  });

  const today = new Date();
  const todayAppts = appointments.filter((a) =>
    isSameDay(new Date(a.startTime), today),
  );
  const restAppts = appointments.filter(
    (a) => !isSameDay(new Date(a.startTime), today),
  );
  const selected = appointments.find((a) => a.id === selectedId) ?? null;

  function navigate(dir: 1 | -1) {
    const d = new Date(cursor);
    if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCursor(d);
    setSelectedId(null);
  }

  async function openBrideProfile(brideId: string) {
    setProfileLoading(true);
    try {
      setProfileBride(await bridesApi.get(brideId));
    } finally {
      setProfileLoading(false);
    }
  }

  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return {
      d,
      count: appointments.filter((a) => isSameDay(new Date(a.startTime), d))
        .length,
      isToday: isSameDay(d, today),
    };
  });

  const confirmAppt =
    appointments.find((a) => a.id === confirmCompleteId) ?? null;

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 4px",
                }}
              >
                Appointments
              </h1>
              <div style={{ fontSize: 12, color: "#888" }}>
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""} in view
              </div>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> New{" "}
              <span className="hidden sm:block">Appointment</span>
            </button>
          </div>

          {/* Week/Month strip */}
          <Card
            style={{
              background: "#fff",
              border: "1px solid #E8E0D5",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              marginBottom: 24,
            }}
          >
            <CardContent style={{ padding: "16px 20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => navigate(-1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    <ChevronLeft size={18} color="#555" />
                  </button>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#2C2C2C",
                    }}
                  >
                    {viewMode === "week"
                      ? fmtWeekRange(cursor)
                      : fmtMonthYear(cursor)}
                  </span>
                  <button
                    onClick={() => navigate(1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    <ChevronRight size={18} color="#555" />
                  </button>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["week", "month"] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setViewMode(v);
                        setCursor(new Date());
                      }}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 6,
                        border: "1px solid #E8E0D5",
                        background: viewMode === v ? "#333" : "#fff",
                        color: viewMode === v ? "#fff" : "#666",
                        fontSize: 11,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                  {/* <button
                    onClick={() => {
                      setCursor(new Date());
                      setSelectedId(null);
                    }}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 6,
                      border: "1px solid #E8E0D5",
                      background: "#fff",
                      color: "#A67C52",
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    Today
                  </button> */}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {weekDays.map(({ d, count, isToday }, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        color: "#AAAAAA",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {d
                        .toLocaleDateString("en-AU", { weekday: "short" })
                        .toUpperCase()}
                    </span>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: isToday ? "#333" : "transparent",
                        border:
                          count > 0 && !isToday
                            ? "2px solid #D4A373"
                            : "2px solid transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isToday ? 600 : 400,
                          color: isToday
                            ? "#fff"
                            : count > 0
                              ? "#2C2C2C"
                              : "#888",
                        }}
                      >
                        {d.getDate()}
                      </span>
                    </div>
                    {count > 0 ? (
                      <span
                        style={{
                          fontSize: 10,
                          background: isToday ? "#D4A373" : "#F0E4D8",
                          color: isToday ? "#fff" : "#A67C52",
                          borderRadius: 10,
                          padding: "1px 7px",
                          fontWeight: 600,
                        }}
                      >
                        {count}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, color: "transparent" }}>
                        ·
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "40px 0",
              }}
            >
              <Loader2 size={24} className="animate-spin" color="#D4A373" />
            </div>
          )}

          {!isLoading && (
            <div className="appointments-layout">
              <div className="appointments-list">
                {/* Today */}
                {todayAppts.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                        paddingBottom: 8,
                        borderBottom: "1px solid #E8E0D5",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#2C2C2C",
                          margin: 0,
                        }}
                      >
                        Today
                      </h2>
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {todayAppts.length} appointment
                        {todayAppts.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {todayAppts.map((appt, i) => (
                        <ApptCard
                          key={appt.id}
                          appt={appt}
                          accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                          selected={selectedId === appt.id}
                          onClick={() =>
                            setSelectedId(
                              appt.id === selectedId ? null : appt.id,
                            )
                          }
                          onMarkComplete={(id) => setConfirmCompleteId(id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Detail Panel - Mobile (shows here on mobile) */}
                {selected && (
                  <div className="detail-panel-mobile">
                    <DetailPanel
                      appt={selected}
                      onClose={() => setSelectedId(null)}
                      onViewBride={() => openBrideProfile(selected.bride.id)}
                      onEdit={() => setEditAppointment(selected)}
                      profileLoading={profileLoading}
                    />
                  </div>
                )}

                {/* Coming up */}
                {restAppts.length > 0 && (
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#2C2C2C",
                        margin: "0 0 12px",
                        paddingBottom: 8,
                        borderBottom: "1px solid #E8E0D5",
                      }}
                    >
                      {viewMode === "week"
                        ? "Coming Up This Week"
                        : "This Month"}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {restAppts.map((a) => {
                        const isDone =
                          a.status === "COMPLETED" || a.status === "CANCELLED";
                        const sc = statusColor(a.status);
                        const isPast = new Date(a.endTime) < new Date();
                        const needsCompletion = isPast && !isDone;

                        return (
                          <div
                            key={a.id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            <div
                              onClick={() =>
                                setSelectedId(a.id === selectedId ? null : a.id)
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 14px",
                                background: "#fff",
                                border: `1px solid ${selectedId === a.id ? "#D4A373" : needsCompletion ? "#F5C6C6" : "#E8E0D5"}`,
                                borderRadius: 8,
                                cursor: "pointer",
                              }}
                            >
                              <Avatar
                                style={{ width: 30, height: 30, flexShrink: 0 }}
                              >
                                <AvatarFallback
                                  style={{
                                    background: "#E8D8CE",
                                    color: "#A67C52",
                                    fontSize: 10,
                                    fontWeight: 600,
                                  }}
                                >
                                  {a.bride?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#333",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {a.bride?.name}
                                </div>
                                <div style={{ fontSize: 11, color: "#888" }}>
                                  {APPOINTMENT_TITLE_LABELS[a.title]}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#888",
                                  textAlign: "right",
                                  flexShrink: 0,
                                }}
                              >
                                <div>{fmtDate(new Date(a.startTime))}</div>
                                <div
                                  style={{ color: "#A67C52", fontWeight: 500 }}
                                >
                                  {fmtTime(new Date(a.startTime))}
                                </div>
                              </div>
                              <Badge
                                style={{
                                  background: sc.bg,
                                  color: sc.color,
                                  border: "none",
                                  fontSize: 9,
                                  flexShrink: 0,
                                }}
                              >
                                {a.status}
                              </Badge>
                              {!isDone && (
                                <div
                                  title="Mark as Completed"
                                  style={{ flexShrink: 0 }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmCompleteId(a.id);
                                    }}
                                    style={{
                                      width: 26,
                                      height: 26,
                                      borderRadius: "50%",
                                      border: "1.5px solid #D4A373",
                                      background: "#fff",
                                      color: "#A67C52",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      fontSize: 13,
                                    }}
                                  >
                                    ✓
                                  </button>
                                </div>
                              )}
                            </div>

                            {needsCompletion && (
                              <div
                                className="past-appointment-alert"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "4px 8px",
                                  background: "#FFF5F5",
                                  border: "1px solid #F5C6C6",
                                  borderRadius: 5,
                                  fontSize: 9,
                                  color: "#C0392B",
                                }}
                              >
                                <span style={{ fontSize: 11, flexShrink: 0 }}>
                                  ⚠️
                                </span>
                                <span>
                                  Past appointment - mark as completed or
                                  cancelled
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {appointments.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 0",
                      color: "#AAA",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>
                      No appointments in this period
                    </div>
                    <button
                      onClick={() => setAddModalOpen(true)}
                      style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: "#A67C52",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      + Schedule one now
                    </button>
                  </div>
                )}
              </div>

              {/* Detail Panel - Desktop (shows here on desktop) */}
              {selected && (
                <div className="detail-panel-desktop">
                  <DetailPanel
                    appt={selected}
                    onClose={() => setSelectedId(null)}
                    onViewBride={() => openBrideProfile(selected.bride.id)}
                    onEdit={() => setEditAppointment(selected)}
                    profileLoading={profileLoading}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <AddAppointmentModal
        open={addModalOpen || !!editAppointment}
        onClose={() => {
          setAddModalOpen(false);
          setEditAppointment(null);
        }}
        editAppointment={editAppointment}
      />

      <BrideProfileModal
        bride={profileBride}
        onClose={() => setProfileBride(null)}
      />

      {/* Confirm complete modal */}
      {confirmCompleteId && confirmAppt && (
        <>
          <div
            onClick={() => setConfirmCompleteId(null)}
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
                maxWidth: 400,
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                padding: "32px 28px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#F5EFE9",
                  border: "2px solid #D4A373",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 22,
                  color: "#A67C52",
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  textAlign: "center",
                  margin: "0 0 8px",
                }}
              >
                Mark as Completed?
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#888",
                  textAlign: "center",
                  margin: "0 0 8px",
                  lineHeight: 1.5,
                }}
              >
                {APPOINTMENT_TITLE_LABELS[confirmAppt.title]} —{" "}
                {confirmAppt.bride?.name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#AAA",
                  textAlign: "center",
                  margin: "0 0 24px",
                }}
              >
                {fmtDate(new Date(confirmAppt.startTime))} at{" "}
                {fmtTime(new Date(confirmAppt.startTime))}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmCompleteId(null)}
                  style={{
                    flex: 1,
                    padding: "11px",
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
                  onClick={() => markCompleteMutation.mutate(confirmCompleteId)}
                  disabled={markCompleteMutation.isPending}
                  style={{
                    flex: 2,
                    padding: "11px",
                    border: "none",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: markCompleteMutation.isPending
                      ? "#C4A88C"
                      : "#2C2C2C",
                    cursor: markCompleteMutation.isPending
                      ? "not-allowed"
                      : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {markCompleteMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    "Yes, Mark Completed"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ApptCard({
  appt,
  accent,
  selected,
  onClick,
  onMarkComplete,
}: {
  appt: AppointmentWithBride;
  accent: string;
  selected: boolean;
  onClick: () => void;
  onMarkComplete: (id: string) => void;
}) {
  const initials =
    appt.bride?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";
  const bg = accent + "22";
  const isDone = appt.status === "COMPLETED" || appt.status === "CANCELLED";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${selected ? accent : "#E8E0D5"}`,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: selected
          ? `0 2px 8px ${accent}33`
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          background: bg,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Avatar
          style={{
            width: 34,
            height: 34,
            border: "2px solid rgba(255,255,255,0.6)",
            flexShrink: 0,
          }}
        >
          <AvatarFallback
            style={{
              background: "#fff",
              color: accent,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#2C2C2C",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {appt.bride?.name}
          </div>
          <div style={{ fontSize: 11, color: "#666" }}>
            {APPOINTMENT_TITLE_LABELS[appt.title]}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C" }}>
            {fmtTime(new Date(appt.startTime))}
          </div>
          <div style={{ fontSize: 10, color: "#888" }}>
            {Math.round(
              (new Date(appt.endTime).getTime() -
                new Date(appt.startTime).getTime()) /
                60000,
            )}{" "}
            min
          </div>
        </div>
        {!isDone && (
          <div title="Mark as Completed" style={{ flexShrink: 0 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete(appt.id);
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1.5px solid #D4A373",
                background: "#fff",
                color: "#A67C52",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ✓
            </button>
          </div>
        )}
      </div>
      {!selected && appt.description && (
        <div style={{ padding: "8px 16px", fontSize: 12, color: "#888" }}>
          {appt.description.slice(0, 70)}…
        </div>
      )}
    </div>
  );
}

function DetailPanel({
  appt,
  onClose,
  onViewBride,
  onEdit,
  profileLoading,
}: {
  appt: AppointmentWithBride;
  onClose: () => void;
  onViewBride: () => void;
  onEdit: () => void;
  profileLoading: boolean;
}) {
  const accent = "#D4A373";
  const sc = statusColor(appt.status);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E0D5",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ background: accent + "22", padding: "16px 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 500,
                color: "#2C2C2C",
              }}
            >
              {APPOINTMENT_TITLE_LABELS[appt.title]}
            </div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              {appt.bride?.name}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
            }}
          >
            <X size={16} color="#888" />
          </button>
        </div>
      </div>
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 12,
              color: "#555",
            }}
          >
            <Clock size={13} color="#D4A373" />
            {fmtTime(new Date(appt.startTime))} –{" "}
            {fmtTime(new Date(appt.endTime))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 12,
              color: "#555",
            }}
          >
            <Clock size={13} color="transparent" />
            {fmtDate(new Date(appt.startTime))}
          </div>
          {appt.location && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                fontSize: 12,
                color: "#555",
              }}
            >
              <MapPin size={13} color="#D4A373" />
              {appt.location}
            </div>
          )}
        </div>
        {appt.description && (
          <div style={{ borderTop: "1px solid #F0EBE4", paddingTop: 12 }}>
            <div
              style={{
                fontSize: 10,
                color: "#AAAAAA",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 6,
              }}
            >
              Description
            </div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.55 }}>
              {appt.description}
            </div>
          </div>
        )}
        {appt.whatToBring && (
          <div style={{ borderTop: "1px solid #F0EBE4", paddingTop: 12 }}>
            <div
              style={{
                fontSize: 10,
                color: "#AAAAAA",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 6,
              }}
            >
              What to Bring
            </div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.55 }}>
              {appt.whatToBring}
            </div>
          </div>
        )}
        <div
          style={{
            borderTop: "1px solid #F0EBE4",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Badge
            style={{
              alignSelf: "flex-start",
              background: sc.bg,
              color: sc.color,
              border: "none",
              fontSize: 10,
            }}
          >
            {appt.status}
          </Badge>
          <button
            onClick={onEdit}
            style={{
              width: "100%",
              padding: "9px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Edit Appointment
          </button>
          <button
            onClick={onViewBride}
            disabled={profileLoading}
            style={{
              width: "100%",
              padding: "9px",
              background: "#F5EFE9",
              color: "#A67C52",
              border: "1px solid #E8E0D5",
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 500,
              cursor: profileLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: profileLoading ? 0.7 : 1,
            }}
          >
            {profileLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Loading…
              </>
            ) : (
              "View Bride Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
