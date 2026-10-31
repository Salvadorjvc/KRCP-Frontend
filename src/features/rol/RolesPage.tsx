import { useState, useEffect } from "react";
import { rolApi } from "./api/rolApi";
import type { RolResponseDto } from "./types/rol.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import RolTable from "./components/RolTable";
import RolForm from "./components/RolForm";

function RolesPage() {
    const [roles, setRoles] = useState<RolResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [rolEditando, setRolEditando] = useState<RolResponseDto | null>(null);

    useEffect(() => {
        const cargarRoles = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await rolApi.getAll();
                setRoles(data);
            } catch(err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        cargarRoles();
    }, []);

    const handleNuevo = () => {
        setRolEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (rol: RolResponseDto) => {
        setRolEditando(rol);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
      setMostrarForm(false);
      setRolEditando(null);
    };

    const handleSubmit = async (nombreRol: string, activo: boolean) => {

            if(rolEditando) {
                // Edicion (API no devuelve objeto, pero ya tenemos los datos en frontend
                await rolApi.update(rolEditando.rolId, { nombreRol, activo});


                // Actualizamos el estado local sustituyendo el rol editado
                setRoles((prev) =>
                    prev.map((r) =>
                    r.rolId === rolEditando.rolId ? { ...r, nombreRol, activo} : r
                  )
                );

            } else {
                // Creacion (API devuelve el nuevo RolResponseDto con su id)
                const nuevoRol = await rolApi.create({nombreRol});

                //agregamos el nueov rol recibido al estado local
                setRoles((prev) => [...prev, nuevoRol]);
                
            }

            // Cerramos el formulario y limpiamos la seleccion
            setMostrarForm(false);
            setRolEditando(null);
    };

    const handleToggleStatus = async (rol: RolResponseDto) => {
        try {

            setError(null);

            //peticion al backend para cambiar el estado
            await rolApi.changeStatus(rol.rolId, {activo : !rol.activo})
            
            // actualizacion del estado local
            setRoles((prev) => 
                prev.map((r) =>
                   r.rolId === rol.rolId ? {...r, activo: !r.activo} : r
                )
            );

        } catch (err) {
            setError (getApiErrorMessage(err));
        }
    };

    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">Roles</h1>
                {!mostrarForm && (
                    <button
                       onClick={handleNuevo}
                       className="bg-color1 text-color4 px-4 py-2 rounded"                       
                    >
                        Nuevo Rol
                    </button>
                )}
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && (
                <RolForm
                    key={rolEditando?.rolId ?? "nuevo"}
                    rolEditando={rolEditando}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
              <div className="text-center py-8 text-color1">Cargando roles...</div>
            ) : (
                <RolTable 
                   roles={roles} 
                   onEdit={handleEditar}
                   onToggleStatus={handleToggleStatus}
                />
            )}

        </div>
    );
}

export default RolesPage;