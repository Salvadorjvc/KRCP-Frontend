import { createContext, useContext, useState, type ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';
import { authApi } from "../features/auth/api/authApi";
import type { LoginRequestDto } from "../features/auth/types/auth.types";

//Interfaz que coincide con la carga util del JWT que se configuro en .NET
interface JwtPayloadCustom{
    nameidentifier: string;
    name: string;
    email: string;
    role: string;
    exp: number;
}

interface AuthUser{
    usuarioId: number;
    nombreCompleto: string;
    email: string;
    nombreRol: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credenciales: LoginRequestDto) => Promise<void>;
    logout: () => void;
    hasRole: (rolesPermitidos: string[]) => boolean;
}


const TOKEN_KEY = "token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decodifica el token y extrae el usuario asegurando que no haya expirado
const getUserFromToken = (token: string): AuthUser | null => {
    try{
      const decoded = jwtDecode<JwtPayloadCustom>(token); //decodifica el token
      const currentTime = Date.now()/ 1000; //ve la hora actual y la toma(devuelve el tiempo actual en segundos)
      
      //verifica si el token ya vencio, de ser asi lo destruye
      if (decoded.exp <= currentTime)
      {
          localStorage.removeItem(TOKEN_KEY);
          return null;
      }

      //si esta vigente, adaptamos los datos al formato de AuthUser
      return {
          usuarioId: Number(decoded.nameidentifier),
          nombreCompleto: decoded.name,
          email: decoded.email,
          nombreRol: decoded.role
      };
      } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
};

export function AuthProvider({ children }: { children: ReactNode }){

    // Al iniciar la app por primera vez, busca en la memoria del navegador si ya hay un token guardado
    const [user, setUser] = useState<AuthUser | null>(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? getUserFromToken(token) : null;
    });

   const [isLoading, setIsLoading] = useState(false);

   const login = async (credenciales: LoginRequestDto) => {
     setIsLoading(true);
     try {
        const response = await authApi.login(credenciales); // Obtiene la respuesta del backend después de enviar las credenciales
        localStorage.setItem(TOKEN_KEY, response.token); //guarda el token
        const currentUser = getUserFromToken(response.token); //obtiene el usuario del jwt

        setUser(currentUser);//guarda el usuario en react

     } finally {
        setIsLoading(false); //termina el proceso
     }
   };

   //solo cierra sesion eliminando el token y limpiando el usuario del estado de React
   const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
   };

   const hasRole = (rolesPermitidos: string[]): boolean => {

    if(!user) return false; //esto es que si no hay usuario, no tiene ningun rol permitido

    return rolesPermitidos.includes(user.nombreRol);
   };

   return (
     <AuthContext.Provider
        value ={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            hasRole
        }}
     >
        {children}
     </AuthContext.Provider>
   );
}

//el comentario desactiva el react refresh en las lineas de abajo para exportar el custom hook junto al Provider sin romper Fast Refresh
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
}