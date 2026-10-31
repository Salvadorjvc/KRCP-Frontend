import { axiosClient } from "@/api/axiosClient";

import type {RolResponseDto, RolCreateRequestDto, RolUpdateRequestDto} from "../types/rol.types";
import type { ChangeStatusRequestDto } from "@/types/common.types";

export const rolApi = {
    getAll: async (): Promise<RolResponseDto[]> => {
        const response = await axiosClient.get<RolResponseDto[]>("/Rol");
        return response.data;
    },

    getById: async (id: number): Promise<RolResponseDto> => {
        const response = await axiosClient.get<RolResponseDto>(`/Rol/${id}`);
        return response.data;
    },

    create: async (dto: RolCreateRequestDto) : Promise<RolResponseDto> => {
        const response = await axiosClient.post<RolResponseDto>("/Rol", dto);
        return response.data;
    },

    update: async (id: number, dto: RolUpdateRequestDto) => {
        await axiosClient.put(`/Rol/${id}`, dto);
    },

    changeStatus: async (id: number, dto: ChangeStatusRequestDto) => {
        await axiosClient.patch(`/Rol/${id}/estado`, dto);
    },
};