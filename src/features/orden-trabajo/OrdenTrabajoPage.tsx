import { useState, useEffect } from "react";
import { ordenTrabajoApi } from "./api/ordenTrabajoApi";
import { clienteApi } from "../cliente/api/clienteApi";
import { ESTADOS, type OrdenTrabajoResponseDto, type EstadoOrdenTrabajo } from "./types/orden-trabajo.types";
import type { ClienteResponseDto } from "../cliente/types/cliente.types";
import { ESTADO_LABEL } from "./constants/estados";
import type { OrdenTrabajoFormValues } from "./schemas/orden-trabajo.schema";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import OrdenTrabajoTable from "./components/OrdenTrabajoTable";
import OrdenTrabajoForm from "./components/OrdenTrabajoForm";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

function OrdenesTrabajoPage() {
    const [ordenes, setOrdenes] = useState<OrdenTrabajoResponseDto[]>([]);
    const [clientes, setClientes] = useState<ClienteResponseDto[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<EstadoOrdenTrabajo | "Todos">("Todos");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [ordenEditando, setOrdenEditando] = useState<OrdenTrabajoResponseDto | null>(null);

    const { user, hasRole } = useAuth();
    const puedeGestionar = hasRole([ROLES.Admin, ROLES.Planificador]);
    const esSoloTecnico = hasRole([ROLES.TecnicoAlmacen]) && !hasRole([ROLES.Admin]);

    useEffect(() => {
        const cargarDatos = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [ordenesData, clientesData] = await Promise.all([
                    esSoloTecnico && user
                       ? ordenTrabajoApi.getMisOrdenes()
                       : ordenTrabajoApi.getAll(),
                    //los clientes solo hacen falta para el select del formulario
                    puedeGestionar ? clienteApi.getAll() : Promise.resolve<ClienteResponseDto[]>([]),
                ]);

                setOrdenes(ordenesData);
                setClientes(clientesData.filter((c) => c.activo));
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, [esSoloTecnico, puedeGestionar, user]);

    const handleNuevo = () => {
        setOrdenEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (orden: OrdenTrabajoResponseDto) => {
        setOrdenEditando(orden);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setOrdenEditando(null);
    };

    const handleSubmit = async (data: OrdenTrabajoFormValues) => {
        if (ordenEditando) {
            await ordenTrabajoApi.update(ordenEditando.otId, {
                equipoComponente: data.equipoComponente,
                numeroSerie: data.numeroSerie,
                fechaEstimadaEntrega: data.fechaEstimadaEntrega,
                costoManoObra: data.costoManoObra,
                observaciones: data.observaciones,
            });

            setOrdenes((prev) => 
                prev.map((o) =>
                    o.otId === ordenEditando.otId
                    ? {
                        ...o,
                        equipoComponente: data.equipoComponente,
                        numeroSerie: data.numeroSerie,
                        fechaEstimadaEntrega: data.fechaEstimadaEntrega,
                        costoManoObra: data.costoManoObra,
                        costoTotal: data.costoManoObra + o.costoRepuestos,
                        observaciones: data.observaciones,
                    }
                    : o
                )
            );
        } else {
            const creada = await ordenTrabajoApi.create({
                clienteId: data.clienteId,
                equipoComponente: data.equipoComponente,
                numeroSerie: data.numeroSerie,
                fechaEstimadaEntrega: data.fechaEstimadaEntrega,
                costoManoObra: data.costoManoObra,
                observaciones: data.observaciones
            });

 
            setOrdenes((prev) => [creada, ...prev]);
        }

        setMostrarForm(false);
        setOrdenEditando(null);
    };

    const ordenesFiltradas = filtroEstado === "Todos" ? 
        ordenes : 
        ordenes.filter((o) => o.estado === filtroEstado);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-xl font-bold text-color1">
                    Órdenes de Trabajo
                </h1>

                <div className="flex items-center gap-3">
                    <select
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value as EstadoOrdenTrabajo | "Todos")}
                      className="border border-color3 rounded px-3 py-2"
                    >
                        <option value="Todos">Todos los estados</option>
                        {Object.values(ESTADOS).map((estado) =>(
                            <option key={estado} value={estado}>
                                {ESTADO_LABEL[estado]}
                            </option>
                        ))}
                    </select>

                    {!mostrarForm && puedeGestionar && (
                        <button
                          onClick={handleNuevo}
                          className="bg-color1 text-color4 px-4 py-2 rounded"
                        >
                            Nueva OT
                        </button>
                    )}
                </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && puedeGestionar && (
                <OrdenTrabajoForm 
                  key={ordenEditando?.otId ?? "nuevo"}
                  ordenEditando={ordenEditando}
                  clientes={clientes}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
                <div className="text-center py-8 text-color1">Cargando órdenes...</div>
            ) : (
                <OrdenTrabajoTable
                  ordenes={ordenesFiltradas}
                  onEdit={handleEditar}
                  puedeEditar={puedeGestionar}
                />
            )}
        </div>
    )    
}

export default OrdenesTrabajoPage;