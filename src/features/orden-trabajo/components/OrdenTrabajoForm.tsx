import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrdenTrabajoResponseDto } from "../types/orden-trabajo.types";
import type { ClienteResponseDto } from "@/features/cliente/types/cliente.types";
import {ordenTrabajoSchema, 
    type OrdenTrabajoFormInput,
    type OrdenTrabajoFormValues 
} from "../schemas/orden-trabajo.schema";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface OrdenTrabajoFormProps {
    ordenEditando: OrdenTrabajoResponseDto | null;
    clientes: ClienteResponseDto[];
    onSubmit: (data: OrdenTrabajoFormValues) => Promise<void>;
    onCancel: () => void;
}

function OrdenTrabajoForm({ordenEditando, clientes, onSubmit, onCancel}: OrdenTrabajoFormProps) {
    
    const [error, setError] = useState<string | null>(null);
    const isEditing = Boolean(ordenEditando);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},

    } = useForm<OrdenTrabajoFormInput, unknown, OrdenTrabajoFormValues>({
        resolver: zodResolver(ordenTrabajoSchema(isEditing)),
        defaultValues: {
            clienteId: ordenEditando?.clienteId ?? 0,
            equipoComponente: ordenEditando?.equipoComponente ?? "",
            numeroSerie: ordenEditando?.numeroSerie ?? "",
            fechaEstimadaEntrega: ordenEditando?.fechaEstimadaEntrega?.slice(0, 10) ?? "",
            costoManoObra: ordenEditando?.costoManoObra ?? 0,
            observaciones: ordenEditando?.observaciones ?? ""
        },
    });

    const handleFormSubmit = async (data: OrdenTrabajoFormValues) => {
        try {
            setError(null);
            await onSubmit(data);
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    };

    const inputClass = "w-full border border-color3 rounded px-3 py-2";
    const errorClass = "text-red-600 text-xs mt-1 block";

    return (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-4"
        >
            <h2 className="text-lg font-semibold text-color1">
                {isEditing ? `Editar ${ordenEditando?.codigoOt}` : "Nueva Orden de trabajo"}
            </h2>

            {!isEditing && (
                <div>
                    <label htmlFor="clienteId" className="block text-sm text-color1 mb-1">
                        Cliente
                    </label>
                    <select
                       id="clienteId"
                       {...register("clienteId")}
                       className={inputClass}
                    >
                     <option value="0">Seleccione un cliente</option>
                     {clientes.map((c) => (
                        <option key={c.clienteId} value={c.clienteId}>
                            {c.razonSocial}
                        </option>
                     ))}
                    </select>
                    {errors.clienteId && (
                        <span className={errorClass}>{errors.clienteId.message}</span>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="equipoComponente" className="block text-sm text-color1 mb-1">
                    Equipo / Componente
                </label>
                <input
                  id = "equipoComponente"
                  type="text"
                  {...register("equipoComponente")}
                  className={inputClass}
                />
                 {errors.equipoComponente && (
                    <span className={errorClass}>{errors.equipoComponente.message}</span>
                 )}
            </div>

            <div>
                <label htmlFor="numeroSerie" className="block text-sm text-color1 mb-1">
                    Número de serie
                </label>
                <input
                  id = "numeroSerie"
                  type="text"
                  {...register("numeroSerie")}
                  className={inputClass} 
                />
                 {errors.numeroSerie && (
                    <span className={errorClass}>{errors.numeroSerie.message}</span>
                  )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fechaEstimadaEntrega" className="block text-sm text-color1 mb-1">
                        Fecha estimada de entrega (opcional)
                    </label>
                    <input
                      id = "fechaEstimadaEntrega"
                      type="date"
                      {...register("fechaEstimadaEntrega")}
                      className={inputClass}
                    />
                    {errors.fechaEstimadaEntrega && (
                        <span className={errorClass}>{errors.fechaEstimadaEntrega.message}</span>
                    )}
                </div>

                <div>
                    <label htmlFor="costoManoObra" className="block text-sm text-color1 mb-1">
                        Costo de mano de obra (S/)
                    </label>
                    <input
                      id = "costoManoObra"
                      type="number"
                      step="0.01"
                      {...register("costoManoObra")}
                      className={inputClass}
                    />
                    {errors.costoManoObra && (
                        <span className={errorClass}>{errors.costoManoObra.message}</span>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="observaciones" className="block text-sm text-color1 mb-1">
                    Observaciones (opcional)
                </label>
                <textarea
                  id = "observaciones"
                  {...register("observaciones")}
                  className={inputClass}
                />
            </div>

            {error && <p className={errorClass}>{error}</p>}

           <div className="flex gap-2">
             <button
               type="submit"
               disabled={isSubmitting}
               className="bg-color2 text-color4 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? "Guardando..." : "Guardar"}
             </button>
             <button
               type="button"
               onClick={onCancel}
               className="px-4 py-2 rounded border border-color3 text-color2"            
             >
                Cancelar
             </button>
           </div>
        </form>
    );
}

export default OrdenTrabajoForm;