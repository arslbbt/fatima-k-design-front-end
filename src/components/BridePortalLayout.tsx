import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Image as ImageIcon,
  Camera,
  CreditCard,
  FileText,
  Heart,
  Bell,
  Menu,
  X,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { bridesApi } from "@/lib/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/bride" },
  { icon: Calendar, label: "My Appointments", href: "/bride/appointments" },
  { icon: Scissors, label: "My Dress Journey", href: "/bride/dress-journey" },
  { icon: ImageIcon, label: "Inspiration", href: "/bride/inspiration" },
  { icon: Camera, label: "Fitting Photos", href: "/bride/fitting-photos" },
  { icon: CreditCard, label: "Payments", href: "/bride/payments" },
  { icon: FileText, label: "Documents", href: "/bride/documents" },
];

const bottomNavItems = [
  { icon: UserCircle, label: "Profile Setup", href: "/bride/profile-setup" },
  { icon: Settings, label: "My Account", href: "/bride/account" },
];

export function BridePortalLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useAuth();

  const { data: me } = useQuery({
    queryKey: ["bride-me"],
    queryFn: () => bridesApi.me(),
    enabled: !!user,
  });

  const initials =
    me?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ??
    user?.name.slice(0, 2).toUpperCase() ??
    "?";
  const displayName = me?.name ?? user?.name ?? "";
  const weddingDate = me?.brideProfile?.weddingDate
    ? new Date(me.brideProfile.weddingDate)
    : null;
  const weddingDateStr = weddingDate
    ? weddingDate.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const daysUntil = weddingDate
    ? Math.ceil((weddingDate.getTime() - Date.now()) / 86400000)
    : null;

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
          background: "#FFFFFF",
          borderBottom: "1px solid #E8E0D5",
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
            <Menu size={22} color="#555" />
          </button>
          <img
            src="/fatimak-portal/fatimak-logo.jpg"
            alt="Fatima K"
            style={{
              height: 28,
              objectFit: "contain",
              mixBlendMode: "multiply",
              filter: "brightness(0.15)",
            }}
          />
          <div
            className="bp-divider"
            style={{ width: 1, height: 24, background: "#E8E0D5" }}
          />
          <span
            className="bp-divider"
            style={{
              fontSize: 11,
              color: "#AAAAAA",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Bride Portal
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {daysUntil !== null && daysUntil > 0 && (
            <div
              className="bp-hide-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#888888",
              }}
            >
              <Heart size={14} fill="#D4A373" color="#D4A373" />
              <span>{daysUntil} days to go</span>
            </div>
          )}
          <button
            style={{
              position: "relative",
              padding: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Bell size={18} color="#666" />
          </button>
          <Link href="/bride/account">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 16,
                borderLeft: "1px solid #E8E0D5",
                cursor: "pointer",
              }}
            >
              <div className="bp-hide-mobile flex flex-col" style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
                  {displayName}
                </div>
                {weddingDateStr && (
                  <div style={{ fontSize: 11, color: "#AAA" }}>
                    Wedding · {weddingDateStr}
                  </div>
                )}
              </div>
              <Avatar
                style={{ width: 36, height: 36, border: "1.5px solid #E8D8CE" }}
              >
                <AvatarFallback
                  style={{
                    background: "#E8D8CE",
                    color: "#A67C52",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
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
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
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
            {bottomNavItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 8,
                      background: isActive ? "#E8D8CE" : "transparent",
                      color: isActive ? "#333333" : "#777777",
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    <Icon size={15} color={isActive ? "#A67C52" : "#999999"} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
            <button
              onClick={async () => {
                await logout();
                window.location.href = "/login";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                color: "#777777",
                fontSize: 12,
                cursor: "pointer",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                marginTop: 4,
              }}
            >
              <LogOut size={15} color="#999999" />
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
