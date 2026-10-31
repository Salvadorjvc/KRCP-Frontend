export interface LoginRequestDto{
    email: string;
    password: string;
}

export interface LoginResponseDto{

    token: string;
    expiraEn: string;
    usuarioId: number;
    nombreCompleto: string;
    email: string;
    nombreRol: string;
}


