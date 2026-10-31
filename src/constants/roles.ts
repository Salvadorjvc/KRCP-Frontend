export const ROLES = {
    Admin: "Admin",
    Planificador: "Planificador",
    TecnicoAlmacen:"TecnicoAlmacen",
    Gerencia: "Gerencia",
} as const;

// un typeof que equivale a: "Admin" | "Planificador" | "TecnicoAlmacen" | "Gerencia"
export type Role = typeof ROLES[keyof typeof ROLES];

// un objeto que se llena automaticamente con todos los roles y sirve como un rol tmb
export const TODOS = Object.values(ROLES) as Role[];