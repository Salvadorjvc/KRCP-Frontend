import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductoResponseDto } from "../types/producto.types";
import type { CategoriaResponseDto } from "@/features/categoria/types/categoria.types";
import type { UbicacionResponseDto } from "@/features/ubicacion/types/ubicacion.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
//importacion del esquema y los types
import { productoSchema, type ProductoFormInput, type ProductoFormValues } from "../schemas/producto.schema";

interface ProductoFormProps {
    productoEditando: ProductoResponseDto | null;
    categorias: CategoriaResponseDto[];
    ubicaciones: UbicacionResponseDto[];
    onSubmit: (data: ProductoFormValues) => Promise<void>;
    onCancel: () => void;
}

function ProductoForm({productoEditando, categorias, ubicaciones, onSubmit, onCancel}: ProductoFormProps) {

    const [error, setError] = useState<string | null>(null);
    const isEditing = Boolean(productoEditando);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},

    } = useForm<ProductoFormInput, unknown, ProductoFormValues>({
        resolver: zodResolver(productoSchema(isEditing)),
        defaultValues: {
            codigoParte: "",
            nombre: productoEditando?.nombre ?? "",
            categoriaId: productoEditando?.categoriaId ?? categorias[0]?.categoriaId ?? 0,
            ubicacionId: productoEditando?.ubicacionId ?? null,
            stockMinimo: productoEditando?.stockMinimo ?? 5,
            costoUnitario: productoEditando?.costoUnitario ?? 0,
            activo: productoEditando?.activo ?? true,
        },
    });

    // Manejador seguro para el envío asíncrono y captura de errores de API
    const handleFormSubmit = async (data: ProductoFormValues) => {
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
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        {!isEditing && (
            <div>
              <label htmlFor="codigoParte" className="block text-sm text-color1 mb-1">
                 Código de Parte
              </label>
              <input
                 id ="codigoParte"
                 type="text"
                 {...register("codigoParte")}
                  className={inputClass} 
              />
              {errors.codigoParte && (
                  <span className={errorClass}>{errors.codigoParte.message}</span>
              )}
            </div>
        )}

        <div>
            <label htmlFor="nombre" className="block text-sm text-color1 mb-1">
              Nombre
            </label>
            <input
              id ="nombre"  
              type="text"
              {...register("nombre")}
              className={inputClass}
            />
              {errors.nombre && (
                  <span className={errorClass}>{errors.nombre.message}</span>
              )}
        </div>

        <div>
            <label htmlFor="categoriaId" className="block text-sm text-color1 mb-1">
              Categoría
            </label>
            <select
              id="categoriaId"
              {...register("categoriaId")}
              className={inputClass}
            >
             <option value="0">Seleccione una categoría</option>
              {categorias.map((c) => (
                  <option key={c.categoriaId} value={c.categoriaId}>
                        {c.nombre}
                  </option>
              ))}
            </select>
              {errors.categoriaId && (
                <span className={errorClass}>{errors.categoriaId.message}</span>
              )}
        </div>

        <div>
           <label htmlFor="ubicacionId" className="block text-sm text-color1 mb-1">
            Ubicación
            </label>
           <select
              id="ubicacionId"
              {...register("ubicacionId")}
              className={inputClass}
            >
            <option value="">Sin ubicación</option>
              {ubicaciones.map((ubi) => (
                <option key={ubi.ubicacionId} value={ubi.ubicacionId}>
                  {ubi.codigoUbicacion}
                </option>
              ))}
            </select>
              {errors.ubicacionId && (
                <span className={errorClass}>{errors.ubicacionId.message}</span>
              )}
          </div>

      <div className="grid grid-cols-2 gap-4">
        
          <div>
            <label htmlFor="stockMinimo" className="block text-sm text-color1 mb-1">
              Stock Mínimo
            </label>
                <input
                    id="stockMinimo"
                    type="number"
                    {...register("stockMinimo")}
                    className={inputClass}
                />
                {errors.stockMinimo && (
                    <span className={errorClass}>{errors.stockMinimo.message}</span>
                )}
          </div>
            
          <div>
            <label htmlFor="costoUnitario" className="block text-sm text-color1 mb-1">
              Costo Unitario
            </label>
              <input
                id="costoUnitario"
                type="number"
                step="0.01"
                {...register("costoUnitario")}
                className={inputClass}
                />
                {errors.costoUnitario && (
                    <span className={errorClass}>{errors.costoUnitario.message}</span>
                )}
            </div>
      </div>

          {isEditing && (
            <div className="flex items-center gap-2">
              <label htmlFor="activo" className="text-sm text-color1">Activo</label>
              <input 
                id="activo" 
                type="checkbox" 
                {...register("activo")}
              />
            </div>
          )}

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

export default ProductoForm;