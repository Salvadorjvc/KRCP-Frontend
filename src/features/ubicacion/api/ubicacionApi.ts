import { axiosClient } from "@/api/axiosClient";

import type {
    UbicacionResponseDto,
    UbicacionCreateRequestDto,
    UbicacionUpdateRequestDto
} from "../types/ubicacion.types";

import type { ChangeStatusRequestDto } from "@/types/common.types";

export const ubicacionApi = {
    getAll: async (): Promise<UbicacionResponseDto[]> => {
        const response = await axiosClient.get<UbicacionResponseDto[]>("/Ubicacion");
        return response.data;
    },

    getById: async (id: number): Promise<UbicacionResponseDto> => {
        const response = await axiosClient.get<UbicacionResponseDto>(`/Ubicacion/${id}`);
        return response.data;
    },

    create: async (dto: UbicacionCreateRequestDto): Promise<UbicacionResponseDto> => {
        const response = await axiosClient.post<UbicacionResponseDto>("/Ubicacion", dto);
        return response.data;
    },

    update: async (id: number, dto: UbicacionUpdateRequestDto) => {
        await axiosClient.put(`/Ubicacion/${id}`, dto);
    },

    changeStatus: async (id: number, dto: ChangeStatusRequestDto) => {
        await axiosClient.patch(`/Ubicacion/${id}/estado`, dto);
    },
    
}
