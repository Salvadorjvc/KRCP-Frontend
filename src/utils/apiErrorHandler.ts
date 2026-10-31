import axios from "axios";
import type { ApiError } from "../types/api-error.types";

export function getApiErrorMessage(err: unknown): string {

    if (axios.isAxiosError<ApiError>(err)) {

        const data = err.response?.data;

        const serverMessage = data?.message || data?.Message || data?.title || data?.detail;

        if (serverMessage) {

          return serverMessage;

        }
        
        if (err.code === "ERR_NETWORK") {

          return "No hay conexión con el servidor." ;
        }
    }
    return "Ocurrio un error inesperado al iniciar sesión";    
}