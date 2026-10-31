export interface UbicacionResponseDto{
    ubicacionId: number;
    codigoUbicacion: string;
    descripcion: string | null;
    activo: boolean;
}

export interface UbicacionCreateRequestDto{
    codigoUbicacion: string;
    descripcion: string | null;
}

export interface UbicacionUpdateRequestDto{
    codigoUbicacion: string;
    descripcion: string | null;
    activo: boolean;
}