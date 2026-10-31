import { z } from "zod/v4";
import type { ProductoResponseDto } from "@/features/producto/types/producto.types";

export const despacharSchema = (productos: ProductoResponseDto[]) =>
    z.object({
        productoId: 
        z.coerce
        .number()
        .min(1, "Seleccione un producto"),

        cantidad:
        z.coerce
        .number()
        .int("Debe ser un número entero")
        .min(1, "Mínimo 1"),
    })

    .refine((data) =>
        {
         const producto = productos.find((p) => p.productoId === data.productoId);

         // Si no encuentra el producto, dejamos pasar (lo validará el backend o el selector)
         if(!producto) return true;

         return data.cantidad <= producto.stockActual;
       },
       {
           error:"La cantidad supera el stock disponible",
           path:["cantidad"] // Asocia el error específicamente al campo 'cantidad'
       }
    );

export type DespacharFormInput = z.input<ReturnType<typeof despacharSchema>>;
export type DespacharFormValues = z.output<ReturnType<typeof despacharSchema>>;    