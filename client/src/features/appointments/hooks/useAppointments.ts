import { useMutation } from "@tanstack/react-query";
import { useCrudResource } from "@shared/hooks/useCrudResource";
import { appointmentsService } from "@shared/services/appointments.service";
import type { AppointmentStatus } from "@shared/types";

export const appointmentKeys = {
  all: ["appointments"] as const,
};

export function useAppointments() {
  const resource = useCrudResource(appointmentKeys.all, appointmentsService);

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsService.updateStatus(id, status),
    onSuccess: resource.invalidate,
    onError: (error) => window.alert(error.message),
  });

  return { ...resource, updateStatus };
}
