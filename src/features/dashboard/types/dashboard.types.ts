export interface DashboardCardsResponseDto{
    totalOtsActivas: number;
    totalProductosStockBajo: number;
    valorTotalInventario: number;
}

export interface DashboardBarrasResponseDto{
    estado: string;
    cantidad: number;
}

export interface DashboardPieResponseDto{
    productoId: number;
    codigoParte: string;
    nombreProducto: string;
    cantidadTotalConsumida: number;
}