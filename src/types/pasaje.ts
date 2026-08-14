export interface PasajeConsulta {
  asiento: string;
  serie: string;
  numero: string;
  pasajero: string;
  origen: string;
  destino: string;

  emision: string | null;

  precio: number;

  fechaViaje: string | null;

  turno: string;

  pdfUrl: string;
}