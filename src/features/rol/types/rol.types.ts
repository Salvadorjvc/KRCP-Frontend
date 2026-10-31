export interface RolResponseDto{
    rolId: number;
    nombreRol: string;
    activo : boolean;
}

export interface RolCreateRequestDto{
    nombreRol: string;
}

export interface RolUpdateRequestDto{
    nombreRol: string;
    activo: boolean;
}