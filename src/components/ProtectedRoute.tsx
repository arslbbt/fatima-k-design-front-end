import { Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: Role;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F5",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            color: "#C4A882",
          }}
        >
          Loading…
        </div>
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  if (user.role !== role) {
    return <Redirect to={user.role === "ADMIN" ? "/admin" : "/bride"} />;
  }

  return <>{children}</>;
}
