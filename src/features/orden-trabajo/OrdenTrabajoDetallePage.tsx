import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ordenTrabajoApi } from "./api/ordenTrabajoApi";
import { usuarioApi } from "@/features/usuario/api/usuarioApi";
import type { OrdenTrabajoResponseDto, EstadoOrdenTrabajo } from "./types/orden-trabajo.types";
import type { UsuarioSimpleResponseDto } from "@/features/usuario/types/usuario.types";
import { ESTADO_LABEL } from "./constants/estados";
import AsignarTecnicoPanel from "./components/AsignarTecnicoPanel";
import CambiarEstadoPanel from "./components/CambiarEstadoPanel";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { formatDate, formatDateOnly, formatMoney } from "@/utils/formatters";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import type { ProductoResponseDto } from "../producto/types/producto.types";
import type { OtRepuestoConsumidoResponseDto } from "../ot-repuesto-consumido/types/ot-repuesto-consumido.types";
import { productoApi } from "../producto/api/productoApi";
import { otRepuestoConsumidoApi } from "../ot-repuesto-consumido/api/otRepuestoConsumidoApi";
import type { DespacharFormValues } from "../ot-repuesto-consumido/schemas/despachar.schema";
import DespacharRepuestoForm from "../ot-repuesto-consumido/components/DespacharRepuestoForm";
import RepuestoConsumidoTable from "../ot-repuesto-consumido/components/RepuestoConsumidoTable";

