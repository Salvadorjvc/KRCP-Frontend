import type { OtRepuestoConsumidoResponseDto } from "../types/ot-repuesto-consumido.types";
import { formatDate, formatMoney } from "@/utils/formatters";

function RepuestoConsumidoTable({ repuestos }: { repuestos: OtRepuestoConsumidoResponseDto[]}) {
    if (repuestos.length === 0){
        return (
            <div className="text-center py-6 text-sm text-color1 bg-color4 rounded-xl border border-color2">
                Aún no se han despachado repuestos para esta orden.
            </div>
        );        
    }

    // Calcula el costo total sumando los subtotales de todos los repuestos despachados.
    // .reduce() arranca en 0 y va acumulando el valor de (suma actual + subtotal del repuesto actual).
    const total = repuestos.reduce((suma, r) => suma + r.subtotal, 0);

    return (
        <table className="w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <thead>
                <tr className="border-b border-color2 text-left text-sm font-semibold text-color1">
                    <th className="p-3">Código</th>
                    <th className="p-3">Repuesto</th>
                    <th className="p-3">Cant.</th>
                    <th className="p-3">P. unitario</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3">Despachado por</th>
                    <th className="p-3">Fecha</th>
                </tr>
            </thead>
            <tbody>
                {repuestos.map((r) => (
                    <tr key={r.detalleId} className="border-b border-color2 text-sm text-color1">
                        <td className="p-3">{r.codigoParte}</td>
                        <td className="p-3">{r.nombreProducto}</td>
                        <td className="p-3">{r.cantidad}</td>
                        <td className="p-3">{formatMoney(r.precioUnitarioHistorico)}</td>
                        <td className="p-3">{formatMoney(r.subtotal)}</td>
                        <td className="p-3">{r.nombreUsuarioAlmacen}</td>
                        <td className="p-3">{formatDate(r.fechaDespacho)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="text-sm font-semibold text-color1">
                    <td className="p-3" colSpan={4}>Total repuestos</td>
                    <td className="p-3" colSpan={3}>{formatMoney(total)}</td>
                </tr>
            </tfoot>
        </table>
    );
}

export default RepuestoConsumidoTable;