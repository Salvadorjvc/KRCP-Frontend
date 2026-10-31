import type { EstadoOrdenTrabajo } from "../types/orden-trabajo.types"


export const ESTADO_LABEL: Record<EstadoOrdenTrabajo , string> = {
    Registrado: "Registrado",
    EnProceso: "En proceso",
    QaPruebas: "QA / Pruebas",
    Completado: "Completado",
    Cancelado: "Cancelado"
};

export const TRANSICIONES: Record<EstadoOrdenTrabajo, EstadoOrdenTrabajo[]> = {
    Registrado: ["EnProceso", "Cancelado"],
    EnProceso: ["QaPruebas", "Cancelado"],
    QaPruebas: ["Completado","EnProceso" ,"Cancelado"],
    Completado: [],
    Cancelado: []
};