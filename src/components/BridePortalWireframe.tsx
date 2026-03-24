export function BridePortalWireframe() {
  const WireBox = ({
    label,
    sublabel,
    className = "",
    crosshatch = false,
    dashed = false,
  }: {
    label: string;
    sublabel?: string;
    className?: string;
    crosshatch?: boolean;
    dashed?: boolean;
  }) => (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      style={{
        border: `1.5px ${dashed ? "dashed" : "solid"} #9CA3AF`,
        borderRadius: 4,
        background: crosshatch
          ? "repeating-linear-gradient(45deg,#E5E7EB,#E5E7EB 2px,#F9FAFB 2px,#F9FAFB 10px)"
          : "#F3F4F6",
        position: "relative",
      }}
    >
      {crosshatch && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 3l18 18M21 3L3 21" />
          </svg>
        </div>
      )}
      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", letterSpacing: "0.04em", lineHeight: 1.3, position: "relative", zIndex: 1 }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, position: "relative", zIndex: 1 }}>
          {sublabel}
        </span>
      )}
    </div>
  );

  const Divider = () => (
    <div style={{ height: 1, background: "#E5E7EB", margin: "10px 0" }} />
  );

  const Label = ({ children, muted = false }: { children: string; muted?: boolean }) => (
    <div style={{ fontSize: 10, fontWeight: muted ? 400 : 600, color: muted ? "#9CA3AF" : "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
      {children}
    </div>
  );

  const NavItem = ({ label, active = false }: { label: string; active?: boolean }) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 4,
      background: active ? "#E5E7EB" : "transparent",
      border: active ? "1.5px solid #9CA3AF" : "1.5px solid transparent",
      marginBottom: 4,
    }}>
      <div style={{ width: 14, height: 14, background: "#D1D5DB", borderRadius: 2 }} />
      <span style={{ fontSize: 12, color: active ? "#111827" : "#6B7280", fontWeight: active ? 600 : 400 }}>{label}</span>
      {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#374151" }} />}
    </div>
  );

  const StatCard = ({ title, value, sub, highlight = false }: { title: string; value: string; sub?: string; highlight?: boolean }) => (
    <div style={{ flex: 1, border: "1.5px solid #D1D5DB", borderRadius: 6, padding: "14px 16px", background: highlight ? "#F3F4F6" : "#FAFAFA" }}>
      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{sub}</div>}
    </div>
  );

  const TimelineDot = ({ label, done, active }: { label: string; done?: boolean; active?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        background: done ? "#374151" : active ? "#6B7280" : "#E5E7EB",
        border: active ? "2px solid #374151" : "2px solid #D1D5DB",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span style={{ fontSize: 9, color: active ? "#111827" : "#9CA3AF", marginTop: 4, fontWeight: active ? 600 : 400, textAlign: "center" }}>{label}</span>
    </div>
  );

  const AppointmentRow = ({ date, time, type, note }: { date: string; time: string; type: string; note: string }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #E5E7EB" }}>
      <div style={{ width: 36, height: 36, background: "#E5E7EB", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", textAlign: "center", lineHeight: 1.2 }}>{date}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{type}</div>
        <div style={{ fontSize: 10, color: "#6B7280" }}>{time}</div>
        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, background: "#D1D5DB", borderRadius: 1 }} />
          {note}
        </div>
      </div>
      <WireBox label="Details" className="px-2 py-1" style={{ fontSize: 10, border: "1px solid #D1D5DB", background: "#F3F4F6" } as any} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>

      {/* Top annotation bar */}
      <div style={{ background: "#111827", color: "#F9FAFB", padding: "8px 20px", fontSize: 11, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Fatima K Design · Bride Portal</span>
        <span style={{ color: "#6B7280", marginLeft: "auto" }}>Wireframe for Client Approval · v1.0</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["Dashboard", "Appointments", "Journey", "Inspiration", "Photos", "Payments"].map((p) => (
            <span key={p} style={{ background: "#374151", borderRadius: 3, padding: "2px 8px", fontSize: 10 }}>{p}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: 200, borderRight: "1.5px solid #E5E7EB", padding: "16px 12px", display: "flex", flexDirection: "column", background: "#F9FAFB", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ width: 32, height: 32, background: "#374151", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FFF", fontSize: 12, fontWeight: 700 }}>FK</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>Fatima K</div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>Design Studio</div>
            </div>
          </div>

          {/* Annotation */}
          <Label>Navigation</Label>
          <NavItem label="Dashboard" active />
          <NavItem label="My Appointments" />
          <NavItem label="Dress Journey" />
          <NavItem label="Inspiration" />
          <NavItem label="Fitting Photos" />
          <NavItem label="Payments" />

          {/* Spacer */}
          <div style={{ flex: 1 }} />
          <Divider />

          {/* Bride profile */}
          <div style={{ border: "1.5px dashed #D1D5DB", borderRadius: 4, padding: "10px", background: "#F3F4F6" }}>
            <Label muted>Bride Profile</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#D1D5DB", border: "1.5px solid #9CA3AF", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>Sophie Anderson</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>Wedding: 4 May 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>

          {/* Wedding countdown banner */}
          <div style={{ border: "1.5px dashed #9CA3AF", borderRadius: 6, padding: "12px 16px", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, background: "#D1D5DB", borderRadius: 3 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Your wedding is in 47 days</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>4th May 2026 — Countdown banner</div>
              </div>
            </div>
            <WireBox label="Share" className="px-3 py-1" />
          </div>

          {/* Page heading */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 2 }}>Welcome back, Sophie</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>H1 Heading · Cormorant Garamond · subheading text below</div>
          </div>

          {/* ── STAT CARDS ── */}
          <Label>Stats / Quick View Cards</Label>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <StatCard title="Next Appointment" value="Tue 24 Mar · 2:00 PM" sub="Final Fitting · Paddington Studio" />
            <div style={{ flex: 1, border: "1.5px solid #D1D5DB", borderRadius: 6, padding: "14px 16px", background: "#FAFAFA" }}>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Dress Journey</div>
              <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 8, left: 9, right: 9, height: 2, background: "#E5E7EB" }} />
                <TimelineDot label="Consult" done />
                <TimelineDot label="1st Fitting" done />
                <TimelineDot label="2nd Fitting" done />
                <TimelineDot label="Final Fitting" active />
                <TimelineDot label="Pickup" />
              </div>
            </div>
            <StatCard title="Outstanding Balance" value="$1,200" sub="$2,800 paid to date" highlight />
          </div>

          {/* ── TWO COLUMN ── */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>

            {/* Appointments col */}
            <div style={{ flex: 1.2, border: "1.5px solid #E5E7EB", borderRadius: 6, padding: "14px 16px", background: "#FAFAFA" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Label>Upcoming Appointments</Label>
                <span style={{ fontSize: 10, color: "#9CA3AF", border: "1px solid #E5E7EB", borderRadius: 3, padding: "2px 8px" }}>View all</span>
              </div>
              <AppointmentRow date="24 Mar" time="2:00 PM" type="Final Fitting" note="What to bring: shoes, veil, undergarments" />
              <AppointmentRow date="4 May" time="10:00 AM" type="Dress Pickup" note="What to bring: garment bag, ID" />
              <div style={{ border: "1.5px dashed #D1D5DB", borderRadius: 4, padding: "10px", marginTop: 8, textAlign: "center" }}>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>+ Add / Request Appointment (optional CTA)</span>
              </div>
            </div>

            {/* Fitting photos col */}
            <div style={{ flex: 1, border: "1.5px solid #E5E7EB", borderRadius: 6, padding: "14px 16px", background: "#FAFAFA" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Label>Recent Fitting Photos</Label>
                <span style={{ fontSize: 10, color: "#9CA3AF", border: "1px solid #E5E7EB", borderRadius: 3, padding: "2px 8px" }}>View all</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                {["Photo 1", "Photo 2", "Photo 3", "Photo 4"].map((p) => (
                  <div key={p}>
                    <WireBox label={p} crosshatch className="w-full" style={{ height: 80 } as any} />
                    <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 3 }}>Added by Fatima · 12 Mar</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── INSPIRATION BOARD ── */}
          <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 6, padding: "14px 16px", background: "#FAFAFA" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Label>My Inspiration Board</Label>
              <span style={{ fontSize: 10, color: "#9CA3AF", border: "1px solid #E5E7EB", borderRadius: 3, padding: "2px 8px" }}>Upload photo</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {["Lace ref", "Neckline", "Veil style", "Train length"].map((label) => (
                <div key={label} style={{ flex: 1 }}>
                  <WireBox label={label} crosshatch style={{ height: 90, width: "100%" } as any} />
                  <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 3, textAlign: "center" }}>Bride upload</div>
                </div>
              ))}
              <div style={{ flex: 1, border: "1.5px dashed #D1D5DB", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 90, background: "#F9FAFB" }}>
                <div style={{ fontSize: 18, color: "#D1D5DB" }}>+</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>Upload</div>
              </div>
            </div>
          </div>

          {/* Annotation footer */}
          <div style={{ marginTop: 20, border: "1px dashed #E5E7EB", borderRadius: 6, padding: "12px 16px", background: "#F9FAFB" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Page Sections Summary</div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                "A · Sidebar + Navigation",
                "B · Wedding Countdown Banner",
                "C · Quick Stats (Appointment / Journey / Balance)",
                "D · Upcoming Appointments List",
                "E · Fitting Photos Gallery (2×2)",
                "F · Inspiration Board (uploads)",
              ].map((s) => (
                <div key={s} style={{ fontSize: 10, color: "#9CA3AF" }}>— {s}</div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
