import { Navigate, Outlet} from "react-router-dom";
import  {useAuth} from "../context/AuthContext";

export function ProtectedRoute() {
    const { isAuthenticated, isLoading} = useAuth();

    if(isLoading) {
        return <div>Cargando...</div> // luego remplazo este "cargando" por un componente spinner o skeleton
    }

    if(!isAuthenticated) {
        return <Navigate to = "/login" replace />;
    }

    return <Outlet/>; // Si pasa las verificaciones, permite el renderizado de las rutas protegidas hijas
}
