export interface ClienteResponseDto{
    clienteId: number;
    ruc: string;
    razonSocial: string;
    contactoEmail: string | null;
    telefono: string | null;
    activo: boolean;
    fechaCreacion: string;
    fechaModificacion: string | null;
}

export interface ClienteCreateRequestDto{
    ruc: string;
    razonSocial: string;
    contactoEmail: string | null;
    telefono: string | null;
}

export interface ClienteUpdateRequestDto{
    razonSocial: string;
    contactoEmail: string | null;
    telefono: string | null;
    activo: boolean;
}