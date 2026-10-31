//estructura de respuesta(JSON) de mi middleware de .net
export interface ApiError {
    statusCode: number;
    message: string;
    Message?: string; // Para respuestas en PascalCase de .NET
    title?: string;   // Para ProblemDetails
    detail?: string;  // Para ProblemDetails
}