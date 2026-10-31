import { useState } from "react";
import type { UsuarioSimpleResponseDto } from "@/features/usuario/types/usuario.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface AsignarTecnicoPanelProps {
    tecnicos: UsuarioSimpleResponseDto[];
    tecnicoActualId: number | null;
    onAsignar: (tecnicoId: number) => Promise<void>;
}

function AsignarTecnicoPanel({tecnicos, tecnicoActualId, onAsignar}: AsignarTecnicoPanelProps) {
    const [tecnicoId, setTecnicoId] = useState<number>(tecnicoActualId ?? 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsignar = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            await onAsignar(tecnicoId);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-color1">
                Asignar técnico 
            </h2>

            <div className="flex gap-2">
                <select
                  value={tecnicoId}
                  onChange={(e) => setTecnicoId(Number(e.target.value))}
                  className="flex-1 border border-color3 rounded px-3 py-2"
                >
                    <option value={0}>Seleccione un técnico</option>
                    {tecnicos.map((t) =>(
                        <option key={t.usuarioId} value={t.usuarioId}>
                            {t.nombreCompleto}
                        </option>
                    ))}
                </select>

                <button
                  onClick={handleAsignar}
                  disabled={isSubmitting || tecnicoId === 0 || tecnicoId === tecnicoActualId}
                  className="bg-color2 text-color4 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Asignando..." : "Asignar"}
                </button>

            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
    );
}

export default AsignarTecnicoPanel;