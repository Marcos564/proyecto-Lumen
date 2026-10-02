import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { FallbackLoading } from "./shared/components/FallbackLoading";

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
export const Routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/pacientes" replace />,
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
]);
