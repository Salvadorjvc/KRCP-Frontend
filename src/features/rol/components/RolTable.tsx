import type { RolResponseDto } from "../types/rol.types";

interface RolTableProps {
    roles: RolResponseDto[];
    onEdit: (rol: RolResponseDto) => void;
    onToggleStatus: (rol: RolResponseDto) => void;
}

function RolTable({ roles, onEdit, onToggleStatus}: RolTableProps){
    
    if (roles.length === 0) {
      return (
         <div className="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2">
           No hay roles registrados.
         </div>
       );
    }

    return(
        <table className = "w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className = "text-color2 text-xs font-semibold">
                KRCP - Módulo de Roles
            </caption>
            <thead>
                <tr className = "border-b border-color2">
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Nombre </th>
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Estado </th>
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Acciones</th>
                </tr>
            </thead>
            <tbody>
                {roles.map((rol) => (
                    <tr key={rol.rolId} className ="border-b border-color2">
                        <td className="p-3 text-color1"> {rol.nombreRol}</td>
                        <td className="p-3 text-color1"> {rol.activo ? "Activo" : "Inactivo"}</td>
                        <td className="p-3 space-x-3">
                            <button onClick={() => onEdit(rol)} className="text-color3 text-sm">
                                Editar
                            </button>
                            <button onClick={() => onToggleStatus(rol)} className="text-red-600 text-sm">
                                {rol.activo ? "Desactivar" : "Activar"}
                            </button>
                        </td>
                    </tr>
                ))}

            </tbody>

        </table>
    );
}

export default RolTable;