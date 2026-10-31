/**
 * Parsea una cadena de fecha ISO asegurando que sea interpretada como UTC.
 * Si el string no tiene una zona horaria explícita ('Z' o desfasaje), 
 * le añade 'Z' al final para evitar que el navegador use la hora local del usuario.
 */
const parseUtc = (iso: string) =>
    new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "Z")

// Convierte una fecha ISO en un formato legible para Perú (dd/mm/aaaa)
export const formatDate = (iso: string | null) =>
    iso ? parseUtc(iso).toLocaleDateString("es-PE") : "-";

/**
 * Formatea fechas sin hora real (como fechaEstimadaEntrega) 
 * usando UTC para evitar que el desfase horario de Lima (UTC-5) reste un día.
 */
export const formatDateOnly = (iso: string | null) =>
    iso ? parseUtc(iso).toLocaleDateString("es-PE", { timeZone: "UTC" }) : "-";

// Formato para el sol peruano
export const formatMoney = (n: number) => `S/ ${n.toFixed(2)}`;


//ese comentario con asteriscos es un JSDoc que al pasar el mouse por encima de la variable o accion te muestra su comentario