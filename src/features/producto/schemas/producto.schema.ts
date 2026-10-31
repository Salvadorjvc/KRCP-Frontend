import { z } from "zod/v4";

export const productoSchema = (isEditing: boolean) =>
    z.object({
        codigoParte: isEditing 
           ? z.string().optional()  
           : z.string()
           .trim()
           .min(3, "El código debe tener mínimo 3 caracteres") 
           .max(50, "Solo se permite un máximo de 50 caracteres"),

        nombre: z.string()
          .trim()
          .min(3, "El nombre debe tener mínimo 3 caracteres")   
          .max(150, "Solo se permiten un máximo 150 caracteres"),

        categoriaId: z.coerce // el coerce transforma el string del HTML a número real
          .number()
          .min(1, "Seleccione una categoría"),
        
        ubicacionId: z
          .union([z.literal(""), z.coerce.number()])
          .nullable()
          .transform((val) => (val === "" || val === null || val === 0 ? null : val)),
         
        stockMinimo: z.coerce
          .number()
          .int("El stock debe ser un número entero")
          .min(0, "El stock minimo no puede ser negativo"),
        
        costoUnitario: z.coerce
          .number()
          .min(0.01, "El costo debe ser mayor a 0"),
          
        activo: z.boolean(),  
    });

export type ProductoFormInput = z.input<ReturnType<typeof productoSchema>>;
export type ProductoFormValues = z.output<ReturnType<typeof productoSchema>>;