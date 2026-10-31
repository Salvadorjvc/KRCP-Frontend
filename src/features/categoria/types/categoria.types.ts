export interface CategoriaResponseDto{
    categoriaId: number;
    nombre: string;
    descripcion:  string | null;
    activo: boolean;
}

export interface CategoriaCreateRequestDto{
    nombre: string;
    descripcion: string | null;
}

export interface CategoriaUpdateRequestDto{
    nombre: string;
    descripcion: string | null;
    activo: boolean;
}