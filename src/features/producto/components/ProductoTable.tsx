import type { ProductoResponseDto } from "../types/producto.types";

interface ProductoTableProps {
    productos: ProductoResponseDto[];
    onEdit: (producto: ProductoResponseDto) =>  void;
    onToggleStatus: (producto: ProductoResponseDto) => void;
    puedeGestionar: boolean;
}

function ProductoTable({ productos, onEdit, onToggleStatus, puedeGestionar}: ProductoTableProps) {

    if (productos.length === 0) {
        return(
            <div className ="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2 ">
                No hay productos registrado
            </div>
        );
    }

    return(
        <table className= "w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className = "text-color2 text-xs font-semibold">
                KRCP - Módulo de Productos
            </caption>

            <thead>
                <tr className=" text-left border-b border-color2 text-sm font-semibold text-color1">
                  <th className="p-3">Código</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Costo unit.</th>
                  <th className="p-3">Estado</th>
                  {puedeGestionar && <th className="p-3">Acciones</th>}
                </tr>
            </thead>

            <tbody>
                {productos.map((producto) => {

                    const stockBajo = producto.stockActual <= producto.stockMinimo;

                    return (
                    <tr key={producto.productoId} className="border-b border-color2 text-color1">
                        <td className="p-3"> {producto.codigoParte}</td>
                        <td className="p-3"> {producto.nombre}</td>
                        <td className="p-3"> {producto.nombreCategoria}</td>
                        <td className="p-3"> {producto.codigoUbicacion ?? "-"}</td>
                        <td className={`p-3 font-medium ${stockBajo ? "text-red-600" : "text-color1"}`}>
                            {producto.stockActual} /min. {producto.stockMinimo}
                        </td>
                        <td className="p-3">S/ {producto.costoUnitario.toFixed(2)}</td>
                        <td className="p-3"> {producto.activo ? "Activo" : "Inactivo"}</td>
                        
                      {puedeGestionar && (
                        <td className="p-3 space-x-3">
                            <button onClick={() => onEdit(producto)} className="text-color3 text-sm">
                                Editar
                            </button>

                            <button onClick={() => onToggleStatus(producto)} className="text-red-600 text-sm">
                                {producto.activo ? "Desactivar" : "Activar"}
                            </button>
                        </td>
                      )}
                    </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default ProductoTable;