function OrdenTrabajoDetallePage() {
    const { id } = useParams();
    const otId = Number(id);
    const idValido = Number.isInteger(otId) && otId > 0

    const [orden, setOrden] = useState<OrdenTrabajoResponseDto | null>(null);
    const [tecnicos, setTecnicos] = useState<UsuarioSimpleResponseDto[]>([]);
    const [productos, setProductos] = useState<ProductoResponseDto[]>([]);
    const [repuestos, setRepuestos] = useState<OtRepuestoConsumidoResponseDto[]>([]);
    const [mostrarDespacho, setMostrarDespacho] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { hasRole } = useAuth();
    const puedeAsignar = hasRole([ROLES.Admin, ROLES.Planificador]);
    const puedeCambiarEstado = hasRole([ROLES.Admin, ROLES.Planificador, ROLES.TecnicoAlmacen]);
    const puedeDespachar = hasRole([ROLES.Admin, ROLES.TecnicoAlmacen]);

    const cargarOrden = useCallback(async () => {
        setOrden(await ordenTrabajoApi.getById(otId));
    }, [otId]);

    useEffect(() => {
        if(!idValido) return;

        const cargarDatos = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [ordenData, tecnicosData, repuestosData, productosData] = await Promise.all([
                    ordenTrabajoApi.getById(otId),
                    puedeAsignar ? usuarioApi.getTecnicos() : Promise.resolve<UsuarioSimpleResponseDto[]>([]),
                    otRepuestoConsumidoApi.getByOtId(otId),
                    puedeDespachar ? productoApi.getAll() : Promise.resolve<ProductoResponseDto[]>([]),
                ]);

                setRepuestos(repuestosData);
                setProductos(productosData.filter((p) => p.activo && p.stockActual > 0));
                setOrden(ordenData);
                setTecnicos(tecnicosData);
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, [otId, idValido,puedeAsignar, puedeDespachar]);

    // Acciones sin formulario propio: el error sube al panel que las dispara
    const handleAsignar = async (tecnicoId: number) => {
        await ordenTrabajoApi.asignarTecnico(otId, { tecnicoId });
        await cargarOrden();
    };

    const handleCambiarEstado = async (nuevoEstado: EstadoOrdenTrabajo) => {
        await ordenTrabajoApi.cambiarEstado(otId, { nuevoEstado });
        await cargarOrden();
    };

    const handleDespachar = async (data: DespacharFormValues) => {
        await otRepuestoConsumidoApi.despachar({otId, productoId: data.productoId, cantidad: data.cantidad});

        //cambien tres cosas: la lista de consumos, el costo de la OT y el stock de los productos
        const [repuestosData, productosData] = await Promise.all([
            otRepuestoConsumidoApi.getByOtId(otId),
            productoApi.getAll(),
            cargarOrden(),
        ]);

        setRepuestos(repuestosData);
        setProductos(productosData.filter((p) => p.activo && p.stockActual > 0));
        setMostrarDespacho(false);
    };

    if (!idValido) {
        return (
           <div className="space-y-4">
              <p className="text-red-600">Orden de trabajo no válida.</p>
              <Link to={ROUTES.OrdenTrabajo} className="text-color3 text-sm">
                 Volver a la lista
              </Link>
          </div>
        );
    }


    if (isLoading) {
        return <div className="text-center py-8 text-color1">Cargando orden...</div>;
    }

    if (error || !orden) {
        return (
            <div className="space-y-4">
                <p className="text-red-600">{error ?? "No se encontró la orden."}</p>
                <Link to={ROUTES.OrdenTrabajo} className="text-color3 text-sm">← Volver a la lista</Link>
            </div>
        );
    }

    const cerrada = orden.estado === "Completado" || orden.estado === "Cancelado";

    return (
        <div className="space-y-4">
            <Link to={ROUTES.OrdenTrabajo} className="text-color3 text-sm"> Volver a la lista</Link>

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">{orden.codigoOt}</h1>
                <span className="px-3 py-1 rounded-full border border-color3 text-sm text-color1">
                    {ESTADO_LABEL[orden.estado]}
                </span>
            </div>

            <div className="bg-color4 rounded-xl shadow-sm border border-color3 p-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <Dato label="Cliente" value={orden.razonSocialCliente} />
                    <Dato label="Equipo / Componente" value={orden.equipoComponente} />
                    <Dato label="Número de serie" value={orden.numeroSerie} />
                    <Dato label="Planificador" value={orden.nombrePlanificador} />
                    <Dato label="Técnico asignado" value={orden.nombreTecnico ?? "Sin asignar"} />
                    <Dato label="Fecha de ingreso" value={formatDate(orden.fechaIngreso)} />
                    <Dato label="Entrega estimada" value={formatDateOnly(orden.fechaEstimadaEntrega)} />
                    <Dato label="Fecha de cierre" value={formatDate(orden.fechaCierre)} />
                    <Dato label="Mano de obra" value={formatMoney(orden.costoManoObra)} />
                    <Dato label="Repuestos" value={formatMoney(orden.costoRepuestos)} />
                    <Dato label="Costo total" value={formatMoney(orden.costoTotal)} />
                    <Dato label="Observaciones" value={orden.observaciones ?? "—"} />
                </dl>
            </div>

            {puedeAsignar && !cerrada && (
                <AsignarTecnicoPanel
                    key={orden.tecnicoAsignadoId ?? "sin-tecnico"}
                    tecnicos={tecnicos}
                    tecnicoActualId={orden.tecnicoAsignadoId}
                    onAsignar={handleAsignar}
                />
            )}

            {puedeCambiarEstado && (
                <CambiarEstadoPanel estadoActual={orden.estado} onCambiar={handleCambiarEstado} />
            )}

            <section className="space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-color1">
                        Repuestos despachados
                    </h2>
                    {puedeDespachar && orden.estado === "EnProceso" && !mostrarDespacho &&(
                        <button
                          onClick={() => setMostrarDespacho(true)}
                          className="bg-color1 text-color4 px-4 py-2 rounded"
                        >
                            Despachar repuesto
                        </button>
                    )}
                </div>

                {mostrarDespacho && (
                    <DespacharRepuestoForm 
                       productos={productos}
                       onSubmit={handleDespachar}
                       onCancel={() => setMostrarDespacho(false)}
                    />
                )}

                <RepuestoConsumidoTable  repuestos={repuestos}/>
            </section>

            {/* Etapa 5: evidencias */}


        </div>
    );
}

function Dato({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-color2 text-xs uppercase tracking-wide">{label}</dt>
            <dd className="text-color1">{value}</dd>
        </div>
    );
}

export default OrdenTrabajoDetallePage;