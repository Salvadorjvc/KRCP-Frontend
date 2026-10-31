import {Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import Unauthorized from "@/components/common/Unauthorized";

import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import MainLayout from "@/components/layout/MainLayout";

import { ORDEN_TRABAJO_DETALLE, ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";

import RolesPage from "@/features/rol/RolesPage";
import ClientesPage from "@/features/cliente/ClientesPage";
import UsuariosPage from "@/features/usuario/UsuariosPage";
import CategoriasPage from "@/features/categoria/CategoriasPage";
import UbicacionPage from "@/features/ubicacion/UbicacionesPage";
import ProductosPage from "@/features/producto/ProductosPage";
import OrdenesTrabajoPage from "@/features/orden-trabajo/OrdenTrabajoPage";
import OrdenTrabajoDetallePage from "@/features/orden-trabajo/OrdenTrabajoDetallePage";

export function AppRouter(){ 
    return(
    <Routes>
        {/* Rutas publicas*/}
        <Route path= {ROUTES.Login} element={<LoginPage />} />
        <Route path={ROUTES.Unauthorized} element={<Unauthorized />}/>

        {/* Rutas protegidas: requieren estar logueado */}
        <Route element = {<ProtectedRoute />}>
           <Route element={<MainLayout />}>

           <Route path={ROUTES.Dashboard} element={<DashboardPage />} />

           {/* Ruta con restricción de rol (admin) */}
          <Route element={<RoleRoute allowedRoles= {[ROLES.Admin]} />}>  
                <Route path={ROUTES.Rol} element={<RolesPage/>} /> 
                <Route path={ROUTES.Usuario} element={<UsuariosPage />} /> 
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.Admin, ROLES.Planificador, ROLES.TecnicoAlmacen]} />}>
              <Route path={ROUTES.OrdenTrabajo} element={<OrdenesTrabajoPage/>}/>
              <Route path= {ORDEN_TRABAJO_DETALLE} element={<OrdenTrabajoDetallePage/>}/>
          </Route>

           {/* Todos lo pueden ver, pero dentro de su page se configura que rol puede acceder a editar */}
          <Route path={ROUTES.Cliente} element={<ClientesPage />} />
          <Route path={ROUTES.Categoria} element={<CategoriasPage/>} />
          <Route path={ROUTES.Ubicacion} element={<UbicacionPage/>} />
          <Route path={ROUTES.Producto} element={<ProductosPage/>} />

          </Route>
        </Route>

        {/* Redireccion por defecto */}
        <Route path="*" element={<Navigate to={ROUTES.Dashboard} replace />} />
    </Routes> 
    );
}
