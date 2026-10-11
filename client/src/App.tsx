import { RouterProvider } from "react-router-dom";
import { Routes as AppRoutes } from "./Routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./shared/index.ts";

const queryClient = new QueryClient();
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={AppRoutes} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
