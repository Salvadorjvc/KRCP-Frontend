import { axiosClient } from "@/api/axiosClient";

import type {
    UsuarioResponseDto, 
    UsuarioCreateRequestDto, 
    UsuarioUpdateRequestDto, 
    ChangePasswordRequestDto,
    UsuarioSimpleResponseDto
} from "../types/usuario.types";

import type { ChangeStatusRequestDto } from "@/types/common.types";

export const usuarioApi = {
    getAll: async (): Promise<UsuarioResponseDto[]> => {
        const response = await axiosClient.get<UsuarioResponseDto[]>("/Usuario");
        return response.data;
    },

    getById: async (id: number): Promise<UsuarioResponseDto> => {
        const response = await axiosClient.get<UsuarioResponseDto>(`/Usuario/${id}`);
        return response.data;
    },

    getTecnicos: async (): Promise<UsuarioSimpleResponseDto[]> => {
        const response = await axiosClient.get<UsuarioSimpleResponseDto[]>("/Usuario/tecnicos");
        return response.data;
    },

    create: async (dto: UsuarioCreateRequestDto) : Promise<UsuarioResponseDto> => {
        const response = await axiosClient.post<UsuarioResponseDto>("/Usuario", dto);
        return response.data;
    },

    update: async (id: number, dto: UsuarioUpdateRequestDto) => {
        await axiosClient.put(`/Usuario/${id}`, dto);
    },

    changeStatus: async (id: number, dto: ChangeStatusRequestDto)  => {
        await axiosClient.patch(`/Usuario/${id}/estado`, dto);
    },

    changePassword: async (id: number, dto: ChangePasswordRequestDto) => {
        await axiosClient.patch(`/Usuario/${id}/cambiar-password`, dto);
    },
};