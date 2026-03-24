import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const authPages = [
  { label: "Login", path: "/login" },
  { label: "Forgot Password", path: "/forgot-password" },
];

const bridePages = [
  { label: "Dashboard", path: "/bride" },
  { label: "My Appointments", path: "/bride/appointments" },
  { label: "Dress Journey", path: "/bride/dress-journey" },
  { label: "Inspiration Board", path: "/bride/inspiration" },
  { label: "Fitting Photos", path: "/bride/fitting-photos" },
  { label: "Payments", path: "/bride/payments" },
  { label: "Documents", path: "/bride/documents" },
  { label: "Profile Setup", path: "/bride/profile-setup" },
  { label: "My Account", path: "/bride/account" },
];

const adminPages = [
  { label: "Dashboard", path: "/admin" },
  { label: "All Brides", path: "/admin/brides" },
  { label: "Appointments", path: "/admin/appointments" },
  { label: "Payments", path: "/admin/payments" },
  { label: "Documents", path: "/admin/documents" },
];

interface PageGroup {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  badgeText: string;
  pages: { label: string; path: string }[];
}

const groups: PageGroup[] = [
  {
    title: "Authentication",
    subtitle: "Login and account access flows",
    badge: "Auth",
    badgeColor: "#F0F4FF",
    badgeText: "#6070AA",
    pages: authPages,
  },
  {
    title: "Bride Portal",
    subtitle: "Sophie Anderson's client-facing experience",
    badge: "9 screens",
    badgeColor: "#F5EFE9",
    badgeText: "#A67C52",
    pages: bridePages,
  },
  {
    title: "Admin Dashboard",
    subtitle: "Fatima K's studio management view",
    badge: "5 screens",
    badgeColor: "#F5EFE9",
    badgeText: "#A67C52",
    pages: adminPages,
  },
];

export default function HomePage() {
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F5",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E8E0D5",
          padding: "0 40px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={`${BASE}/fatimak-logo.jpg`}
            alt="Fatima K"
            style={{
              height: 30,
              objectFit: "contain",
              mixBlendMode: "multiply",
              filter: "brightness(0.15)",
            }}
          />
          <div style={{ width: 1, height: 24, background: "#E8E0D5" }} />
          <span
            style={{
              fontSize: 11,
              color: "#AAAAAA",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Design Mockups
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#AAAAAA" }}>
          17 screens · March 2026
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          padding: "64px 40px 48px",
          maxWidth: 960,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#D4A373",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            marginBottom: 16,
          }}
        >
          UI/UX Mockups
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 52,
            fontWeight: 400,
            color: "#2C2C2C",
            margin: "0 0 16px",
            lineHeight: 1.15,
          }}
        >
          Fatima K<br />
          <span style={{ fontWeight: 300, fontStyle: "italic" }}>
            Bride Portal & Admin Dashboard
          </span>
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#888",
            maxWidth: 520,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          A complete UI/UX design for fatimak.com.au — covering login flows, the
          bride's client portal, and Fatima's studio management dashboard.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 24px",
              background: "#2C2C2C",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign In →
          </button>
        </div>
      </section>

      {/* Screen groups */}
      <section
        style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px 80px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {groups.map((group, gi) => (
            <div
              key={gi}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E0D5",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              {/* Group header */}
              <div
                style={{
                  padding: "22px 24px 18px",
                  borderBottom: "1px solid #F0EBE4",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 5,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22,
                      fontWeight: 500,
                      color: "#2C2C2C",
                      margin: 0,
                    }}
                  >
                    {group.title}
                  </h2>
                  <span
                    style={{
                      fontSize: 9,
                      padding: "2px 8px",
                      background: group.badgeColor,
                      color: group.badgeText,
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    {group.badge}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#AAAAAA", margin: 0 }}>
                  {group.subtitle}
                </p>
              </div>

              {/* Page links */}
              <div style={{ padding: "10px 12px 14px" }}>
                {group.pages.map((page, pi) => (
                  <button
                    key={pi}
                    onClick={() => navigate(page.path)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "11px 14px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAF8F5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span
                      style={{ fontSize: 13, color: "#333", fontWeight: 400 }}
                    >
                      {page.label}
                    </span>
                    <span style={{ fontSize: 11, color: "#D4A373" }}>
                      View →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: 48,
            padding: "20px 24px",
            background: "#F5EFE9",
            borderRadius: 12,
            border: "1px solid #E8D8CE",
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D4A373",
              flexShrink: 0,
              marginTop: 5,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#2C2C2C",
                marginBottom: 4,
              }}
            >
              Design handoff notes
            </div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.65 }}>
              These are interactive UI mockups for client approval before
              development. All screens use Cormorant Garamond (headings) and DM
              Sans (body) with the Fatima K brand palette — background #FAF8F5,
              accent #D4A373 / #A67C52. Navigation and forms are fully
              interactive. All data shown is sample content.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
