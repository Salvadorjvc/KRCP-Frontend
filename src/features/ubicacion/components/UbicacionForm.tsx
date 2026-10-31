import { useState, type SyntheticEvent} from "react";
import type { UbicacionResponseDto } from "../types/ubicacion.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface UbicacionFormProps {
    ubicacionEditando: UbicacionResponseDto | null;
    onSubmit: (data: {
        codigoUbicacion: string,
        descripcion: string | null,
        activo: boolean
    }) => Promise <void>;

    onCancel: () => void;
}

function UbicacionForm({ubicacionEditando, onSubmit, onCancel}: UbicacionFormProps) {
    const [codigoUbicacion, setCodigoUbicacion] = useState(ubicacionEditando?.codigoUbicacion ?? "");
    const [descripcion, setDescripcion] = useState(ubicacionEditando?.descripcion ?? "");
    const [activo, setActivo] = useState(ubicacionEditando?.activo ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await onSubmit({
                codigoUbicacion,
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
                {ubicacionEditando ? "Editar Ubicación" : "Nueva Ubicación"}
            </h2>

            <div>
                <label htmlFor="codigoUbicacion" className="block text-sm text-color1 mb-1">
                    Codigo de la ubicación
                </label>

                <input
                   id = "codigoUbicacion"
                   type = "text" 
                   maxLength={50}
                   value = {codigoUbicacion}
                   required
                   onChange={(e) => setCodigoUbicacion(e.target.value)}
                   className="w-full border border-color3 rounded px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="descripcion" className="block text-sm text-color1 mb-1">
                    Descripción
                </label>

                <textarea
                   id = "descripcion"
                   maxLength={150}
                   value = {descripcion}
                   onChange={(e) => setDescripcion(e.target.value)}
                   className="w-full border border-color3 rounded px-3 py-2"

                />
            </div>

            {ubicacionEditando && (
                <div className="flex items-center gap-2">
                    <label htmlFor="activo" className="text-sm text-color1">
                        Activo
                    </label>

                    <input 
                       id = "activo"
                       type = "checkbox"
                       checked = {activo}
                       onChange={(e) => setActivo(e.target.checked)}                    
                    />
                </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div  className="flex gap-2">
                <button
                   type = "submit"
                   disabled = {isSubmitting}
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

export default UbicacionForm;