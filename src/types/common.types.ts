/**
 * DTO genérico para la actualización de estado (activar/desactivar).
 * Utilizado por los controladores que implementan el endpoint [HttpPatch("{id}/estado")].
 */
export interface ChangeStatusRequestDto{
    activo: boolean;
}