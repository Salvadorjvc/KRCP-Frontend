import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductoResponseDto } from "@/features/producto/types/producto.types";
import {
    despacharSchema,
    type DespacharFormInput,
    type DespacharFormValues,
} from "../schemas/despachar.schema";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { formatMoney } from "@/utils/formatters";

interface DespacharRepuestoFormProps{
    productos: ProductoResponseDto[];
    onSubmit: (data: DespacharFormValues) => Promise<void>;
    onCancel: () => void;
}

function DespacharRepuestoForm({ productos, onSubmit, onCancel}: DespacharRepuestoFormProps){

    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
    } = useForm<DespacharFormInput, unknown, DespacharFormValues>({
        resolver: zodResolver(despacharSchema(productos)),
        defaultValues: {
            productoId: 0, 
            cantidad: 1
        },
    });

    const productoId = Number(useWatch({control, name: "productoId"}));
    const cantidad = Number(useWatch({control, name: "cantidad"})) || 0;
    const seleccionado = productos.find((p) => p.productoId === productoId);

    const handleFormSubmit = async (data: DespacharFormValues) => {
        try{
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
                Despachar repuesto
            </h2>

            <div>
                <label htmlFor="productoId" className="block text-sm text-color1 mb-1">
                    Repuesto
                </label>
                <select
                   id="productoId"
                   {...register("productoId")}
                   className={inputClass}
                >
                  <option value="0">Seleccione un repuesto</option>
                  {productos.map((p) =>(
                    <option key={p.productoId} value={p.productoId}>
                        {p.codigoParte} - {p.nombre} (stock: {p.stockActual})
                    </option>
                  ))}
                </select>
                {errors.productoId && (
                    <span className={errorClass}>{errors.productoId.message}</span>
                )}
            </div>

            <div>
                <label htmlFor="cantidad" className="block text-sm text-color1 mb-1">
                    Cantidad
                </label>
                <input
                   id = "cantidad"
                   type="number"
                   {...register("cantidad")}
                   className={inputClass}
                />
                {errors.cantidad && (
                    <span className={errorClass}>{errors.cantidad.message}</span>
                )}
            </div>

            {seleccionado && (
                <p className="text-sm text-color2">
                    Precio unitario: {formatMoney(seleccionado.costoUnitario)} . Subtotal estimado: {""}
                    <span className="font-medium text-color1">
                       {formatMoney(seleccionado.costoUnitario * cantidad)}
                    </span>
                </p>
            )}

            {error && <p className={errorClass}>{error}</p>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-color2 text-color4 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Despachando..." : "Despachar"}
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

export default DespacharRepuestoForm