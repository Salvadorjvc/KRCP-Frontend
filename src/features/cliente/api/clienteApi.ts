import { axiosClient } from "@/api/axiosClient";

import type {
    ClienteResponseDto,
    ClienteCreateRequestDto,
    ClienteUpdateRequestDto
} from "../types/cliente.types";

import type { ChangeStatusRequestDto } from "@/types/common.types";

export const clienteApi = {
    getAll: async (): Promise<ClienteResponseDto[]> => {
        const response = await axiosClient.get<ClienteResponseDto[]>("/Cliente");
        return response.data;
    },

    getById: async (id: number): Promise<ClienteResponseDto> => {
        const response = await axiosClient.get<ClienteResponseDto>(`/Cliente/${id}`);
        return response.data;
    },

    create: async (dto: ClienteCreateRequestDto): Promise<ClienteResponseDto> => {
        const response = await axiosClient.post<ClienteResponseDto>("/Cliente", dto);
        return response.data;
    },

    update: async (id: number, dto: ClienteUpdateRequestDto) => {
        await axiosClient.put(`/Cliente/${id}`, dto);
    },

    changeStatus: async(id: number, dto: ChangeStatusRequestDto) => {
        await axiosClient.patch(`/Cliente/${id}/estado`, dto);
    },
}