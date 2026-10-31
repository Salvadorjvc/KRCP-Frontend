import axios from "axios";

//crea una instancia personalizada de Axios preconfigurada con la URL base de mi .NET
export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type": "application/json" //el contenido que se envia al backend es en formato json
    },
});

//Interceptor de PETICION: agrega el token JWT automaticamente en cada llamada
axiosClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
    
});

//Interceptor de RESPUESTA: maneja errores comunes de forma centralizada
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {

        //Verificamos si la petición que falló fue la del Login
        const isLoginEndpoint = error.config?.url?.includes("/login");

        // Solo redirige si es un 401 en RUTAS PROTEGIDAS (no en el endpoint de login)
        if (error.response?.status === 401 && !isLoginEndpoint) {
            
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);