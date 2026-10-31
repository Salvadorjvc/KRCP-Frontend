import { useState, type SyntheticEvent} from "react";
import type { UsuarioResponseDto } from "../types/usuario.types";
import type { RolResponseDto } from "@/features/rol/types/rol.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface UsuarioFormProps {
    usuarioEditando: UsuarioResponseDto | null;
    roles: RolResponseDto[];
    onSubmit: (data: {
        nombreCompleto: string;
        email: string;
        password?: string;
        rolId: number;
        activo: boolean;
    }) => Promise<void>;

    onCancel: () => void;
}

function UsuarioForm({ usuarioEditando, roles, onSubmit, onCancel}: UsuarioFormProps) {
    const [nombreCompleto, setNombreCompleto] = useState(usuarioEditando?.nombreCompleto ?? "");
    const [email, setEmail] = useState(usuarioEditando?.email ?? "");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState(usuarioEditando?.rolId ?? roles[0]?.rolId ?? 0);
    const [activo, setActivo] = useState(usuarioEditando?.activo?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit({
                nombreCompleto,
                email,
                password: usuarioEditando ? undefined : password,
                rolId: Number(rolId),
                activo,
            });
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
           onSubmit={handleSubmit}
           className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-4"
        >
            <h2 className="text-lg font-semibold text-color1">
                {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <div>
                <label htmlFor="nombreCompleto" className="block text-sm text-color1 mb-1">
                    Nombres y Apellidos del Usuario
                </label>

                <input
                   id = "nombreCompleto"
                   type="text"
                   value={nombreCompleto}
                   onChange={(e) => setNombreCompleto(e.target.value)}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm text-color1 mb-1">
                    Email
                </label>

                <input
                   id = "email"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                />
            </div>

            {!usuarioEditando &&(
             <div>
                <label htmlFor="password" className="block text-sm text-color1 mb-1">
                    Contraseña
                </label>

                <input
                   id = "password"
                   type="password"
                   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                   title="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                />
             </div>
            )}

            <div>
                <label htmlFor="rolId" className="block text-sm text-color1 mb-1">
                    Rol
                </label>

                <select
                   id = "rolId"
                   value={rolId}
                   onChange={(e) => setRolId(Number(e.target.value))}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                >
                    {roles.map((rol) => (
                        <option key={rol.rolId} value={rol.rolId}>
                            {rol.nombreRol}
                        </option>
                    ))}
                </select>
            </div>

            {usuarioEditando && (
                <div className="flex items-center gap-2">
                    <label htmlFor="activo" className="text-sm text-color1">
                       Activo
                    </label>

                    <input
                      id = "activo"
                      type= "checkbox"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}
                    />
                </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-2"> 
                <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="bg-color2 text-color4 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
                <button
                   type = "button"
                   onClick={onCancel}
                   className="px-4 py-2 rounded border border-color3 text-color2"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );

}

export default UsuarioForm;