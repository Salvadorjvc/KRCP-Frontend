import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

interface RoleRouteProps {
    allowedRoles: string[];
}

export function RoleRoute({allowedRoles}: RoleRouteProps) {
    const {hasRole, isLoading} = useAuth();

    if( isLoading) {
        return <div>Cargando...</div> // luego remplazo este "cargando" por un componente spinner o skeleton
    }

    if (!hasRole(allowedRoles)){
        return <Navigate to={ROUTES.Unauthorized} replace />;
    }

    return <Outlet />;
}