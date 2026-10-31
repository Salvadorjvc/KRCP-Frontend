export interface MovimientoKardexResponseDto{
    kardexId: number;

    productoId: number;
    codigoParte: string;
    nombreProducto: string;

    usuarioId: number;
    nombreUsuario: string;

    otId: number | null;
    codigoOt: string | null;
    tipoMovimiento: string;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    motivo: string | null;
    fechaMovimiento: string;
}

export interface MovimientoKardexCreateRequestDto{
    productoId: number;
    tipoMovimiento: TipoMovimientoKardex;
    cantidad: number;
    motivo: string | null;
}

export type TipoMovimientoKardex = 'Entrada' | 'Salida' |'Ajuste'| 'Devolucion';