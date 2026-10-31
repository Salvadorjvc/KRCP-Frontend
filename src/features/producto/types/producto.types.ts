export interface ProductoResponseDto{
    productoId: number;
    codigoParte: string;
    nombre: string;
    stockActual: number;
    stockMinimo: number;
    costoUnitario: number;
    activo: boolean;
    fechaCreacion: string;
    fechaModificacion: string | null;

    categoriaId: number;
    nombreCategoria: string;

    ubicacionId: number | null;
    codigoUbicacion: string | null;

    usuarioModificacionId: number | null;
    nombreUsuarioModificacion: string | null;
}

export interface ProductoCreateRequestDto{
    codigoParte: string;
    nombre: string;
    categoriaId: number;
    ubicacionId: number | null;
    stockMinimo: number;
    costoUnitario: number;
}

export interface ProductoUpdateRequestDto{
    nombre: string;
    categoriaId: number;
    ubicacionId: number | null;
    stockMinimo: number;
    costoUnitario: number;
    activo: boolean;
}