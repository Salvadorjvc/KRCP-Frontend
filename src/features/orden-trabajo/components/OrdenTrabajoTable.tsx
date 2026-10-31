import { Link } from "react-router-dom";
import { ESTADOS, type OrdenTrabajoResponseDto } from "../types/orden-trabajo.types";
import { ESTADO_LABEL } from "../constants/estados";
import { ordenTrabajoDetallePath } from "@/constants/routes";
import { formatDateOnly, formatMoney } from "@/utils/formatters";

interface OrdenTrabajoTableProps {
    ordenes: OrdenTrabajoResponseDto[];
    onEdit: (orden: OrdenTrabajoResponseDto) => void;
    puedeEditar: boolean;
}

function OrdenTrabajoTable({ ordenes, onEdit, puedeEditar }: OrdenTrabajoTableProps) {
    if (ordenes.length === 0) {
        return (
            <div className ="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2 ">
                No hay órdenes de trabajo.
            </div>            
        );
    }

    return (
        <table className="w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className="text-color2 text-xs font-semibold">
                KRCP - Módulo de Órdenes de Trabajo
            </caption>
            <thead>
                <tr className="border-b border-color2 text-left text-sm font-semibold text-color1">
                    <th className="p-3">Código</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Equipo</th>
                    <th className="p-3">Técnico</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Ingreso</th>
                    <th className="p-3">Costo Total</th>
                    <th className="p-3">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {ordenes.map((ot) => {
                    const cerrada = ot.estado === ESTADOS.Completado || ot.estado === ESTADOS.Cancelado;

                    return (
                        <tr key={ot.otId} className="border-b border-color2 text-color1">
                            <td className="p-3 font-medium">{ot.codigoOt}</td>
                            <td className="p-3">{ot.razonSocialCliente}</td>
                            <td className="p-3">{ot.equipoComponente}</td>
                            <td className="p-3">{ot.nombreTecnico ?? "Sin asignar"}</td>
                            <td className="p-3">{ESTADO_LABEL[ot.estado]}</td>
                            <td className="p-3">{formatDateOnly(ot.fechaIngreso)}</td>
                            <td className="p-3">{formatMoney(ot.costoTotal)}</td>
                            <td className="p-3 space-x-3">
                                <Link to={ordenTrabajoDetallePath(ot.otId)} className="text-color3 text-sm">
                                   Ver detalle
                                </Link>
                            {puedeEditar && !cerrada && (
                                <button onClick={() => onEdit(ot)} className="text-color3 text-sm">
                                    Editar
                                </button>
                            )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>

        </table>
    );
}

export default OrdenTrabajoTable;
