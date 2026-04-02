import { Heart, Calendar, Clock, MapPin, CheckCircle2, Circle, Camera, Upload, Menu, X, ChevronRight, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function BridePortalMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: "#FAF8F5", fontFamily: "'DM Sans', sans-serif", color: "#333333" }}>

      {/* ── Site Header (web nav style) ── */}
      <header style={{ background: "#F5EFE9", borderBottom: "1px solid #E8E0D5", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <img
          src="/fatimak-logo.jpg"
          alt="Fatima K Designs"
          style={{ height: 26, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: "1.5px solid #D4A37360" }}>
            <AvatarFallback style={{ background: "#E8D8CE", color: "#A67C52", fontSize: 11, fontWeight: 600 }}>SA</AvatarFallback>
          </Avatar>
          <Menu size={22} color="#555555" />
        </div>
      </header>

      {/* ── Breadcrumb / page title strip ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E0D5", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: "#AAAAAA", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>My Portal</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: "#2C2C2C", margin: 0, lineHeight: 1 }}>Dashboard</h1>
        </div>
        <span style={{ fontSize: 11, color: "#A67C52" }}>Sophie Anderson</span>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Countdown banner */}
        <div style={{ background: "linear-gradient(135deg, #F0E4D8, #EAD9CC)", border: "1px solid #D4A37330", borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <Heart size={18} fill="#D4A373" color="#D4A373" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#444444", fontStyle: "italic", lineHeight: 1.3 }}>
            Your wedding is in <strong style={{ color: "#2C2C2C", fontStyle: "normal" }}>47 days</strong> &middot; 4th May 2026
          </span>
        </div>

        {/* ── Section: Next appointment ── */}
        <section>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: "0 0 10px", paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            Next Appointment
          </h2>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: "#2C2C2C" }}>Final Fitting</div>
              <Badge style={{ background: "#E8D8CE", color: "#A67C52", border: "none", fontSize: 10 }}>Upcoming</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { icon: <Calendar size={13} color="#D4A373" />, text: "Tuesday 24 Mar 2026" },
                { icon: <Clock size={13} color="#D4A373" />, text: "2:00 PM" },
                { icon: <MapPin size={13} color="#D4A373" />, text: "Paddington Studio" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555555" }}>
                  {row.icon} {row.text}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, background: "#FAF8F5", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#666666", border: "1px solid #E8E0D5" }}>
              <span style={{ fontWeight: 600, color: "#888888", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>What to bring</span>
              Please bring your wedding shoes and veil to ensure the perfect hem length.
            </div>
          </div>
        </section>

        {/* ── Section: Dress Journey ── */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>Dress Journey</h2>
            <a href="#" style={{ fontSize: 12, color: "#A67C52", display: "flex", alignItems: "center", gap: 2 }}>View all <ChevronRight size={12} /></a>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {[
              { label: "Consultation", done: true },
              { label: "1st Fitting", done: true },
              { label: "2nd Fitting", done: true },
              { label: "Final Fitting", active: true },
              { label: "Pickup", upcoming: true },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < arr.length - 1 ? 12 : 0, position: "relative" }}>
                {i < arr.length - 1 && (
                  <div style={{ position: "absolute", left: 7, top: 18, width: 2, height: 20, background: step.done ? "#D4A373" : "#E8E0D5" }} />
                )}
                <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, zIndex: 1, background: step.done ? "#D4A373" : step.active ? "#FFFFFF" : "#E8E0D5", border: step.active ? "2px solid #D4A373" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {step.done && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                  {step.active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4A373" }} />}
                </div>
                <span style={{ fontSize: 13, color: step.done ? "#AAAAAA" : step.active ? "#2C2C2C" : "#CCCCCC", fontWeight: step.active ? 600 : 400, textDecoration: step.done ? "line-through" : "none" }}>
                  {step.label}
                </span>
                {step.active && <span style={{ marginLeft: "auto", fontSize: 10, color: "#A67C52", background: "#E8D8CE", padding: "2px 8px", borderRadius: 4 }}>In progress</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Payment Summary ── */}
        <section>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: "0 0 10px", paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            Payment Summary
          </h2>
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: 10, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Outstanding</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 500, color: "#B87A4F", lineHeight: 1 }}>$1,200</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Paid</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: "#555555" }}>$2,800</div>
              </div>
            </div>
            <div style={{ background: "#F0EBE4", borderRadius: 6, height: 6, marginBottom: 14 }}>
              <div style={{ width: "70%", height: "100%", background: "linear-gradient(90deg, #D4A373, #C8956A)", borderRadius: 6 }} />
            </div>
            <div style={{ fontSize: 11, color: "#888888", textAlign: "center", marginBottom: 12 }}>$2,800 paid of $4,000 total</div>
            <button style={{ width: "100%", padding: "11px", background: "#333333", color: "white", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.02em" }}>
              Make a Payment
            </button>
          </div>
        </section>

        {/* ── Section: Recent Fitting Photos ── */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>Fitting Photos</h2>
            <a href="#" style={{ fontSize: 12, color: "#A67C52" }}>View all</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              "linear-gradient(135deg, rgba(232,216,206,0.5), rgba(232,224,213,0.7))",
              "linear-gradient(225deg, rgba(232,224,213,0.7), #F5EFE9)",
              "linear-gradient(45deg, #F5EFE9, rgba(232,216,206,0.4))",
              "linear-gradient(315deg, rgba(232,224,213,0.5), #FAF8F5)",
            ].map((bg, i) => (
              <div key={i}>
                <div style={{ aspectRatio: "3/4", borderRadius: 10, background: bg, border: "1px solid #E8E0D5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Camera size={22} color="rgba(212,163,115,0.45)" />
                </div>
                <p style={{ fontSize: 10, color: "#888888", margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                  <Avatar style={{ width: 14, height: 14 }}><AvatarFallback style={{ background: "#333", color: "white", fontSize: 7 }}>FK</AvatarFallback></Avatar>
                  Added by Fatima · 12 Mar
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Inspiration Board ── */}
        <section style={{ paddingBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #E8E0D5" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: "#2C2C2C", margin: 0 }}>Inspiration Board</h2>
            <button style={{ fontSize: 12, color: "#A67C52", display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Upload size={12} /> Upload
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
            {["#F5EFE9", "#EDE4DA", "#F0E8E0", "#E8D8CE"].map((bg, i) => (
              <div key={i} style={{ width: 110, height: 140, borderRadius: 10, background: bg, border: "1px solid #E8E0D5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ImageIcon size={20} color="rgba(212,163,115,0.4)" />
              </div>
            ))}
            <div style={{ width: 110, height: 140, borderRadius: 10, border: "1.5px dashed #D4A373", background: "#FAFAFA", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <div style={{ fontSize: 24, color: "#D4A373", lineHeight: 1 }}>+</div>
              <span style={{ fontSize: 10, color: "#A67C52" }}>Add photo</span>
            </div>
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
