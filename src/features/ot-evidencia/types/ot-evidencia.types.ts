export interface OtEvidenciaResponseDto{
    evidenciaId: number;
    otId: number;
    codigoOt: string;
    tipoEvidencia: string;
    urlArchivo: string;
    descripcion: string | null;

    usuarioCargaId: number;
    usuarioCarga: string;

    fechaCarga: string;
}

export interface OtEvidenciaCreateRequestDto{
    otId: number;
    tipoEvidencia: TipoEvidenciaOt;
    urlArchivo: string;
    descripcion: string | null;
}

//enum de tipo de evidencia
export type TipoEvidenciaOt = 'Ingreso' | 'Diagnostico' |'QaFinal'| 'Entrega';

