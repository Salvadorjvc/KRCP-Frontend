export interface OrdenTrabajoResponseDto{
    otId: number;
    codigoOt: string;

    clienteId: number;
    razonSocialCliente: string;

    equipoComponente: string;
    numeroSerie: string;

    usuarioPlanificadorId: number;
    nombrePlanificador: string;

    tecnicoAsignadoId: number | null;
    nombreTecnico: string | null;

    estado: EstadoOrdenTrabajo;
    fechaIngreso: string;
    fechaEstimadaEntrega: string | null;
    fechaCierre: string | null;
    costoManoObra: number;
    costoRepuestos: number;
    costoTotal: number;
    observaciones: string | null;
    activo: boolean;
    fechaModificacion: string | null;

    usuarioModificacionId: number | null;
    nombreUsuarioModificacion: string | null;
}

export interface OrdenTrabajoCreateRequestDto{
    clienteId: number;
    equipoComponente: string;
    numeroSerie: string;
    fechaEstimadaEntrega: string | null;
    costoManoObra: number;
    observaciones: string | null;
}

export interface OrdenTrabajoUpdateRequestDto{
    equipoComponente: string;
    numeroSerie: string;
    fechaEstimadaEntrega: string | null;
    costoManoObra: number;
    observaciones: string | null;
}

export interface AsignarTecnicoRequestDto{
    tecnicoId: number;
}

export interface CambiarEstadoRequestDto{
    nuevoEstado: EstadoOrdenTrabajo;
}

// Objeto de estados estilo "enum" con strings literales
export const ESTADOS = {
    Registrado: "Registrado",
    EnProceso: "EnProceso",
    QaPruebas: "QaPruebas",
    Completado: "Completado",
    Cancelado: "Cancelado",
} as const;

// El tipo se deriva automáticamente de los valores del objeto
export type EstadoOrdenTrabajo = typeof ESTADOS[keyof typeof ESTADOS];