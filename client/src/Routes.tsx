import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@layouts/AppLayout";
import AuthLayout from "@layouts/AuthLayout";
import { FallbackLoading } from "@shared/components/FallbackLoading";
import { RequireAuth } from "@shared/components/RequireAuth";
import { useAuth } from "@shared";
import { lazyPage } from "@shared/utils/lazyPage";

const PatientsListPage = lazyPage(
  "PatientsListPage",
  () => import("@features/patients/PatientsListPage"),
);
const PatientDetailPage = lazyPage(
  "PatientDetailPage",
  () => import("@features/patients/PatientDetailPage"),
);
const SpecialistsListPage = lazyPage(
  "SpecialistsListPage",
  () => import("@features/specialists/SpecialistsListPage"),
);
const AppointmentsPage = lazyPage(
  "AppointmentsPage",
  () => import("@features/appointments/AppointmentsPage"),
);
const InventoryPage = lazyPage(
  "InventoryPage",
  () => import("@features/inventory/InventoryPage"),
);
const OwnersListPage = lazyPage(
  "OwnersListPage",
  () => import("@features/owners/OwnersListPage"),
);
const LoginPage = lazyPage(
  "LoginPage",
  () => import("@features/auth/page/LoginPage"),
);
const LandingPage = lazyPage(
  "LandingPage",
  () => import("@features/landing/LandingPage"),
);
const ComponenteInfinito = lazyPage(
  "ComponenteInfinito",
  () => import("@shared/components/FallbackActive"),
);

/** Envuelve una página diferida con el loader común de la aplicación. */
function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<FallbackLoading />}>{children}</Suspense>;
}

// Sin sesión: landing pública. Con sesión: directo al panel.
function HomeRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/pets" replace /> : <LandingPage />;
}

const privateRoutes = [
  { path: "pets", Page: PatientsListPage },
  { path: "pets/:id", Page: PatientDetailPage },
  { path: "owners", Page: OwnersListPage },
  { path: "appointments", Page: AppointmentsPage },
  { path: "stock", Page: InventoryPage },
  { path: "staff", Page: SpecialistsListPage },
];

export const Routes = createBrowserRouter([
  {
    path: "/home",
    element: (
      <Page>
        <HomeRoute />
      </Page>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/pets" replace /> },
      ...privateRoutes.map(({ path, Page: RoutePage }) => ({
        path,
        element: (
          <Page>
            <RoutePage />
          </Page>
        ),
      })),
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      {
        path: "loading",
        element: (
          <Page>
            <ComponenteInfinito />
          </Page>
        ),
      },
      {
        path: "login",
        element: (
          <Page>
            <LoginPage />
          </Page>
        ),
      },
    ],
  },
]);
