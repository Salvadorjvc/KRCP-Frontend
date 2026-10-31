import { useState, type SyntheticEvent} from "react";
import type { RolResponseDto } from "../types/rol.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface RolFormProps {
    rolEditando: RolResponseDto | null;
    onSubmit: (nombreRol: string, activo: boolean) => Promise<void>;
    onCancel: () => void;
}


function RolForm({ rolEditando, onSubmit, onCancel }: RolFormProps) {
    const [nombreRol, setNombreRol] = useState(rolEditando?.nombreRol ?? "");
    const [activo, setActivo] = useState(rolEditando?.activo ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await onSubmit(nombreRol, activo);
        } catch(err)  {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
           onSubmit={handleSubmit}
           className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-4"
        >
            <h2 className="text-lg font-semibold text-color1">
                {rolEditando ? "Editar Rol" : "Nuevo Rol"}
            </h2>

            <div>
                <label htmlFor="nombreRol" className="block text-sm text-color1 mb-1">
                    Nombre del Rol
                </label> 
               <input 
                  id = "nombreRol"
                  type="text"
                  value={nombreRol}
                  onChange={(e) => setNombreRol(e.target.value)}
                  required
                  className="w-full border border-color3 rounded px-3 py-2"
                />
            </div>

            {rolEditando  && (
                <div className="flex items-center gap-2">
                    <input
                      id="activo"  
                      type="checkbox"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}                  
                    />
                    <label htmlFor="activo" className="text-sm text-color1">
                        Activo
                    </label>

                </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-2">
                <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="bg-color2 text-color4 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
                <button
                   type = "button"
                   onClick={onCancel}
                   className="px-4 py-2 rounded border border-color3 text-color2"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default RolForm;