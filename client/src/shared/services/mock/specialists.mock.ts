import type { Specialist } from "../../types";

/** Datos de ejemplo para la sección de especialistas (sin backend todavía). */
export const specialistsMock: Specialist[] = [
  {
    id: "s1",
    name: "Dra. Marina López",
    specialty: "Clínica general",
    email: "marina.lopez@lumen.com",
    phone: "+54 9 11 4444-1001",
    active: true,
  },
  {
    id: "s2",
    name: "Dr. Ignacio Fernández",
    specialty: "Cirugía",
    email: "ignacio.fernandez@lumen.com",
    phone: "+54 9 11 4444-1002",
    active: true,
  },
  {
    id: "s3",
    name: "Dra. Paula Giménez",
    specialty: "Dermatología",
    email: "paula.gimenez@lumen.com",
    phone: "+54 9 11 4444-1003",
    active: true,
  },
  {
    id: "s4",
    name: "Dr. Tomás Ibáñez",
    specialty: "Odontología",
    email: "tomas.ibanez@lumen.com",
    phone: "+54 9 11 4444-1004",
    active: false,
  },
  {
    id: "s5",
    name: "Dra. Sofía Benítez",
    specialty: "Cardiología",
    email: "sofia.benitez@lumen.com",
    phone: "+54 9 11 4444-1005",
    active: true,
  },
  {
    id: "s6",
    name: "Dr. Lautaro Medina",
    specialty: "Oftalmología",
    email: "lautaro.medina@lumen.com",
    phone: "+54 9 11 4444-1006",
    active: true,
  },
];
