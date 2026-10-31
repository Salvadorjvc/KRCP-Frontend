import { useState, useEffect} from "react";
import { productoApi } from "./api/productoApi";
import { categoriaApi } from "../categoria/api/categoriaApi";
import { ubicacionApi } from "../ubicacion/api/ubicacionApi";
import type { ProductoResponseDto } from "./types/producto.types";
import type { CategoriaResponseDto } from "../categoria/types/categoria.types";
import type { UbicacionResponseDto } from "../ubicacion/types/ubicacion.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import ProductoTable from "./components/ProductoTable";
import ProductoForm  from "./components/ProductoForm";
import type { ProductoFormValues } from "./schemas/producto.schema";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

function ProductosPage() {
    const [productos, setProductos] = useState<ProductoResponseDto[]>([]);
    const [categorias, setCategorias] = useState<CategoriaResponseDto[]>([]);
    const [ubicaciones, setUbicaciones] = useState<UbicacionResponseDto[]>([]);
    const { hasRole } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [productoEditando, setProductoEditando] = useState<ProductoResponseDto | null>(null);

    const puedeGestionar = hasRole([ROLES.Admin]);

    useEffect(() => {
        const cargarDatos = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [productoData, categoriasData, ubicacionesData] = await Promise.all([
                    productoApi.getAll(),
                    categoriaApi.getAll(),
                    ubicacionApi.getAll(),
                ]);

                setProductos(productoData);
                setCategorias(categoriasData.filter((c) => c.activo));
                setUbicaciones(ubicacionesData.filter((u) => u.activo));
                
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const handleNuevo = () => {
        setProductoEditando(null);
        setMostrarForm(true);
    };

    const handleEditar = (producto: ProductoResponseDto) => {
        setProductoEditando(producto);
        setMostrarForm(true);
    };

    const handleCancelar = () => {
        setMostrarForm(false);
        setProductoEditando(null);
    };

    const handleSubmit = async (data: ProductoFormValues) => {

        if (productoEditando) {
            await productoApi.update(productoEditando.productoId, {
                nombre: data.nombre,
                categoriaId: data.categoriaId,
                ubicacionId: data.ubicacionId,
                stockMinimo: data.stockMinimo,
                costoUnitario: data.costoUnitario,
                activo: data.activo,
            });

            const categoria = categorias.find((c) => c.categoriaId === data.categoriaId);
            const ubicacion = ubicaciones.find((u) => u.ubicacionId === data.ubicacionId);

            setProductos((prev) =>
               prev.map((p) =>
                  p.productoId === productoEditando.productoId
                   ?{
                        ...p,
                        nombre: data.nombre,
                        categoriaId: data.categoriaId,
                        nombreCategoria: categoria?.nombre ?? p.nombreCategoria,
                        ubicacionId: data.ubicacionId,
                        codigoUbicacion: ubicacion?.codigoUbicacion ?? null,
                        stockMinimo: data.stockMinimo,
                        costoUnitario: data.costoUnitario,
                        activo: data.activo,
                    }
                  :p
                )
            );
        } else {
            if(!data.codigoParte) {
                throw new Error("El código de parte es obligatorio");
            }

            const nuevoProducto = await productoApi.create({
                codigoParte: data.codigoParte,
                nombre: data.nombre,
                categoriaId: data.categoriaId,
                ubicacionId: data.ubicacionId,
                stockMinimo: data.stockMinimo,
                costoUnitario: data.costoUnitario,
            });

            setProductos((prev) => [nuevoProducto, ...prev]);
        }

        setMostrarForm(false);
        setProductoEditando(null);
    };

    const handleToggleStatus = async (producto: ProductoResponseDto) => {
        try {
            setError(null);
            await productoApi.changeStatus(producto.productoId, {activo: !producto.activo});

            setProductos((prev) =>
               prev.map((p) =>
                  p.productoId === producto.productoId ? {...p, activo: !p.activo} : p
                )
            );
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-color1">Productos</h1>
                {!mostrarForm && puedeGestionar && (
                    <button
                       onClick={handleNuevo}
                       className="bg-color1 text-color4 px-4 py-2 rounded"
                    >
                        Nuevo Producto
                    </button>
                )}
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {mostrarForm && puedeGestionar && (
                <ProductoForm 
                    key={productoEditando?.productoId ?? "nuevo"}
                    productoEditando={productoEditando}
                    categorias={categorias}
                    ubicaciones={ubicaciones}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelar}
                />
            )}

            {isLoading ? (
                <div className="text-center py-8 text-color1">Cargando productos...</div>
            ) : (
                <ProductoTable
                    productos={productos}
                    onEdit={handleEditar}
                    onToggleStatus={handleToggleStatus}
                    puedeGestionar={puedeGestionar}
                />
            )}

        </div>
    );
}

export default ProductosPage;