import { useState} from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { ROUTES } from "@/constants/routes";


function LoginPage() {

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const{ login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

   if(isAuthenticated) {
    return <Navigate to ={ROUTES.Dashboard} replace />;
   }

   const handleSubmit = async (formData: FormData) => {

    setError(null);
    setIsSubmitting(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {

        await login({ email, password });
        navigate(ROUTES.Dashboard, { replace: true });

      } catch (err) {

        setError(getApiErrorMessage(err)); // recibe el error de apiErrorHandler

      } finally {
        setIsSubmitting(false);
      }
   };

   //FALTA METERLE ESTILOS
    return(

      <div className="min-h-screen flex items-center justify-center bg-color3">
        <div className="bg-color4 rounded-xl shadow-sm border border-color3 p-8 w-full max-w-sm space-y-6">
           <div className="text-center">
            <h1  className="text-2xl font-bold text-color1"> KRCP </h1>
            <p className="text-sm text-color2 mt-1"> Inicia sesión para continuar </p>
            </div>

            
           <form action ={handleSubmit} className="block text-sm text-color1 mb-1">
            <div>
                <label htmlFor="email" className="block text-sm text-color1 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={() =>{
                    if(error) setError(null);
                  }}
                  className="w-full border border-color3 rounded px-3 py-2"
                />
            </div>

            <div className="pb-4 pt-2">
              <label htmlFor="password" className="block text-sm text-color1 mb-1">
               Contraseña
              </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={() =>{
                    if(error) setError(null);
                  }}
                  className="w-full border border-color3 rounded px-3 py-2"
                />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-color1 text-color4 px-4 py-2 rounded font-medium disabled:opacity-60">
                {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
           </form>
        </div>
      </div>
    );
}

export default LoginPage;