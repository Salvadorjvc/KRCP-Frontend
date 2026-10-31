import type { CategoriaResponseDto } from "../types/categoria.types";

interface CategoriaTableProps {
    categorias: CategoriaResponseDto[];
    onEdit: (categoria: CategoriaResponseDto) => void;
    onToggleStatus: (categoria: CategoriaResponseDto) => void;
    puedeGestionar: boolean;
}

function CategoriaTable({categorias, onEdit, onToggleStatus, puedeGestionar}: CategoriaTableProps) {

    if (categorias.length === 0) {
        return(
         <div className="text-center py-8 text-color1 bg-color4 rounded-xl border border-color2">
           No hay categorias registradas.
         </div>
        );
    }


    return(
        <table className="w-full bg-color4 rounded-xl shadow-sm border border-color2">
            <caption className="text-color2 text-xs font-semibold">
                KRCP - Módulo de Categorias
            </caption>
            <thead>
                <tr className = "border-b border-color2 text-left text-sm font-semibold text-color1">
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">Estado</th>
                    {puedeGestionar && <th className="p-3"> Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {categorias.map((categoria) => (
                    <tr key = {categoria.categoriaId} className ="border-b border-color2">
                        <td className="p-3 text-color1"> {categoria.nombre}</td>
                        <td className="p-3 text-color1"> {categoria.descripcion}</td>
                        <td className="p-3 text-color1"> {categoria.activo ? "Activo" : "Inactivo"}</td>

                        {puedeGestionar && (
                        <td className="p-3 space-x-3">
                            <button onClick={() => onEdit(categoria)} className="text-color3 text-sm">
                                Editar
                            </button>

                            <button onClick={() => onToggleStatus(categoria)} className="text-red-600 text-sm">
                                {categoria.activo ? "Desactivar" : "Activar"}
                            </button>
                            
                        </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CategoriaTable;