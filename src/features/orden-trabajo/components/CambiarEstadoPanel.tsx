import { useState } from "react";
import {ESTADOS ,type EstadoOrdenTrabajo } from "../types/orden-trabajo.types";
import { ESTADO_LABEL, TRANSICIONES } from "../constants/estados";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface CambiarEstadoPanelProps {
    estadoActual: EstadoOrdenTrabajo;
    onCambiar: (nuevoEstado: EstadoOrdenTrabajo) => Promise<void>;
}

function CambiarEstadoPanel({estadoActual, onCambiar}: CambiarEstadoPanelProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const siguientes = TRANSICIONES[estadoActual];

    const handleCambiar = async (nuevoEstado: EstadoOrdenTrabajo) => {
        if (nuevoEstado === ESTADOS.Cancelado && !window.confirm("¿Seguro que desea cancelar esta orden?")) {
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await onCambiar(nuevoEstado);
        } catch (err) {
            setError(getApiErrorMessage(err));            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-color1">
                Cambiar estado
            </h2>

            {siguientes.length === 0 ? (
                <p className="text-sm text-color1">Esta orden ya no admite cambios de estado.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {siguientes.map((estado) => (
                        <button
                          key={estado}
                          onClick={() =>handleCambiar(estado)}
                          disabled ={isSubmitting}
                          className={`px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed 
                            ${estado === ESTADOS.Cancelado
                               ? "border border-red-600 text-red-600"
                               : "bg-color2 text-color4"
                            }`}
                        >
                            {ESTADO_LABEL[estado]}
                        </button>
                    ))}
                </div>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}

        </div>
    );
}

export default CambiarEstadoPanel;