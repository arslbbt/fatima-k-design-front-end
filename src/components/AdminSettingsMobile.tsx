import { ChevronRight, Menu, User, Bell, MapPin, Clock, Lock, HelpCircle, LogOut, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const S = { bg: "#FAF8F5", sidebar: "#F5EFE9", border: "#E8E0D5", accent: "#D4A373", accentText: "#A67C52", dark: "#2C2C2C", muted: "#888888", serif: "'Cormorant Garamond', serif", sans: "'DM Sans', sans-serif" };

function ToggleRow({ label, sub, on = false }: { label: string; sub?: string; on?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid #F0EBE4` }}>
      <div>
        <div style={{ fontSize: 13, color: S.dark }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ width: 38, height: 22, borderRadius: 11, background: on ? "#333" : "#E0E0E0", position: "relative", flexShrink: 0 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 19 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value, chevron = true }: { icon: React.ReactNode; label: string; value?: string; chevron?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: `1px solid #F0EBE4`, cursor: "pointer" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: S.sidebar, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: S.dark }}>{label}</div>
        {value && <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>{value}</div>}
      </div>
      {chevron && <ChevronRight size={15} color="#CCCCCC" />}
    </div>
  );
}

export function AdminSettingsMobile() {
  return (
    <div style={{ width: 390, minHeight: 844, background: S.bg, fontFamily: S.sans, color: "#333", display: "flex", flexDirection: "column" }}>
      <header style={{ background: S.sidebar, borderBottom: `1px solid ${S.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div>
          <img src="/fatimak-logo.jpg" alt="Fatima K" style={{ height: 20, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", display: "block" }} />
          <div style={{ fontSize: 8, color: "#AAAAAA", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>Admin</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar style={{ width: 30, height: 30, border: "1.5px solid #33333340" }}><AvatarFallback style={{ background: "#333", color: "#fff", fontSize: 10, fontWeight: 600 }}>FK</AvatarFallback></Avatar>
          <Menu size={22} color="#555" />
        </div>
      </header>
      <div style={{ background: "#fff", borderBottom: `1px solid ${S.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: S.muted }}>Admin</span><ChevronRight size={12} color={S.muted} /><span style={{ fontSize: 11, color: S.dark, fontWeight: 600 }}>Settings</span>
      </div>

      <div style={{ padding: "18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Profile card */}
        <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 12, padding: "18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <Avatar style={{ width: 54, height: 54, border: `2px solid ${S.accent}40` }}>
            <AvatarFallback style={{ background: "#333", color: "#fff", fontSize: 18, fontWeight: 600 }}>FK</AvatarFallback>
          </Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: S.serif, fontSize: 20, fontWeight: 500, color: S.dark }}>Fatima K</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>Studio Owner · Designer</div>
            <div style={{ fontSize: 11, color: S.accentText, marginTop: 4 }}>fatimak.com.au</div>
          </div>
          <button style={{ padding: "6px 12px", background: S.sidebar, border: `1px solid ${S.border}`, borderRadius: 7, fontSize: 11, color: "#555", cursor: "pointer" }}>Edit</button>
        </div>

        {/* Studio settings */}
        <section>
          <div style={{ fontSize: 10, color: S.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 2 }}>Studio</div>
          <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <SettingRow icon={<MapPin size={15} color={S.accentText} />} label="Studio Location" value="Paddington, NSW 2021" />
            <SettingRow icon={<Clock size={15} color={S.accentText} />} label="Business Hours" value="Tue–Sat, 9am–5pm" />
            <SettingRow icon={<Mail size={15} color={S.accentText} />} label="Contact Email" value="hello@fatimak.com.au" />
            <SettingRow icon={<Phone size={15} color={S.accentText} />} label="Phone Number" value="+61 400 000 000" />
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div style={{ fontSize: 10, color: S.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 2 }}>Notifications</div>
          <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <ToggleRow label="Appointment reminders" sub="Send email 48hrs before" on={true} />
            <ToggleRow label="Payment reminders" sub="Alert when balance is due" on={true} />
            <ToggleRow label="New bride notifications" sub="Notify when bride joins" on={false} />
            <ToggleRow label="Photo upload confirmation" sub="Email bride when photos added" on={true} />
          </div>
        </section>

        {/* Account */}
        <section style={{ paddingBottom: 24 }}>
          <div style={{ fontSize: 10, color: S.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, paddingLeft: 2 }}>Account</div>
          <div style={{ background: "#fff", border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <SettingRow icon={<Lock size={15} color={S.accentText} />} label="Change Password" />
            <SettingRow icon={<HelpCircle size={15} color={S.accentText} />} label="Help & Support" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogOut size={15} color="#CC4444" />
              </div>
              <span style={{ fontSize: 13, color: "#CC4444" }}>Sign Out</span>
            </div>
          </div>
        </section>

      </div>

      <footer style={{ borderTop: `1px solid ${S.border}`, background: S.sidebar, padding: "16px 20px", textAlign: "center" }}>
        <img src="/fatimak-logo.jpg" alt="" style={{ height: 18, objectFit: "contain", mixBlendMode: "multiply", filter: "brightness(0.15)", marginBottom: 5 }} />
        <div style={{ fontSize: 10, color: "#AAAAAA" }}>© 2026 Fatima K Designs Australia</div>
      </footer>
    </div>
  );
}
