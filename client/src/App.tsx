import { RouterProvider } from "react-router-dom";
import { Routes as AppRoutes } from "./Routes.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRoutes} />
    </QueryClientProvider>
  );
}
