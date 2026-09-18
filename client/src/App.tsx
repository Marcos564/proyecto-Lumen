import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './layouts/AppLayout.tsx'
import { PatientsListPage } from './features/patients/PatientsListPage.tsx'
import { PatientDetailPage } from './features/patients/PatientDetailPage.tsx'
import { SpecialistsListPage } from './features/specialists/SpecialistsListPage.tsx'
import { AppointmentsPage } from './features/appointments/AppointmentsPage.tsx'
import { InventoryPage } from './features/inventory/InventoryPage.tsx'
import { OwnersListPage } from './features/owners/OwnersListPage.tsx'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/pacientes" replace />} />
            <Route path="pacientes" element={<PatientsListPage />} />
            <Route path="pacientes/:id" element={<PatientDetailPage />} />
            <Route path="duenos" element={<OwnersListPage />} />
            <Route path="especialistas" element={<SpecialistsListPage />} />
            <Route path="turnos" element={<AppointmentsPage />} />
            <Route path="inventario" element={<InventoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
