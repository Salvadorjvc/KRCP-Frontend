import { axiosClient } from "@/api/axiosClient";

import type { 
    ProductoResponseDto,
    ProductoCreateRequestDto, 
    ProductoUpdateRequestDto 
} from "../types/producto.types";

import type { ChangeStatusRequestDto } from "@/types/common.types";

export const productoApi = {
    getAll: async (): Promise<ProductoResponseDto[]> => {
        const response = await axiosClient.get<ProductoResponseDto[]>("/Producto");
        return response.data;
    },

    getById: async (id: number): Promise<ProductoResponseDto> => {
        const response = await axiosClient.get<ProductoResponseDto>(`/Producto/${id}`);
        return response.data;
    },

    create: async (dto: ProductoCreateRequestDto): Promise<ProductoResponseDto> => {
        const response = await axiosClient.post<ProductoResponseDto>("/Producto", dto);
        return response.data;
    },

    update: async (id: number, dto: ProductoUpdateRequestDto) => {
        await axiosClient.put(`/Producto/${id}`, dto);
    },

    changeStatus: async (id: number, dto:ChangeStatusRequestDto) => {
        await axiosClient.patch(`/Producto/${id}/estado`,dto);
    },


    //
    getStockBajo: async (): Promise<ProductoResponseDto[]> => {
        const response = await axiosClient.get<ProductoResponseDto[]>(`/Producto/Stock-bajo`);
        return response.data;
    },
};