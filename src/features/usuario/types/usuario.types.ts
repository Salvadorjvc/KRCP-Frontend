export interface UsuarioResponseDto{
    usuarioId: number;
    nombreCompleto: string;
    email: string;
    activo: boolean;
    rolId: number;
    nombreRol: string;
    fechaCreacion: string;
    fechaModificacion: string | null;
}

export interface UsuarioCreateRequestDto{
    nombreCompleto: string;
    email: string;
    password: string;
    rolId: number;
}

export interface UsuarioUpdateRequestDto{
    nombreCompleto: string;
    email: string;
    rolId: number;
    activo: boolean;
}

export interface ChangePasswordRequestDto{
    passwordActual: string;
    passwordNueva: string;
}

export interface UsuarioSimpleResponseDto{
    usuarioId: number;
    nombreCompleto: string;
}