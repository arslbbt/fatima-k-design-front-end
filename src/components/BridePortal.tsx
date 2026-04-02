import { useRef, useState } from "react";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Camera,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  bridesApi,
  appointmentsApi,
  paymentsApi,
  fittingsApi,
  inspoApi,
  APPOINTMENT_TITLE_LABELS,
  ApiError,
  type Appointment,
  type InspoUpload,
  type FittingPhoto,
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// ── helpers ───────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtWeddingDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncate(str: string | null | undefined, max: number) {
  if (!str) return null;
  return str.length > max ? str.slice(0, max) + "…" : str;
}

// ── Journey card ──────────────────────────────────────────────────────────────

type JourneyEvent = {
  type: "completed" | "in-progress" | "coming-soon";
  title: string;
};

function JourneyCard({ events }: { events: JourneyEvent[] }) {
  // If no events, show Consultation as the current stage
  if (events.length === 0) {
    return (
      <div className="relative mt-4 space-y-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#F5EFE9]" />
        <div className="flex items-center gap-3 relative">
          <div className="w-4 h-4 rounded-full border-2 border-[#D4A373] bg-white flex items-center justify-center z-10 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
          </div>
          <span className="text-sm font-medium text-[#333333]">
            Consultation
          </span>
        </div>
        {["1st Fitting", "2nd Fitting", "Final Fitting", "Pickup"].map(
          (label) => (
            <div key={label} className="flex items-center gap-3 relative">
              <Circle
                size={16}
                className="text-[#E8E0D5] bg-white rounded-full z-10 shrink-0"
              />
              <span className="text-sm text-[#AAAAAA]">{label}</span>
            </div>
          ),
        )}
      </div>
    );
  }

  // Show max 5 events: last 2 completed + current + next 2 upcoming
  const completed = events.filter((e) => e.type === "completed");
  const current = events.find((e) => e.type === "in-progress");
  const upcoming = events.filter((e) => e.type === "coming-soon");

  const shown: (JourneyEvent & { _key: string })[] = [];

  // up to 2 most recent completed
  completed
    .slice(-2)
    .forEach((e, i) => shown.push({ ...e, _key: `done-${i}` }));
  // current
  if (current) shown.push({ ...current, _key: "current" });
  // up to 2 upcoming
  upcoming
    .slice(0, 2)
    .forEach((e, i) => shown.push({ ...e, _key: `soon-${i}` }));

  // pad to 5 if fewer events exist
  while (shown.length < 5) {
    shown.push({
      type: "coming-soon",
      title: "—",
      _key: `pad-${shown.length}`,
    });
  }

  return (
    <div className="relative mt-4 space-y-4">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#F5EFE9]" />
      {shown.slice(0, 5).map((e) => {
        if (e.type === "completed") {
          return (
            <div key={e._key} className="flex items-center gap-3 relative">
              <CheckCircle2
                size={16}
                className="text-[#D4A373] bg-white rounded-full z-10 shrink-0"
              />
              <span className="text-sm text-[#888888] line-through">
                {e.title}
              </span>
            </div>
          );
        }
        if (e.type === "in-progress") {
          return (
            <div key={e._key} className="flex items-center gap-3 relative">
              <div className="w-4 h-4 rounded-full border-2 border-[#D4A373] bg-white flex items-center justify-center z-10 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
              </div>
              <span className="text-sm font-medium text-[#333333]">
                {e.title}
              </span>
            </div>
          );
        }
        return (
          <div key={e._key} className="flex items-center gap-3 relative">
            <Circle
              size={16}
              className="text-[#E8E0D5] bg-white rounded-full z-10 shrink-0"
            />
            <span className="text-sm text-[#AAAAAA]">{e.title}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function BridePortal() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: me } = useQuery({
    queryKey: ["bride-me"],
    queryFn: () => bridesApi.me(),
  });

  const { data: allAppts = [] } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => appointmentsApi.myAppointments(),
  });

  const { data: journey } = useQuery({
    queryKey: ["bride-journey"],
    queryFn: () => bridesApi.journey(),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payments", "me"],
    queryFn: () => paymentsApi.listMine(),
  });

  const { data: fittings = [] } = useQuery({
    queryKey: ["fittings-mine"],
    queryFn: () => fittingsApi.listMine(),
  });

  const { data: inspo = [] } = useQuery({
    queryKey: ["inspo-mine"],
    queryFn: () => inspoApi.listMine(),
  });

  // ── Derived data ───────────────────────────────────────────────────────────

  const firstName = me?.name ?? "there";
  const weddingDate = me?.brideProfile?.weddingDate ?? null;
  const days = daysUntil(weddingDate);

  // upcoming appointments: today or future, max 3
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingAppts: Appointment[] = allAppts
    .filter(
      (a) =>
        (a.status === "SCHEDULED" || a.status === "RESCHEDULED") &&
        new Date(a.startTime) >= now,
    )
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .slice(0, 2);

  const nextAppt = upcomingAppts[0] ?? null;

  // payments summary
  const totalAmount = payments.reduce((s, p) => s + Number(p.amount), 0);
  const paidAmount = payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.amount), 0);
  const remaining = totalAmount - paidAmount;
  const fullyPaid = totalAmount > 0 && remaining === 0;

  // recent fitting photos: flatten all photos, sort by uploadedAt, take 2
  const allPhotos: (FittingPhoto & { fittingNum: number })[] = fittings
    .flatMap((f) =>
      f.photos.map((p) => ({ ...p, fittingNum: f.fittingNumber })),
    )
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  const recentPhotos = allPhotos.slice(0, 2);

  // recent inspo: last 4
  const recentInspo: InspoUpload[] = [...inspo]
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
    .slice(0, 4);

  // ── Inspo upload ───────────────────────────────────────────────────────────

  async function handleInspoFiles(files: FileList | null) {
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => {
      if (!["image/jpeg", "image/png"].includes(f.type)) {
        toast({
          title: "Invalid file type",
          description: `${f.name} must be JPEG or PNG.`,
        });
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${f.name} exceeds 10MB.`,
        });
        return false;
      }
      return true;
    });
    if (!valid.length) return;
    setUploading(true);
    try {
      await inspoApi.upload(valid.slice(0, 5));
      queryClient.invalidateQueries({ queryKey: ["inspo-mine"] });
      toast({ title: "Photos uploaded" });
    } catch (err) {
      toast({
        title: "Upload failed",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <BridePortalLayout>
      <main className="flex-1 overflow-auto bp-page-main">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
              Welcome back, {firstName}
            </h1>

            {weddingDate && days !== null ? (
              <div className="bg-[#E8D8CE]/40 border border-[#D4A373]/20 rounded-xl p-4 flex items-center justify-center gap-3 shadow-sm">
                <Heart className="text-[#D4A373]" fill="#D4A373" size={20} />
                <span className="text-[#555555] text-lg font-['Cormorant_Garamond'] italic">
                  Your wedding is in{" "}
                  <span className="font-semibold text-[#333333]">
                    {days > 0
                      ? `${days} days`
                      : days === 0
                        ? "today"
                        : "the past"}
                  </span>{" "}
                  &middot; {fmtWeddingDate(weddingDate)}
                </span>
              </div>
            ) : (
              <div className="bg-[#E8D8CE]/40 border border-[#D4A373]/20 rounded-xl p-4 flex items-center justify-center gap-3 shadow-sm">
                <Heart className="text-[#D4A373]" fill="#D4A373" size={20} />
                <span className="text-[#555555] text-lg font-['Cormorant_Garamond'] italic">
                  Your dress journey has begun
                </span>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Next Appointment */}
            <Card
              className="bg-white border-[#E8E0D5] shadow-sm rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/bride/appointments")}
            >
              <CardContent className="p-6">
                <div className="text-sm text-[#888888] font-medium uppercase tracking-wider mb-3">
                  Next Appointment
                </div>
                {nextAppt ? (
                  <div className="space-y-4">
                    <div className="font-['Cormorant_Garamond'] text-2xl font-medium text-[#2C2C2C]">
                      {APPOINTMENT_TITLE_LABELS[nextAppt.title] ??
                        nextAppt.title}
                    </div>
                    <div className="space-y-2 text-[#555555] text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-[#D4A373]" />
                        <span>{fmtDate(nextAppt.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-[#D4A373]" />
                        <span>{fmtTime(nextAppt.startTime)}</span>
                      </div>
                      {nextAppt.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#D4A373]" />
                          <span>{nextAppt.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-[#AAAAAA] text-sm mt-4">
                    No upcoming appointments
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Journey Stage */}
            <Card className="bg-white border-[#E8E0D5] shadow-sm rounded-xl overflow-hidden md:col-span-1">
              <CardContent className="p-6">
                <div className="text-sm text-[#888888] font-medium uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>Dress Journey Stage</span>
                  <button
                    onClick={() => navigate("/bride/dress-journey")}
                    className="text-[#D4A373] text-xs lowercase flex items-center hover:underline cursor-pointer"
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>

                {journey ? (
                  <JourneyCard events={journey.events} />
                ) : (
                  <div className="flex justify-center py-6">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#D4A373]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Outstanding Balance */}
            <Card className="bg-white border-[#E8E0D5] shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="text-sm text-[#888888] font-medium uppercase tracking-wider mb-3">
                    Outstanding Balance
                  </div>
                  {totalAmount > 0 ? (
                    <>
                      <div className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#B87A4F] mb-1">
                        {fullyPaid ? (
                          <span className="text-[#4CAF50]">Fully Paid</span>
                        ) : (
                          <>
                            ${remaining.toLocaleString()}{" "}
                            <span className="text-lg font-sans text-[#888888] font-normal">
                              remaining
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-[#888888]">
                        ${paidAmount.toLocaleString()} paid of $
                        {totalAmount.toLocaleString()} total
                      </div>
                    </>
                  ) : (
                    <div className="text-[#AAAAAA] text-sm mt-2">
                      No payment schedule yet
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate("/bride/payments")}
                  className="w-full py-2.5 mt-4 rounded-md bg-[#333333] text-white text-sm font-medium hover:bg-[#222222] transition-colors cursor-pointer"
                >
                  View Payments
                </button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Upcoming Appointments */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#E8E0D5] pb-2">
                <h2 className="text-2xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
                  Upcoming Appointments
                </h2>
                <button
                  onClick={() => navigate("/bride/appointments")}
                  className="text-sm text-[#A67C52] hover:underline mb-1 cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {upcomingAppts.length === 0 && (
                  <div className="text-sm text-[#AAAAAA] py-4 text-center">
                    No upcoming appointments
                  </div>
                )}
                {upcomingAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white p-4 rounded-xl border border-[#E8E0D5] flex gap-4 items-start shadow-sm"
                  >
                    <div className="bg-[#F5EFE9] text-[#A67C52] p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px]">
                      <span className="text-xs uppercase font-medium">
                        {new Date(appt.startTime).toLocaleDateString("en-AU", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-xl font-['Cormorant_Garamond'] font-semibold">
                        {new Date(appt.startTime).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-[#333333]">
                          {APPOINTMENT_TITLE_LABELS[appt.title] ?? appt.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className="bg-[#E8D8CE]/30 text-[#A67C52] border-none font-normal shrink-0 ml-2"
                        >
                          {fmtTime(appt.startTime)}
                        </Badge>
                      </div>
                      {appt.location && (
                        <p className="text-sm text-[#666666] mt-1">
                          {appt.location}
                        </p>
                      )}
                      {appt.whatToBring && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="mt-3 bg-[#FAF8F5] p-2 rounded-md border border-[#E8E0D5]/50 flex gap-2 items-start cursor-default">
                                <span className="text-xs font-medium text-[#888888] uppercase mt-0.5 shrink-0">
                                  Note:
                                </span>
                                <span className="text-sm text-[#555555] truncate">
                                  {truncate(appt.whatToBring, 80)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            {appt.whatToBring.length > 80 && (
                              <TooltipContent className="max-w-xs text-sm">
                                {appt.whatToBring}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Fitting Photos */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#E8E0D5] pb-2">
                <h2 className="text-2xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
                  Recent Fitting Photos
                </h2>
                <button
                  onClick={() => navigate("/bride/fitting-photos")}
                  className="text-sm text-[#A67C52] hover:underline mb-1 cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {recentPhotos.length === 0
                  ? [0, 1].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#E8D8CE]/40 to-[#E8E0D5]/60 flex items-center justify-center border border-[#E8E0D5]">
                          <Camera className="text-[#D4A373]/50 w-8 h-8" />
                        </div>
                        <p className="text-xs text-[#CCCCCC] px-1">
                          No photos yet
                        </p>
                      </div>
                    ))
                  : recentPhotos.map((photo) => (
                      <div key={photo.id} className="space-y-2">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#E8E0D5]">
                          <img
                            src={photo.imageUrl}
                            alt={photo.caption ?? `Fitting ${photo.fittingNum}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-[#888888] flex items-center gap-1.5 px-1">
                          <Avatar className="w-4 h-4">
                            <AvatarFallback className="bg-[#333333] text-[8px] text-white">
                              FK
                            </AvatarFallback>
                          </Avatar>
                          Fitting {photo.fittingNum} &middot;{" "}
                          {new Date(photo.uploadedAt).toLocaleDateString(
                            "en-AU",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          {/* Inspiration Board */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-end border-b border-[#E8E0D5] pb-2">
              <h2 className="text-2xl font-['Cormorant_Garamond'] font-medium text-[#2C2C2C]">
                My Inspiration Board
              </h2>
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={() => navigate("/bride/inspiration")}
                  className="text-sm text-[#A67C52] hover:underline cursor-pointer"
                >
                  View all
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-sm text-[#A67C52] hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  Upload New
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => handleInspoFiles(e.target.files)}
            />

            <div className="grid grid-cols-4 gap-4">
              {recentInspo.length === 0
                ? [0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-lg bg-gradient-to-r from-[#F5EFE9] to-[#E8D8CE]/30 border border-[#E8E0D5] flex items-center justify-center"
                    >
                      <ImageIcon className="text-[#D4A373]/40 w-6 h-6" />
                    </div>
                  ))
                : recentInspo.map((img) => (
                    <div
                      key={img.id}
                      className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E8E0D5] cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => navigate("/bride/inspiration")}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.caption ?? "Inspiration"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </main>
    </BridePortalLayout>
  );
}
