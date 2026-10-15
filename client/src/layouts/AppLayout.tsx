import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../shared";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="auth/login" replace />;
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
