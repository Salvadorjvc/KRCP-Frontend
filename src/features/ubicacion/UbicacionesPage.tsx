import {useState, useEffect} from "react";
import { ubicacionApi } from "./api/ubicacionApi";
import type { UbicacionResponseDto } from "./types/ubicacion.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import UbicacionTable from "./components/UbicacionTable";
import UbicacionForm from "./components/UbicacionForm";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

function UbicacionPage() {
    const [ubicaciones, setUbicaciones] = useState<UbicacionResponseDto[]>([]);
    const {hasRole} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [ubicacionEditando, setUbicacionEditando] = useState<UbicacionResponseDto | null>(null);

    const puedeGestionar = hasRole([ROLES.Admin]);

    useEffect(() => {
        const cargarUbicaciones = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await ubicacionApi.getAll();
                setUbicaciones(data);

            } catch (err) {
                setError(getApiErrorMessage(err));
                
            } finally {
                setIsLoading(false);
            }
        };
        cargarUbicaciones();
    }, []);

    const handleNuevo = () => {
        setUbicacionEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (ubicacion: UbicacionResponseDto) => {
        setUbicacionEditando(ubicacion);
        setMostrarForm(true);
    };
    
    const handleCancelar = () => {
        setMostrarForm(false);
        setUbicacionEditando(null);
    };

    const handleSubmit = async (data: {
        codigoUbicacion: string,
        descripcion: string | null,
        activo: boolean
    }) => {

        if(ubicacionEditando) {

            await ubicacionApi.update(ubicacionEditando.ubicacionId, {
                codigoUbicacion: data.codigoUbicacion,
                descripcion: data.descripcion,
                activo: data.activo
            });

            setUbicaciones((prev) =>
                prev.map((u) =>
                u.ubicacionId === ubicacionEditando.ubicacionId  ?
               {
                    ...u,
                    codigoUbicacion: data.codigoUbicacion,
                    descripcion: data.descripcion,
                    activo: data.activo
                } : u  
            ));



        } else {
                const nuevaUbicacion = await ubicacionApi.create(
                    {
                        codigoUbicacion: data.codigoUbicacion,
                        descripcion: data.descripcion
                    }
                );

                setUbicaciones((prev) => [...prev, nuevaUbicacion]);
        }

        setMostrarForm(false);
        setUbicacionEditando(null);

    };

    const handleToggleStatus = async (ubicacion: UbicacionResponseDto) => {
        try {
            
            setError(null)

            await ubicacionApi.changeStatus(ubicacion.ubicacionId, {activo: !ubicacion.activo})

            setUbicaciones((prev) =>
                prev.map((u) => 
                    u.ubicacionId === ubicacion.ubicacionId ? {...u, activo: !u.activo} : u
                )
            );
        } catch (err) {
            setError (getApiErrorMessage(err));
        }
    };

    return (
        <div className="space-y-4">

           <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">Ubicaciones</h1>
                {!mostrarForm && puedeGestionar && (
                    <button
                       onClick={handleNuevo}
                       className="bg-color1 text-color4 px-4 py-2 rounded"                       
                    >
                        Nueva Ubicación
                    </button>
                )}
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && puedeGestionar &&(
                <UbicacionForm
                    key={ubicacionEditando?.ubicacionId ?? "nuevo"}
                    ubicacionEditando={ubicacionEditando}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
                <div className="text-center py-8 text-color1">Cargando Ubicaciones...</div>
            ) : (
                <UbicacionTable
                   ubicaciones={ubicaciones}
                   onEdit={handleEditar}
                   onToggleStatus={handleToggleStatus}
                   puedeGestionar={puedeGestionar} 
                />
            )}

        </div>
    );
}


export default UbicacionPage;