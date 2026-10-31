import type { UbicacionResponseDto } from "../types/ubicacion.types";

interface UbicacionTableProps {
    ubicaciones: UbicacionResponseDto[];
    onEdit: (ubicacion: UbicacionResponseDto) => void;
    onToggleStatus: (ubicacion: UbicacionResponseDto) => void;
    puedeGestionar: boolean;
}

function UbicacionTable({ubicaciones, onEdit, onToggleStatus, puedeGestionar}: UbicacionTableProps) {

    if (ubicaciones.length === 0) {
        return (
            <div className="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2">
                No hay ubicaciones registradas.
            </div>
        );
    }

    return(
        <table className="w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className="text-color2 text-xs font-semibold">
                KRCP - Módulo de Ubicaciones
            </caption>
            <thead>
                <tr className = "border-b border-color2 text-left text-sm font-semibold text-color1">
                    <th className="p-3">Codigo de la Ubicación</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">Estado</th>
                    {puedeGestionar && <th className="p-3"> Acciones </th>}
                </tr>
            </thead>
            <tbody>
                {ubicaciones.map((ubicacion) => (
                    <tr key = {ubicacion.ubicacionId} className="border-b border-color2">
                        <td className="p-3 text-color1"> {ubicacion.codigoUbicacion}</td>
                        <td className="p-3 text-color1"> {ubicacion.descripcion}</td>
                        <td className="p-3 text-color1"> {ubicacion.activo ? "Activo" : "Inactivo"}</td>

                        {puedeGestionar && (
                        <td className="p-3 space-x-3">
                            <button onClick={() => onEdit(ubicacion)} className="text-color3 text-sm">
                                Editar
                            </button>

                            <button onClick={() => onToggleStatus(ubicacion)} className="text-red-600 text-sm">
                                {ubicacion.activo ? "Desactivar": "Activar"}
                            </button>
                        </td>
                        )}
                    </tr>
                ))}

            </tbody>
        </table>
    );

}

export default UbicacionTable;