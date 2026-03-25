import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Info,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import {
  appointmentsApi,
  APPOINTMENT_TITLE_LABELS,
  type Appointment,
} from "@/lib/api";

// ── ICS generator ─────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIcsDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function downloadIcs(appt: Appointment) {
  const title = APPOINTMENT_TITLE_LABELS[appt.title];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fatima K Designs//Bridal Portal//EN",
    "BEGIN:VEVENT",
    `UID:${appt.id}@fatimak`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(appt.startTime)}`,
    `DTEND:${toIcsDate(appt.endTime)}`,
    `SUMMARY:${title} — Fatima K Designs`,
    appt.location ? `LOCATION:${appt.location}` : "",
    appt.description
      ? `DESCRIPTION:${appt.description.replace(/\n/g, "\\n")}`
      : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", { weekday: "long" });
}
function fmtDateNum(iso: string) {
  return new Date(iso).getDate();
}
function fmtMonth(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-AU", { month: "short" })
    .toUpperCase();
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
function fmtDuration(start: string, end: string) {
  const mins = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
  return mins >= 60
    ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ""}`
    : `${mins} min`;
}
function fmtFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BridePortalAppointments() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [autoExpanded, setAutoExpanded] = useState(false);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => appointmentsApi.myAppointments(),
  });

  // Auto-expand first upcoming card only on initial load
  useEffect(() => {
    if (autoExpanded || appointments.length === 0) return;
    const first = appointments.find(
      (a) => new Date(a.startTime) >= new Date() && a.status !== "CANCELLED",
    );
    if (first) setExpanded(first.id);
    setAutoExpanded(true);
  }, [appointments]);

  const now = new Date();
  const upcoming = appointments.filter(
    (a) =>
      new Date(a.startTime) >= now &&
      a.status !== "CANCELLED" &&
      a.status !== "COMPLETED",
  );
  const past = appointments
    .filter(
      (a) =>
        new Date(a.startTime) < now ||
        a.status === "COMPLETED" ||
        a.status === "CANCELLED",
    )
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

  return (
    <BridePortalLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32,
                fontWeight: 500,
                color: "#2C2C2C",
                margin: "0 0 6px",
              }}
            >
              My Appointments
            </h1>
            <p style={{ fontSize: 13, color: "#888888", margin: 0 }}>
              Your fitting schedule with Fatima K Designs
            </p>
          </div>

          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <Loader2 size={24} className="animate-spin" color="#D4A373" />
            </div>
          )}

          {!isLoading && (
            <>
              {/* ── Upcoming ── */}
              <section style={{ marginBottom: 36 }}>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#2C2C2C",
                    margin: "0 0 16px",
                    paddingBottom: 10,
                    borderBottom: "1px solid #E8E0D5",
                  }}
                >
                  Upcoming Appointments
                </h2>

                {upcoming.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: "#AAAAAA",
                      fontSize: 13,
                    }}
                  >
                    No upcoming appointments scheduled.
                  </div>
                )}

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {upcoming.map((appt) => {
                    const open = expanded === appt.id;
                    return (
                      <div
                        key={appt.id}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #E8E0D5",
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div
                          onClick={() => setExpanded(open ? null : appt.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "18px 22px",
                            cursor: "pointer",
                          }}
                        >
                          {/* Date badge */}
                          <div
                            style={{
                              background: "#F5EFE9",
                              borderRadius: 10,
                              padding: "10px 14px",
                              textAlign: "center",
                              flexShrink: 0,
                              minWidth: 58,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 9,
                                color: "#A67C52",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              {fmtMonth(appt.startTime)}
                            </div>
                            <div
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 28,
                                fontWeight: 600,
                                color: "#2C2C2C",
                                lineHeight: 1,
                              }}
                            >
                              {fmtDateNum(appt.startTime)}
                            </div>
                          </div>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 4,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 20,
                                  fontWeight: 500,
                                  color: "#2C2C2C",
                                }}
                              >
                                {APPOINTMENT_TITLE_LABELS[appt.title]}
                              </span>
                              <Badge
                                style={{
                                  background:
                                    appt.status === "RESCHEDULED"
                                      ? "#FFF8E7"
                                      : "#E8D8CE",
                                  color:
                                    appt.status === "RESCHEDULED"
                                      ? "#B7860B"
                                      : "#A67C52",
                                  border: "none",
                                  fontSize: 10,
                                }}
                              >
                                {appt.status === "RESCHEDULED"
                                  ? "Rescheduled"
                                  : "Upcoming"}
                              </Badge>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 16,
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  fontSize: 12,
                                  color: "#666",
                                }}
                              >
                                <Clock size={12} color="#D4A373" />{" "}
                                {fmtDay(appt.startTime)} ·{" "}
                                {fmtTime(appt.startTime)} (
                                {fmtDuration(appt.startTime, appt.endTime)})
                              </span>
                              {appt.location && (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    fontSize: 12,
                                    color: "#666",
                                  }}
                                >
                                  <MapPin size={12} color="#D4A373" />{" "}
                                  {appt.location}
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            style={{
                              color: "#AAAAAA",
                              transform: open
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          >
                            <ChevronRight size={18} />
                          </div>
                        </div>

                        {open && (
                          <div
                            style={{
                              borderTop: "1px solid #F0EBE4",
                              padding: "18px 22px",
                              display: "flex",
                              gap: 24,
                              background: "#FDFAF8",
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                minWidth: 220,
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#AAAAAA",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 4,
                                  }}
                                >
                                  Date & Time
                                </div>
                                <div style={{ fontSize: 13, color: "#555" }}>
                                  {fmtFullDate(appt.startTime)}
                                </div>
                                <div style={{ fontSize: 13, color: "#555" }}>
                                  {fmtTime(appt.startTime)} –{" "}
                                  {fmtTime(appt.endTime)}
                                </div>
                              </div>

                              {appt.location && (
                                <div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: "#AAAAAA",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.08em",
                                      marginBottom: 4,
                                    }}
                                  >
                                    Location
                                  </div>
                                  <div style={{ fontSize: 13, color: "#555" }}>
                                    {appt.location}
                                  </div>
                                </div>
                              )}

                              {appt.description && (
                                <div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: "#AAAAAA",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.08em",
                                      marginBottom: 6,
                                    }}
                                  >
                                    About this appointment
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: "#555555",
                                      lineHeight: 1.55,
                                    }}
                                  >
                                    {appt.description}
                                  </div>
                                </div>
                              )}

                              {appt.whatToBring && (
                                <div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: "#AAAAAA",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.08em",
                                      marginBottom: 6,
                                    }}
                                  >
                                    What to bring
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 8,
                                      alignItems: "flex-start",
                                      background:
                                        "linear-gradient(135deg, #F5EFE9, #EDE4DA)",
                                      borderRadius: 8,
                                      padding: "12px 14px",
                                    }}
                                  >
                                    <Info
                                      size={14}
                                      color="#A67C52"
                                      style={{ flexShrink: 0, marginTop: 1 }}
                                    />
                                    <div
                                      style={{
                                        fontSize: 13,
                                        color: "#555555",
                                        lineHeight: 1.55,
                                      }}
                                    >
                                      {appt.whatToBring}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                flexShrink: 0,
                                minWidth: 160,
                              }}
                            >
                              <button
                                onClick={() => downloadIcs(appt)}
                                style={{
                                  padding: "10px 18px",
                                  background: "#333",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6,
                                }}
                              >
                                <CalendarPlus size={13} /> Add to Calendar
                              </button>
                              <a
                                href="mailto:studio@fatimak.com.au"
                                style={{
                                  textAlign: "center",
                                  fontSize: 11,
                                  color: "#A67C52",
                                  marginTop: 4,
                                  textDecoration: "none",
                                }}
                              >
                                Contact Fatima
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── Past ── */}
              {past.length > 0 && (
                <section>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#2C2C2C",
                      margin: "0 0 16px",
                      paddingBottom: 10,
                      borderBottom: "1px solid #E8E0D5",
                    }}
                  >
                    Past Appointments
                  </h2>
                  <Card
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E8E0D5",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    <CardContent style={{ padding: 0 }}>
                      {past.map((p, i) => (
                        <div
                          key={p.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 16,
                            padding: "16px 22px",
                            borderBottom:
                              i < past.length - 1
                                ? "1px solid #F0EBE4"
                                : "none",
                            opacity: 0.75,
                          }}
                        >
                          <CheckCircle2
                            size={18}
                            color={
                              p.status === "CANCELLED" ? "#CCCCCC" : "#D4A373"
                            }
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 4,
                                flexWrap: "wrap",
                                gap: 4,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  fontSize: 17,
                                  fontWeight: 500,
                                  color: "#555",
                                  textDecoration:
                                    p.status === "CANCELLED"
                                      ? "none"
                                      : "line-through",
                                }}
                              >
                                {APPOINTMENT_TITLE_LABELS[p.title]}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                {p.status === "CANCELLED" && (
                                  <Badge
                                    style={{
                                      background: "#FFF0F0",
                                      color: "#C0392B",
                                      border: "none",
                                      fontSize: 9,
                                    }}
                                  >
                                    Cancelled
                                  </Badge>
                                )}
                                <span
                                  style={{ fontSize: 12, color: "#AAAAAA" }}
                                >
                                  {fmtFullDate(p.startTime)} ·{" "}
                                  {fmtTime(p.startTime)}
                                </span>
                              </div>
                            </div>
                            {p.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#888888",
                                  lineHeight: 1.5,
                                }}
                              >
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </BridePortalLayout>
  );
}
