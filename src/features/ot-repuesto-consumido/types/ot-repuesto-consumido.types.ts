export interface OtRepuestoConsumidoResponseDto{
    detalleId: number;

    otId: number;
    codigoOt: string;

    productoId: number;
    codigoParte: string;
    nombreProducto: string;

    cantidad: number;
    precioUnitarioHistorico: number;
    subtotal: number;

    usuarioAlmacenId: number;
    nombreUsuarioAlmacen: string;

    fechaDespacho: string;
}

export interface OtRepuestoConsumidoCreateRequestDto{
    otId: number;
    productoId: number;
    cantidad: number;
}