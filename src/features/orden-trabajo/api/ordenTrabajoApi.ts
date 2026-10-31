import { axiosClient } from "@/api/axiosClient";
import type {
    OrdenTrabajoResponseDto,
    OrdenTrabajoCreateRequestDto,
    OrdenTrabajoUpdateRequestDto,
    AsignarTecnicoRequestDto,
    CambiarEstadoRequestDto,
    EstadoOrdenTrabajo
} from "../types/orden-trabajo.types";
import type { ChangeStatusRequestDto } from "@/types/common.types";

export const ordenTrabajoApi = {

    getAll: async (): Promise<OrdenTrabajoResponseDto[]> => {
        const response = await axiosClient.get<OrdenTrabajoResponseDto[]>("/OrdenTrabajo");
        return response.data;
    },

    getById: async (id: number): Promise<OrdenTrabajoResponseDto> => {
        const response = await axiosClient.get<OrdenTrabajoResponseDto>(`/OrdenTrabajo/${id}`);
        return response.data;
    },

    getByTecnico: async (tecnicoId: number): Promise<OrdenTrabajoResponseDto[]> => {
        const response = await axiosClient.get<OrdenTrabajoResponseDto[]>("/OrdenTrabajo/por-tecnico", {
            params: { tecnicoId }
        });
        return response.data;
    },

    getMisOrdenes: async () : Promise<OrdenTrabajoResponseDto[]> =>{
        const response = await axiosClient.get<OrdenTrabajoResponseDto[]>("/OrdenTrabajo/mis-ordenes");
        return response.data;
    },

    getByEstado: async (estado: EstadoOrdenTrabajo): Promise<OrdenTrabajoResponseDto[]> => {
        const response = await axiosClient.get<OrdenTrabajoResponseDto[]>("/OrdenTrabajo/por-estado", {
            params: { estado },
        });
        return response.data;
    },

    create: async (dto: OrdenTrabajoCreateRequestDto): Promise<OrdenTrabajoResponseDto> => {
        const response = await axiosClient.post<OrdenTrabajoResponseDto>("/OrdenTrabajo", dto);
        return response.data;
    },

    update: async (id: number, dto: OrdenTrabajoUpdateRequestDto) => {
        await axiosClient.put(`/OrdenTrabajo/${id}`, dto);
    },

    asignarTecnico: async (id: number, dto: AsignarTecnicoRequestDto) => {
        await axiosClient.patch(`/OrdenTrabajo/${id}/asignar-tecnico`, dto);
    },

    cambiarEstado: async (id: number, dto: CambiarEstadoRequestDto) => {
        await axiosClient.patch(`/OrdenTrabajo/${id}/cambiar-estado`, dto);
    },

    changeStatus: async (id: number, dto: ChangeStatusRequestDto) => {
        await axiosClient.patch(`/OrdenTrabajo/${id}/estado`, dto);
    },

}