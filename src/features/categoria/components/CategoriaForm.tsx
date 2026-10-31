import { useState, type SyntheticEvent} from "react";
import type { CategoriaResponseDto } from "../types/categoria.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface CategoriaFormProps {
    categoriaEditando: CategoriaResponseDto | null;
    onSubmit: (data: {
        nombre: string,
        descripcion: string | null,
        activo: boolean
    }) => Promise <void>;

    onCancel: () => void;
}

function CategoriaForm({ categoriaEditando, onSubmit, onCancel}: CategoriaFormProps) {
    const [nombre, setNombre] = useState(categoriaEditando?.nombre ?? "");
    const [descripcion, setDescripcion] = useState(categoriaEditando?.descripcion ?? "");
    const [activo, setActivo] = useState(categoriaEditando?.activo ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await onSubmit({
                nombre,
                descripcion: descripcion.trim() || null,
                activo
            });
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <form
           onSubmit={handleSubmit}
           className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-4"       
        >
            <h2 className="text-lg font-semibold text-color1">
                {categoriaEditando ? "Editar Categoria" : "Nueva Categoria"} 
            </h2>

            <div>
                <label htmlFor="nombre" className="block text-sm text-color1 mb-1">
                    Nombre
                </label>

                <input
                   id = "nombre"
                   type = "text"
                   maxLength={50}
                   pattern="[A-Za-zÁ-Úá-úñÑ0-9 ]+" //acepta letras con tildes, numeros y espacios
                   title="Solo se permiten letras, números y espacios"
                   value={nombre}
                   onChange={(e) => setNombre(e.target.value)}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                />
                
            </div>

            <div>
                <label htmlFor="descripcion" className="block text-sm text-color1 mb-1">
                    Descripcion
                </label>

                <textarea
                   id = "descripcion"
                   maxLength={255}
                   value={descripcion}
                   onChange={(e) => setDescripcion(e.target.value)}
                   className="w-full border border-color3 rounded px-3 py-2"
                />
                
            </div>

            {categoriaEditando && (
                <div className="flex items-center gap-2">
                    <label htmlFor="activo" className="text-sm text-color1">
                        Activo
                    </label>

                    <input 
                      id = "activo"
                      type= "checkbox"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}
                    />
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

export default CategoriaForm;