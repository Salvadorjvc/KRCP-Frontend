import { useState, useEffect } from "react";
import { usuarioApi } from "./api/usuarioApi";
import { rolApi } from "../rol/api/rolApi";
import type { UsuarioResponseDto } from "./types/usuario.types";
import type { RolResponseDto } from "../rol/types/rol.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import UsuarioTable from "./components/UsuarioTable";
import UsuarioForm from "./components/UsuarioForm";
import ChangePasswordModal from "./components/ChangePasswordModal";

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<UsuarioResponseDto[]>([]);
    const [roles, setRoles] = useState<RolResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<UsuarioResponseDto | null>(null);
    const [usuarioCambiandoPassword, setUsuarioCambiandoPassword] = useState<UsuarioResponseDto | null>(null);

    useEffect(() => {
        const cargarRoles = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // van a ser independientes entre si (se disparan a la vez)
                const [usuarioData, rolesData] = await Promise.all([
                    usuarioApi.getAll(),
                    rolApi.getAll(),
                ]);

                setUsuarios(usuarioData);
                setRoles(rolesData.filter((r) => r.activo));
                
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        cargarRoles();
    }, []);

    const handleNuevo = () => {
        setUsuarioEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (usuario: UsuarioResponseDto) => {
        setUsuarioEditando(usuario);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setUsuarioEditando(null);
    };

    const handleSubmit = async (data: {
        nombreCompleto: string;
        email: string;
        password?: string;
        rolId: number;
        activo: boolean;
    }) => {


       if(usuarioEditando) {
                await usuarioApi.update(usuarioEditando.usuarioId, {
                    nombreCompleto: data.nombreCompleto,
                    email: data.email,
                    rolId: data.rolId,
                    activo: data.activo
                });

                const rolAsignado = roles.find((r) => r.rolId === data.rolId);
                
                setUsuarios((prev) => 
                   prev.map((u) =>
                    u.usuarioId === usuarioEditando.usuarioId
                        ? {
                            ...u,
                            nombreCompleto: data.nombreCompleto,
                            email: data.email,
                            rolId: data.rolId,
                            nombreRol: rolAsignado?.nombreRol ?? u.nombreRol,
                            activo: data.activo,
                        }
                       : u 
                    )
                );
            } else {

                if(!data.password) {
                    throw new Error("La contraseña es obligatioria");
                }

                const nuevoUsuario = await usuarioApi.create({
                    nombreCompleto: data.nombreCompleto,
                    email: data.email,
                    password: data.password,
                    rolId: data.rolId,
                });

                setUsuarios((prev) => [...prev,nuevoUsuario]);
            }

            setMostrarForm(false);
            setUsuarioEditando(null);
    };

    const handleToggleStatus = async (usuario: UsuarioResponseDto) => {
        try {
            setError(null);
            await usuarioApi.changeStatus(usuario.usuarioId, { activo: !usuario.activo});

            setUsuarios((prev) => 
                prev.map((u) =>
                    u.usuarioId === usuario.usuarioId ? { ...u, activo: !u.activo} : u
              )
            );
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    };

    const handleChangePassword = async (passwordActual: string, passwordNueva: string) => {

        if (!usuarioCambiandoPassword) return;

        await usuarioApi.changePassword(usuarioCambiandoPassword.usuarioId, {
              passwordActual,
              passwordNueva,
        });

        setUsuarioCambiandoPassword(null);
    };

    //Preserva el rol inactivo del usuario para evitar desfases visuales en el <select>
    const rolesParaForm = usuarioEditando && !roles.some((r) => r.rolId === usuarioEditando.rolId)
      ? [
          ...roles,
          {
            rolId: usuarioEditando.rolId,
            nombreRol: usuarioEditando.nombreRol,
            activo: false,
          },
        ]
    : roles;

    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">Usuarios</h1>
                {!mostrarForm && (
                    <button onClick={handleNuevo} className="bg-color1 text-color4 px-4 py-2 rounded">
                        Nuevo Usuario
                    </button>
                )}
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && (
                <UsuarioForm
                   key={usuarioEditando?.usuarioId ?? "nuevo"}
                   usuarioEditando={usuarioEditando}
                   roles={rolesParaForm}
                   onSubmit={handleSubmit}
                   onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
                <div className="text-center py-8 text-color1">Cargando usuarios...</div>
            ): (
                <UsuarioTable
                   usuarios={usuarios}
                   onEdit={handleEditar}
                   onToggleStatus={handleToggleStatus}
                   onChangePassword={setUsuarioCambiandoPassword} 
                />
            )}

            {usuarioCambiandoPassword && (
                <ChangePasswordModal
                   usuario = {usuarioCambiandoPassword}
                   onSubmit={handleChangePassword}
                   onCancel={() => setUsuarioCambiandoPassword(null)} 
                />
            )}

        </div>
    );

}

export default UsuariosPage;