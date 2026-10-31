import { ROLES, TODOS, type Role } from "../constants/roles";
import { ROUTES, type Route } from "../constants/routes";

export interface MenuItem{
    label: string;
    path: Route;
    roles: Role[];
}

export const SIDEBAR_MENU: MenuItem[] = [
    { label: "Dashboard", path: ROUTES.Dashboard, roles: TODOS },
    { label: "Rol", path: ROUTES.Rol, roles: [ROLES.Admin]},
    { label: "Usuarios", path: ROUTES.Usuario, roles: [ROLES.Admin]},
    { label: "Clientes", path: ROUTES.Cliente, roles: TODOS},
    { label: "Categorias", path: ROUTES.Categoria, roles: TODOS},
    { label: "Ubicaciones", path: ROUTES.Ubicacion, roles: TODOS},
    { label: "Productos", path: ROUTES.Producto, roles: TODOS},
    { label: "OrdenTrabajo", path: ROUTES.OrdenTrabajo, roles: [ROLES.Admin, ROLES.Planificador, ROLES.TecnicoAlmacen]}
]