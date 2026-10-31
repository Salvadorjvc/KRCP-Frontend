import type { ClienteResponseDto } from "../types/cliente.types";

interface ClienteTableProps {
    clientes: ClienteResponseDto[];
    onEdit: (cliente: ClienteResponseDto) => void;
    onToggleStatus: (cliente: ClienteResponseDto) => void;
    puedeGestionar: boolean;
    puedeCambiarEstado: boolean;
}

function ClienteTable({clientes, onEdit, onToggleStatus, puedeGestionar, puedeCambiarEstado}: ClienteTableProps){

    if (clientes.length === 0) {
        return (
         <div className="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2">
           No hay clientes registrados.
         </div>
        );
    }

    //el puede gestionar lo ve el admin/planificar y el cambiar estado solo el admin
    const mostrarAcciones = puedeGestionar || puedeCambiarEstado;

    return(
        <table className = "w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className = "text-color2 text-xs font-semibold">
                KRCP - Módulo de Clientes
            </caption>
            <thead>
                <tr className = "border-b border-color2 text-left text-sm font-semibold text-color1">
                    <th className="p-3"> RUC </th>
                    <th className="p-3"> Razon social </th>
                    <th className="p-3"> Email </th>
                    <th className="p-3"> Telefono </th>
                    <th className="p-3"> Estado </th>
                  {mostrarAcciones &&   <th className="p-3"> Acciones</th>}
                </tr>                
            </thead>
            <tbody>
                {clientes.map((cliente) => (
                    <tr key = {cliente.clienteId} className ="border-b border-color2">
                        <td className="p-3 text-color1"> {cliente.ruc}</td>
                        <td className="p-3 text-color1"> {cliente.razonSocial}</td>
                        <td className="p-3 text-color1"> {cliente.contactoEmail}</td>
                        <td className="p-3 text-color1"> {cliente.telefono}</td>
                        <td className="p-3 text-color1"> {cliente.activo ? "Activo" : "Inactivo"}</td>

                        {mostrarAcciones && (
                        <td className="p-3 space-x-3">

                            {puedeGestionar && (
                            <button onClick={() => onEdit(cliente)} className="text-color3 text-sm">
                                Editar
                            </button>)
                            }

                            {puedeCambiarEstado && (
                            <button onClick={() => onToggleStatus(cliente)} className="text-red-600 text-sm">
                                {cliente.activo ? "Desactivar" : "Activar"}
                            </button>)
                            }

                        </td>
                        )}       

                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ClienteTable;