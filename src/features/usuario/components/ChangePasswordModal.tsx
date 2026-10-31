import { useState, type SyntheticEvent } from "react";
import type { UsuarioResponseDto } from "../types/usuario.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";


interface ChangePasswordModalProps {
    usuario: UsuarioResponseDto;
    onSubmit: (passwordActual: string, passwordNueva: string) => Promise<void>;
    onCancel: () => void;
}

function ChangePasswordModal ({usuario, onSubmit, onCancel}: ChangePasswordModalProps) {
    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError(null)
        setIsSubmitting(true);

        try {
            await onSubmit(passwordActual, passwordNueva);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-color4 rounded-xl shadow-sm border border-color3 p-5 space-y-4 w-full max-w-sm"
            >
                <h2 className="text-lg font-semibold text-color1">
                    Cambiar contraseña de {usuario.nombreCompleto}
                </h2>

                <div>
                    <label htmlFor="passwordActual" className="block text-sm text-color1 mb-1">
                        Contraseña actual
                    </label>
                    <input
                       id="passwordActual"
                       type="password"
                       value={passwordActual}
                       onChange={(e) => setPasswordActual(e.target.value)}
                       required
                       className="w-full border border-color3 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="passwordNueva" className="block text-sm text-color1 mb-1">
                        Contraseña nueva
                    </label>
                    <input
                       id="passwordNueva"
                       type="password"
                       value={passwordNueva}
                       onChange={(e) => setPasswordNueva(e.target.value)}
                       required
                       minLength={8}
                       className="w-full border border-color3 rounded px-3 py-2"
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="flex gap-2">
                    <button
                       type="submit"
                       disabled={isSubmitting}
                       className="bg-color2 text-color4 px-4 py-2 rounded"
                    >
                        {isSubmitting ? "Guardando..." : "Guardar"}

                    </button>

                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-4 py-2 rounded border border-color3 text-color2"
                    >
                        Cancelar
                    </button>                   
                </div>
            </form>
        </div>
    );
}

export default ChangePasswordModal;
