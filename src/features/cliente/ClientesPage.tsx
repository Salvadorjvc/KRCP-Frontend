import { useState, useEffect } from "react";
import { clienteApi } from "./api/clienteApi";
import type { ClienteResponseDto } from "./types/cliente.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import ClienteTable from "./components/ClienteTable";
import ClienteForm from "./components/ClienteForm";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

function ClientesPage() {
    const [clientes, setClientes] = useState<ClienteResponseDto[]>([]);
    const { hasRole } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [clienteEditando, setClienteEditando] = useState<ClienteResponseDto | null>(null);

    // Verificamos si el usuario actual es Admin o Planificador
    const puedeGestionar = hasRole([ROLES.Admin, ROLES.Planificador]);
    const puedeCambiarEstado = hasRole([ROLES.Admin]);

    useEffect(() => {
        const cargarClientes = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await clienteApi.getAll();
                setClientes(data);
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        cargarClientes();
    }, []);

    const handleNuevo = () => {
        setClienteEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (cliente: ClienteResponseDto) => {
        setClienteEditando(cliente);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setClienteEditando(null);
    };

    const handleSubmit = async (data: {
        ruc?: string,
        razonSocial: string,
        contactoEmail: string | null,
        telefono: string | null,
        activo: boolean,
    }) => {


        if(clienteEditando) {

                await clienteApi.update(clienteEditando.clienteId, {
                    razonSocial: data.razonSocial,
                    contactoEmail: data.contactoEmail,
                    telefono: data.telefono,
                    activo: data.activo
                });

                setClientes((prev) =>
                    prev.map((c) =>
                    c.clienteId === clienteEditando.clienteId ? 
                    {
                        ...c,
                        razonSocial: data.razonSocial,
                        contactoEmail: data.contactoEmail,
                        telefono: data.telefono,
                        activo: data.activo
                    } : c    
                  )
                );
            } else {

                if (!data.ruc) {
                    throw new Error("El RUC es obligatorio");
                }

                const nuevoCliente = await clienteApi.create({
                    ruc: data.ruc,
                    razonSocial: data.razonSocial,
                    contactoEmail: data.contactoEmail,
                    telefono: data.telefono
                });

                setClientes((prev) => [...prev, nuevoCliente]);
        }

        setMostrarForm(false)
        setClienteEditando(null);
    };

    const handleToggleStatus = async (cliente: ClienteResponseDto) => {
        try {

            setError(null);

            await clienteApi.changeStatus(cliente.clienteId, {activo : !cliente.activo})

            setClientes((prev) =>
                prev.map((c) => 
                    c.clienteId === cliente.clienteId ? {...c, activo: !c.activo} : c
                )
            );

        } catch(err) {
            setError (getApiErrorMessage(err));
        }
    };

    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">Clientes</h1>
                {!mostrarForm && puedeGestionar && (
                    <button
                       onClick={handleNuevo}
                       className="bg-color1 text-color4 px-4 py-2 rounded"                       
                    >
                        Nuevo Cliente
                    </button>
                )}
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && puedeGestionar &&(
                <ClienteForm
                    key={clienteEditando?.clienteId ?? "nuevo"}
                    clienteEditando={clienteEditando}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
                <div className="text-center py-8 text-color1">Cargando Clientes...</div>
            ) : (
                <ClienteTable
                   clientes={clientes}
                   onEdit={handleEditar}
                   onToggleStatus={handleToggleStatus}
                   puedeGestionar={puedeGestionar} 
                   puedeCambiarEstado={puedeCambiarEstado}
                />
            )}

        </div>
                  
    );
}

export default ClientesPage;