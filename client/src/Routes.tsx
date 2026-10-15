import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { FallbackLoading } from "./shared/components/FallbackLoading";
import AuthLayout from "./layouts/AuthLayout";
import { useAuth } from "./shared";
const PatientsListPage = lazy(() =>
  import("./features/patients/PatientsListPage").then((module) => ({
    default: module.PatientsListPage,
  })).catch((error) => {
    console.error("Error loading PatientsListPage:", error);
    return { default: () => <div>Error loading PatientsListPage</div> };
  })
);
const PatientDetailPage = lazy(() =>
  import("./features/patients/PatientDetailPage").then((module) => ({
    default: module.PatientDetailPage,
  })).catch((error) => {
    console.error("Error loading PatientDetailPage:", error);
    return { default: () => <div>Error loading PatientDetailPage</div> };
  })
);
const SpecialistsListPage = lazy(() =>
  import("./features/specialists/SpecialistsListPage").then((module) => ({
    default: module.SpecialistsListPage,
  })).catch((error) => {
    console.error("Error loading SpecialistsListPage:", error);
    return { default: () => <div>Error loading SpecialistsListPage</div> };
  })
);
const AppointmentsPage = lazy(() =>
  import("./features/appointments/AppointmentsPage").then((module) => ({
    default: module.AppointmentsPage,
  })).catch((error) => {
    console.error("Error loading AppointmentsPage:", error);
    return { default: () => <div>Error loading AppointmentsPage</div> };
  })
);
const InventoryPage = lazy(() =>
  import("./features/inventory/InventoryPage").then((module) => ({
    default: module.InventoryPage,
  })).catch((error) => {
    console.error("Error loading InventoryPage:", error);
    return { default: () => <div>Error loading InventoryPage</div> };
  })
);
const OwnersListPage = lazy(() =>
  import("./features/owners/OwnersListPage").then((module) => ({
    default: module.OwnersListPage,
  })).catch((error) => {
    console.error("Error loading OwnersListPage:", error);
    return { default: () => <div>Error loading OwnersListPage</div> };
  })
);
const LoginPage = lazy(() =>
  import("./features/auth/page/LoginPage").then((module) => ({
    default: module.LoginPage,
  })).catch((error) => {
    console.error("Error loading LoginPage:", error);
    return { default: () => <div>Error loading LoginPage</div> };
  })
);
const ComponenteInfinito = lazy(() =>
  import("./shared/components/FallbackActive").then((module) => ({
    default: module.ComponenteInfinito,
  })).catch((error) => {
    console.error("Error loading OwnersListPage:", error);
    return { default: () => <div>Error loading OwnersListPage</div> };
  })
);
const LandingPage = lazy(() =>
  import("./features/landing/LandingPage").then((module) => ({
    default: module.LandingPage,
  })).catch((error) => {
    console.error("Error loading LandingPage:", error);
    return { default: () => <div>Error loading LandingPage</div> };
  })
);
// Sin sesión: landing pública. Con sesión: directo al panel.
function HomeRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated
    ? <Navigate to="/pacientes" replace />
    : <LandingPage />;
}
export const Routes = createBrowserRouter([

  {
    path: "/home",
    element: (
      <Suspense fallback={<FallbackLoading />}>
        <HomeRoute />
      </Suspense>
    ),
    children: [
      {
        index:true
      }
    ]
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
      },
      {
        path: "pacientes",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <PatientsListPage />
          </Suspense>
        ),
      },
      {
        path: "pacientes/:id",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <PatientDetailPage />
          </Suspense>
        ),
      },
      {
        path: "duenos",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <SpecialistsListPage />
          </Suspense>
        ),
      },
      {
        path: "turnos",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <AppointmentsPage />
          </Suspense>
        ),
      },
      {
        path: "inventario",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <InventoryPage />
          </Suspense>
        ),
      },
      {
        path: "especialistas",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <SpecialistsListPage />
          </Suspense>
        ),
      },
      {
        path: "propietarios",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <OwnersListPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "loading",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <ComponenteInfinito />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<FallbackLoading />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
]);
