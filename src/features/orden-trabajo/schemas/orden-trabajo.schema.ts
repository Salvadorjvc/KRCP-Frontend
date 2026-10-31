import { z } from "zod/v4";

// Fecha local de hoy como "YYYY-MM-DD", el formato de <input type="date">
const hoy = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const ordenTrabajoSchema = (isEditing: boolean) => 
    z.object({
        clienteId: isEditing
        ? z.coerce.number()
        : z.coerce.number().min(1,"Seleccione un cliente"),

        equipoComponente: 
        z.string()
        .trim()
        .min(3, "Mínimo 3 caracteres")
        .max(150,"Maximo 150 caracteres"),

        numeroSerie:
        z.string()
        .trim()
        .min(9,"El número de serie no puede tener menos de 9 caracteres")
        .max(100,"Máximo 100 caracteres"),

        fechaEstimadaEntrega:
        z.string()
        .refine(
            (v) => isEditing || v === "" || v > hoy(),
            "Debe ser una fecha posterior a hoy"
        )
        .transform((v) => (v === "" ? null : v)),

        costoManoObra: 
        z.coerce
        .number()
        .min(0,"No puede ser negativo")
        .default(0),

        observaciones:
        z.string()
        .trim()
        .transform((value) => (value === "" ? null: value)),

    });

export type OrdenTrabajoFormInput = z.input<ReturnType<typeof ordenTrabajoSchema>>;

export type OrdenTrabajoFormValues = z.output<ReturnType<typeof ordenTrabajoSchema>>;