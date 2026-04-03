import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Camera,
  Loader2,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { bridesApi } from "@/lib/api";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function BridePortalDressJourney() {
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: journey, isLoading } = useQuery({
    queryKey: ["bride-journey"],
    queryFn: () => bridesApi.journey(),
    onSuccess: (data) => {
      const first =
        data.events.find((e) => e.type === "in-progress") ??
        data.events.find((e) => e.type === "coming-soon");
      if (first && !expanded) setExpanded(first.appointmentId);
    },
  });

  if (isLoading) {
    return (
      <BridePortalLayout>
        <main className="bp-page-main">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "80px 0",
            }}
          >
            <Loader2 size={24} className="animate-spin" color="#D4A373" />
          </div>
        </main>
      </BridePortalLayout>
    );
  }

  const stages = journey?.stageProgress ?? [];
  const events = journey?.events ?? [];
  const progress = journey?.progressPct ?? 0;
  const doneStages = stages.filter((s) => s.status === "done").length;

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
              My Dress Journey
            </h1>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Your bespoke gown progress with Fatima K
            </p>
          </div>

          {/* Progress card — fixed 7 stages */}
          <Card
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E0D5",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              marginBottom: 28,
            }}
          >
            <CardContent style={{ padding: "20px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
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
                    Journey Progress
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                    {doneStages} of {stages.length} stages complete
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 36,
                    fontWeight: 500,
                    color: "#D4A373",
                    lineHeight: 1,
                  }}
                >
                  {progress}%
                </div>
              </div>
              <div
                style={{
                  background: "#EDE4DA",
                  borderRadius: 6,
                  height: 8,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #D4A373, #C8956A)",
                    borderRadius: 6,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
                className="journey-stages"
              >
                {stages.map((s) => (
                  <div
                    key={s.key}
                    className="journey-stage-item"
                    title={s.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background:
                          s.status === "done"
                            ? "#D4A373"
                            : s.status === "current"
                              ? "#fff"
                              : "#E8E0D5",
                        border:
                          s.status === "current"
                            ? "2.5px solid #D4A373"
                            : "none",
                      }}
                    />
                    <span
                      className="stage-label"
                      style={{
                        fontSize: 9,
                        color:
                          s.status === "done"
                            ? "#A67C52"
                            : s.status === "current"
                              ? "#2C2C2C"
                              : "#CCCCCC",
                        fontWeight: s.status === "current" ? 600 : 400,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event timeline */}
          {events.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#AAA",
                fontSize: 13,
              }}
            >
              No sessions yet — your journey will appear here once Fatima books
              your first appointment.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            {events.map((event, idx) => {
              const isDone = event.type === "completed";
              const isInProgress = event.type === "in-progress";
              const isComingSoon = event.type === "coming-soon";
              const isOpen = expanded === event.appointmentId;
              const previewPhotos = event.photos.slice(0, 4);
              const extraCount = event.photos.length - 4;

              return (
                <div
                  key={event.appointmentId}
                  style={{ display: "flex", gap: 20 }}
                >
                  {/* Timeline dot + line */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: 28,
                      flexShrink: 0,
                      paddingTop: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: isDone
                          ? "#D4A373"
                          : isInProgress
                            ? "#FFFFFF"
                            : "#F0EBE4",
                        border: isInProgress
                          ? "2.5px solid #D4A373"
                          : isDone
                            ? "none"
                            : "2px solid #E8E0D5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        zIndex: 1,
                        boxShadow: isInProgress
                          ? "0 0 0 4px rgba(212,163,115,0.15)"
                          : "none",
                      }}
                    >
                      {isDone && <CheckCircle2 size={14} color="#fff" />}
                      {isInProgress && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#D4A373",
                          }}
                        />
                      )}
                    </div>
                    {idx < events.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 24,
                          background: isDone ? "#D4A373" : "#E8E0D5",
                          marginTop: 2,
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      paddingBottom: idx < events.length - 1 ? 12 : 0,
                    }}
                  >
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: `1px solid ${isInProgress ? "#D4A373" : "#E8E0D5"}`,
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: isInProgress
                          ? "0 2px 10px rgba(212,163,115,0.15)"
                          : "0 1px 4px rgba(0,0,0,0.04)",
                        opacity: isComingSoon ? 0.75 : 1,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setExpanded(isOpen ? null : event.appointmentId)
                      }
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "16px 20px",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 20,
                                fontWeight: 500,
                                color: isDone ? "#888" : "#2C2C2C",
                                textDecoration: isDone
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {event.title}
                            </span>
                            {isDone && (
                              <Badge
                                style={{
                                  background: "#E8F4E8",
                                  color: "#3A7A3A",
                                  border: "none",
                                  fontSize: 9,
                                }}
                              >
                                Complete
                              </Badge>
                            )}
                            {isInProgress && (
                              <Badge
                                style={{
                                  background: "#E8D8CE",
                                  color: "#A67C52",
                                  border: "none",
                                  fontSize: 9,
                                }}
                              >
                                Next Up
                              </Badge>
                            )}
                            {isComingSoon && (
                              <Badge
                                style={{
                                  background: "#F3F3F3",
                                  color: "#888",
                                  border: "none",
                                  fontSize: 9,
                                }}
                              >
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 16,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                fontSize: 12,
                                color: "#888",
                              }}
                            >
                              <Clock size={11} color="#D4A373" />{" "}
                              {fmtDate(event.startTime)}
                            </span>
                            {event.description && (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#888",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 280,
                                }}
                              >
                                {event.description}
                              </span>
                            )}
                          </div>
                        </div>
                        {event.photos.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 11,
                              color: "#A67C52",
                              background: "#F5EFE9",
                              padding: "4px 10px",
                              borderRadius: 6,
                              flexShrink: 0,
                            }}
                          >
                            <Camera size={12} /> {event.photos.length} photo
                            {event.photos.length !== 1 ? "s" : ""}
                          </div>
                        )}
                        <div style={{ color: "#CCCCCC", flexShrink: 0 }}>
                          {isOpen ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </div>

                      {/* Expanded */}
                      {isOpen && (
                        <div
                          style={{
                            borderTop: "1px solid #F0EBE4",
                            background: "#FDFAF8",
                          }}
                        >
                          <div
                            className="journey-expanded-content"
                            style={{ display: "flex" }}
                          >
                            <div
                              className="journey-session-details"
                              style={{
                                flex: 1,
                                padding: "18px 22px",
                                minWidth: 0,
                              }}
                            >
                              {/* Appointment details */}
                              <div
                                style={{
                                  marginBottom: 16,
                                  padding: "12px 14px",
                                  background:
                                    "linear-gradient(135deg, #F5EFE9, #EDE4DA)",
                                  borderRadius: 8,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#A67C52",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 8,
                                  }}
                                >
                                  {isDone
                                    ? "Session Details"
                                    : "Appointment Details"}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 5,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 6,
                                      fontSize: 12,
                                      color: "#555",
                                    }}
                                  >
                                    <Clock size={11} color="#D4A373" />
                                    {fmtDate(event.startTime)} ·{" "}
                                    {fmtTime(event.startTime)} –{" "}
                                    {fmtTime(event.endTime)}
                                  </div>
                                  {event.location && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontSize: 12,
                                        color: "#555",
                                      }}
                                    >
                                      <MapPin size={11} color="#D4A373" />{" "}
                                      {event.location}
                                    </div>
                                  )}
                                  {event.whatToBring && (
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: "#666",
                                        marginTop: 2,
                                      }}
                                    >
                                      <strong>What to bring:</strong>{" "}
                                      {event.whatToBring}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Fitting notes — completed only */}
                              {isDone && event.notes && (
                                <div>
                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: "#AAAAAA",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.08em",
                                      marginBottom: 8,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 5,
                                    }}
                                  >
                                    <FileText size={11} color="#D4A373" />{" "}
                                    Fitting Notes
                                  </div>
                                  <div
                                    className="ql-editor ql-fitting-notes"
                                    style={{
                                      fontSize: 13,
                                      color: "#555",
                                      lineHeight: 1.6,
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: event.notes,
                                    }}
                                  />
                                </div>
                              )}

                              {!isDone &&
                                !event.whatToBring &&
                                !event.description && (
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: "#AAA",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    More details will be added closer to your
                                    appointment.
                                  </div>
                                )}
                            </div>

                            {/* Photos — completed only */}
                            {isDone && event.photos.length > 0 && (
                              <div
                                className="journey-photos"
                                style={{
                                  width: 220,
                                  borderLeft: "1px solid #F0EBE4",
                                  padding: "18px 16px",
                                  flexShrink: 0,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#AAAAAA",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <Camera size={11} color="#D4A373" /> Photos
                                </div>
                                <div
                                  className="journey-photos-grid"
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 6,
                                  }}
                                >
                                  {previewPhotos.map((photo) => (
                                    <div
                                      key={photo.id}
                                      style={{
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        aspectRatio: "3/4",
                                        border: "1px solid #E8E0D5",
                                      }}
                                    >
                                      <img
                                        src={photo.imageUrl}
                                        alt={photo.caption ?? ""}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                                {extraCount > 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate("/bride/fitting-photos");
                                    }}
                                    style={{
                                      marginTop: 8,
                                      width: "100%",
                                      fontSize: 11,
                                      color: "#A67C52",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      textAlign: "center",
                                      padding: "4px 0",
                                    }}
                                  >
                                    +{extraCount} more photos →
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </BridePortalLayout>
  );
}
