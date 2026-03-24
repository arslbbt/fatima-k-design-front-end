import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "@/pages/HomePage";

import { LoginBride } from "@/components/LoginBride";
import { LoginAdmin } from "@/components/LoginAdmin";
import { ForgotPassword } from "@/components/ForgotPassword";

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

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF8F5", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 72, fontWeight: 300, color: "#D4A373", lineHeight: 1 }}>404</div>
        <div style={{ fontSize: 16, color: "#888", marginTop: 12, marginBottom: 24 }}>Page not found</div>
        <a href="/fatimak-portal/" style={{ fontSize: 13, color: "#A67C52", textDecoration: "none" }}>← Back to home</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />

      {/* Auth */}
      <Route path="/login" component={LoginBride} />
      <Route path="/admin/login" component={LoginAdmin} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Bride Portal */}
      <Route path="/bride" component={BridePortal} />
      <Route path="/bride/appointments" component={BridePortalAppointments} />
      <Route path="/bride/dress-journey" component={BridePortalDressJourney} />
      <Route path="/bride/inspiration" component={BridePortalInspiration} />
      <Route path="/bride/fitting-photos" component={BridePortalFittingPhotos} />
      <Route path="/bride/payments" component={BridePortalPayments} />
      <Route path="/bride/documents" component={BridePortalDocuments} />
      <Route path="/bride/profile-setup" component={BrideProfileSetup} />
      <Route path="/bride/account" component={BrideAccountManagement} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/brides" component={AdminAllBrides} />
      <Route path="/admin/appointments" component={AdminAppointmentsDesktop} />
      <Route path="/admin/payments" component={AdminPaymentsDesktop} />
      <Route path="/admin/documents" component={AdminDocumentsDesktop} />

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
