import { useState, useEffect} from "react";
import { categoriaApi } from "./api/categoriaApi";
import type { CategoriaResponseDto } from "./types/categoria.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import CategoriaTable from "./components/CategoriaTable";
import CategoriaForm from "./components/CategoriaForm";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";


function CategoriasPage() {
    const [categorias, setCategorias] = useState<CategoriaResponseDto[]>([]);
    const {hasRole} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState<CategoriaResponseDto | null>(null);

    const puedeGestionar = hasRole([ROLES.Admin]);

    useEffect(() => {
        const cargarCategorias = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await categoriaApi.getAll();
                setCategorias(data);
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false)
            }
        };
        cargarCategorias();
    }, []);

    const handleNuevo = () => {
        setCategoriaEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (categoria: CategoriaResponseDto) => {
        setCategoriaEditando(categoria);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setCategoriaEditando(null);
    };

    const handleSubmit = async (data: {
        nombre: string,
        descripcion: string | null,
        activo: boolean
    }) => {
            
        if(categoriaEditando) {

                await categoriaApi.update(categoriaEditando.categoriaId, {
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    activo: data.activo
                });

                setCategorias((prev) => 
                    prev.map((c) =>
                    c.categoriaId === categoriaEditando.categoriaId ? 
                    {
                        ...c,
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        activo: data.activo
                    } : c
                ));
        }
        else {
            const nuevaCategoria = await categoriaApi.create({
                    nombre: data.nombre,
                    descripcion: data.descripcion
            });

            setCategorias((prev) => [...prev, nuevaCategoria]);
        }

            setMostrarForm(false);
            setCategoriaEditando(null);
    };

    const handleToggleStatus = async (categoria: CategoriaResponseDto) => {
        try {

            setError(null);

            await categoriaApi.changeStatus(categoria.categoriaId, {activo: !categoria.activo})

            setCategorias((prev) => 
                prev.map((c) =>
                    c.categoriaId === categoria.categoriaId ? {...c, activo: !c.activo}: c
                )
            );

        } catch(err) {
            setError (getApiErrorMessage(err));
        }
    };

    return (
        <div className="space-y-4">

           <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">Categorias</h1>
                {!mostrarForm && puedeGestionar && (
                    <button
                       onClick={handleNuevo}
                       className="bg-color1 text-color4 px-4 py-2 rounded"                       
                    >
                        Nueva Categoria
                    </button>
                )}
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && puedeGestionar &&(
                <CategoriaForm
                    key={categoriaEditando?.categoriaId ?? "nuevo"}
                    categoriaEditando={categoriaEditando}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
                <div className="text-center py-8 text-color1">Cargando Categorias...</div>
            ) : (
                <CategoriaTable
                   categorias={categorias}
                   onEdit={handleEditar}
                   onToggleStatus={handleToggleStatus}
                   puedeGestionar={puedeGestionar} 
                />
            )}

        </div>
    );
}

export default CategoriasPage;