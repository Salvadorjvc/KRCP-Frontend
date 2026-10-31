import { axiosClient } from "@/api/axiosClient";

import type {
    CategoriaResponseDto,
    CategoriaCreateRequestDto,
    CategoriaUpdateRequestDto
} from "../types/categoria.types";

import type { ChangeStatusRequestDto } from "@/types/common.types";

export const categoriaApi = {
    getAll: async (): Promise<CategoriaResponseDto[]> => {
        const response = await axiosClient.get<CategoriaResponseDto[]>("/Categoria");
        return response.data;
    },

    getById: async (id: number): Promise<CategoriaResponseDto> => {
        const response = await axiosClient.get<CategoriaResponseDto>(`/Categoria/${id}`);
        return response.data;
    },

    create: async (dto: CategoriaCreateRequestDto): Promise<CategoriaResponseDto> => {
        const response = await axiosClient.post<CategoriaResponseDto>("/Categoria", dto);
        return response.data
    },

    update: async (id:number, dto: CategoriaUpdateRequestDto) => {
        await axiosClient.put(`/Categoria/${id}`, dto);
    },

    changeStatus: async (id: number, dto: ChangeStatusRequestDto) => {
        await axiosClient.patch(`/Categoria/${id}/estado`, dto);
    },
}