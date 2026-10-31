export const ROUTES = {
    Login: "/login",
    Unauthorized: "/unauthorized",
    Dashboard: "/dashboard",
    Rol: "/rol",
    Usuario: "/usuario",
    Cliente: "/cliente",
    Categoria: "/categoria",
    Ubicacion: "/ubicacion",
    Producto: "/producto",
    OrdenTrabajo: "/ordenes-trabajo"

} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES ];

// Patrón para react-router y helper para construir el enlace
export const ORDEN_TRABAJO_DETALLE = `${ROUTES.OrdenTrabajo}/:id`;
export const ordenTrabajoDetallePath = (id: number) => `${ROUTES.OrdenTrabajo}/${id}`;
