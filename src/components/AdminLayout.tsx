import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  UserCog,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "All Brides", href: "/admin/brides" },
  { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: UserCog, label: "Admin Team", href: "/admin/team" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useAuth();

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "FK";
  const displayName = user?.name ?? "Admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#FAF8F5",
        fontFamily: "'DM Sans', sans-serif",
        color: "#333333",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 64,
          background: "#2C2C2C",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
          zIndex: 20,
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            className="bp-hamburger"
            style={{
              padding: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Menu size={22} color="rgba(255,255,255,0.8)" />
          </button>
          <img
            src="/fatimak-portal/fatimak-logo.jpg"
            alt="Fatima K"
            style={{
              height: 28,
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
            }}
          />
          <div
            className="bp-divider"
            style={{
              width: 1,
              height: 24,
              background: "rgba(255,255,255,0.15)",
            }}
          />
          <span
            className="bp-divider"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            style={{
              width: 34,
              height: 34,
              border: "1.5px solid rgba(255,255,255,0.2)",
            }}
          >
            <AvatarFallback
              style={{
                background: "#A67C52",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="bp-hide-mobile">
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
              {displayName}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              Studio Owner
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.38)",
              zIndex: 30,
            }}
          />
        )}

        {/* Sidebar — sticky, full viewport height minus header */}
        <aside
          className={`bp-sidebar${drawerOpen ? " bp-sidebar--open" : ""}`}
          style={{
            background: "#F5EFE9",
            borderRight: "1px solid #E8E0D5",
            padding: "24px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 31,
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          <div
            className="bp-close-row"
            style={{
              display: "none",
              justifyContent: "flex-end",
              marginBottom: 8,
            }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={18} color="#555" />
            </button>
          </div>

          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/admin" && location.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={`${item.href}-${item.label}`} href={item.href}>
                <div
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: isActive ? "#E8D8CE" : "transparent",
                    color: isActive ? "#333333" : "#666666",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  <Icon size={16} color={isActive ? "#A67C52" : "#888888"} />
                  {item.label}
                </div>
              </Link>
            );
          })}

          <div
            style={{
              marginTop: "auto",
              paddingTop: 12,
              borderTop: "1px solid #E8E0D5",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Link href="/admin/settings">
              <div
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  color: "#666666",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <Settings size={16} color="#888888" />
                Settings
              </div>
            </Link>
            <button
              onClick={async () => {
                await logout();
                window.location.href = "/login";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                color: "#666666",
                fontSize: 13,
                cursor: "pointer",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
              }}
            >
              <LogOut size={16} color="#888888" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
