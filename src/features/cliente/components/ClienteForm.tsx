import { useState, type SyntheticEvent} from "react";
import type { ClienteResponseDto } from "../types/cliente.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

interface ClienteFormProps {
    clienteEditando: ClienteResponseDto | null;
    onSubmit: (data: {
       ruc?: string,
       razonSocial: string, 
       contactoEmail: string | null,
       telefono: string | null,
       activo: boolean
    }) => Promise <void>;


    onCancel: () => void;
}

function ClienteForm({ clienteEditando, onSubmit, onCancel}:  ClienteFormProps) {
    const [ruc, setRuc] = useState("");
    const [razonSocial, setRazonSocial] = useState(clienteEditando?.razonSocial ?? "");
    const [contactoEmail, setContactoEmail] = useState(clienteEditando?.contactoEmail ?? "");
    const [telefono, setTelefono] = useState(clienteEditando?.telefono ?? "");
    const [activo, setActivo] = useState(clienteEditando?.activo ?? true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await onSubmit({
                ruc: clienteEditando ? undefined: ruc, 
                razonSocial, 
                contactoEmail: contactoEmail.trim() || null, 
                telefono: telefono.trim() || null, 
                activo
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
                {clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>

            {!clienteEditando && ( 
            <div>
                <label htmlFor="ruc" className="block text-sm text-color1 mb-1">
                    RUC del cliente
                </label>

                <input
                   id = "ruc"
                   type="text"
                   inputMode="numeric" //sugiere mostrar un teclado numerico en dispositivos moviles
                   pattern="[0-9]{11}"
                   title="El RUC debe tener una longitud exacta de 11 caracteres" //title de pattern
                   minLength={11}
                   maxLength={11}
                   value={ruc}
                   // el replace(/\D/g, "") hace que si el usuario introduce un caracter que no sea un numero lo borra
                   onChange={(e) => setRuc(e.target.value.replace(/\D/g, ""))}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                />                
            </div>
            )}

            <div>
                <label htmlFor="razonSocial" className="block text-sm text-color1 mb-1">
                    Razon social
                </label>

                <input
                   id = "razonSocial"
                   type="text"
                   pattern=".{3,}"
                   title="La razon social debe tener al menos 3 caracteres" //title de pattern
                   maxLength={150}
                   value={razonSocial}
                   onChange={(e) => setRazonSocial(e.target.value)}
                   required
                   className="w-full border border-color3 rounded px-3 py-2"
                />                
            </div>

            <div>
               <label htmlFor="contactoEmail" className="block text-sm text-color1 mb-1">
                    Email
                </label>

                <input
                   id = "contactoEmail"
                   type="email"
                   maxLength={100}
                   value={contactoEmail}
                   onChange={(e) => setContactoEmail(e.target.value)}
                   className="w-full border border-color3 rounded px-3 py-2"
                />                
            </div>

            <div>
               <label htmlFor="telefono" className="block text-sm text-color1 mb-1">
                    Teléfono
                </label>

                <input
                   id = "telefono"
                   type="text"
                   inputMode="numeric"
                   pattern="([0-9]{6,7}|9[0-9]{8})"
                   title="Ingresa un teléfono fijo de 6 o 7 dígitos, o un celular de 9 dígitos que comience con 9."                   
                   minLength={6}
                   maxLength={9}
                   value={telefono}
                   onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                   className="w-full border border-color3 rounded px-3 py-2"
                />                
            </div>

            {clienteEditando && (
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

export default ClienteForm;