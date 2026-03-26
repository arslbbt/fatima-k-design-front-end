import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { LoginBride } from "@/components/LoginBride";
import { ForgotPassword } from "@/components/ForgotPassword";
import HomePage from "@/pages/HomePage";

import { BridePortal } from "@/components/BridePortal";
import { BridePortalAppointments } from "@/components/BridePortalAppointments";
import { BridePortalDressJourney } from "@/components/BridePortalDressJourney";
import { BridePortalInspiration } from "@/components/BridePortalInspiration";
import { BridePortalFittingPhotos } from "@/components/BridePortalFittingPhotos";
import { BridePortalPayments } from "@/components/BridePortalPayments";
import { BridePortalDocuments } from "@/components/BridePortalDocuments";
import { BrideProfileSetup } from "@/components/BrideProfileSetup";
import { BrideAccountManagement } from "@/components/BrideAccountManagement";

import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminAllBrides } from "@/components/AdminAllBrides";
import { AdminAppointmentsDesktop } from "@/components/AdminAppointmentsDesktop";
import { AdminPaymentsDesktop } from "@/components/AdminPaymentsDesktop";
import { AdminDocumentsDesktop } from "@/components/AdminDocumentsDesktop";
import { AdminSettings } from "@/components/AdminSettings";
import { AdminTeam } from "@/components/AdminTeam";
import { AdminFittings } from "@/components/AdminFittings";
import { AdminInspo } from "@/components/AdminInspo";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF8F5",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 72,
            fontWeight: 300,
            color: "#D4A373",
            lineHeight: 1,
          }}
        >
          404
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#888",
            marginTop: 12,
            marginBottom: 24,
          }}
        >
          Page not found
        </div>
        <a
          href="/"
          style={{ fontSize: 13, color: "#A67C52", textDecoration: "none" }}
        >
          ← Back to home
        </a>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <HomePage />;
  return <Redirect to={user.role === "ADMIN" ? "/admin" : "/bride"} />;
}

function Router() {
  return (
    <Switch>
      {/* Root — redirect based on auth state */}
      <Route path="/" component={RootRedirect} />

      {/* Public */}
      <Route path="/login" component={LoginBride} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Bride Portal — BRIDE role only */}
      <Route path="/bride">
        <ProtectedRoute role="BRIDE">
          <BridePortal />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/appointments">
        <ProtectedRoute role="BRIDE">
          <BridePortalAppointments />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/dress-journey">
        <ProtectedRoute role="BRIDE">
          <BridePortalDressJourney />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/inspiration">
        <ProtectedRoute role="BRIDE">
          <BridePortalInspiration />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/fitting-photos">
        <ProtectedRoute role="BRIDE">
          <BridePortalFittingPhotos />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/payments">
        <ProtectedRoute role="BRIDE">
          <BridePortalPayments />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/documents">
        <ProtectedRoute role="BRIDE">
          <BridePortalDocuments />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/profile-setup">
        <ProtectedRoute role="BRIDE">
          <BrideProfileSetup />
        </ProtectedRoute>
      </Route>
      <Route path="/bride/account">
        <ProtectedRoute role="BRIDE">
          <BrideAccountManagement />
        </ProtectedRoute>
      </Route>

      {/* Admin — ADMIN role only */}
      <Route path="/admin">
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/brides">
        <ProtectedRoute role="ADMIN">
          <AdminAllBrides />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/appointments">
        <ProtectedRoute role="ADMIN">
          <AdminAppointmentsDesktop />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/payments">
        <ProtectedRoute role="ADMIN">
          <AdminPaymentsDesktop />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/documents">
        <ProtectedRoute role="ADMIN">
          <AdminDocumentsDesktop />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute role="ADMIN">
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/team">
        <ProtectedRoute role="ADMIN">
          <AdminTeam />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/fittings">
        <ProtectedRoute role="ADMIN">
          <AdminFittings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/inspo">
        <ProtectedRoute role="ADMIN">
          <AdminInspo />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
