import type { UsuarioResponseDto } from "../types/usuario.types";

interface UsuarioTableProps {
    usuarios: UsuarioResponseDto[];
    onEdit: (usuario: UsuarioResponseDto) => void;
    onToggleStatus: (usuario: UsuarioResponseDto) => void;
    onChangePassword: (usuario: UsuarioResponseDto) => void;
}

function UsuarioTable({ usuarios, onEdit, onToggleStatus, onChangePassword}: UsuarioTableProps) {

    if (usuarios.length === 0) {
        return (
            <div className ="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2 ">
                No hay usuarios registrados.
            </div>
        );
    }

    return(
        <table className = "w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className = "text-color2 text-xs font-semibold">
                KRCP - Módulo de Usuarios
            </caption>
            <thead>
                <tr className = "border-b border-color2">
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Nombre y apellidos </th>
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Email </th>
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Rol </th>
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Estado </th>
                    <th className="text-left p-3 text-sm font-semibold text-color1"> Acciones </th>                                        
                </tr>      
            </thead>
            <tbody>
                {usuarios.map((usuario) => (
                    <tr key={usuario.usuarioId} className ="border-b border-color2">
                        <td className="p-3 text-color1"> {usuario.nombreCompleto}</td>
                        <td className="p-3 text-color1"> {usuario.email}</td>
                        <td className="p-3 text-color1"> {usuario.nombreRol}</td>
                        <td className="p-3 text-color1"> {usuario.activo ? "Activo" : "Inactivo"}</td>
                        <td className="p-3 space-x-3">
                            <button onClick={() => onEdit(usuario)} className="text-color3 text-sm">
                                Editar
                            </button>

                            <button onClick={() => onChangePassword(usuario)} className="text-color3 text-sm">
                                Cambiar contraseña
                            </button>

                            <button onClick={() => onToggleStatus(usuario)} className="text-red-600 text-sm">
                                {usuario.activo ? "Desactivar" : "Activar"}
                            </button>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default UsuarioTable;