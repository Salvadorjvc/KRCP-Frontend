import {axiosClient} from "@/api/axiosClient";
import type{ LoginRequestDto, LoginResponseDto } from "../types/auth.types";

export const authApi = {
    login: async (credenciales: LoginRequestDto): Promise<LoginResponseDto> => {
        const response = await axiosClient.post<LoginResponseDto>('/auth/login', credenciales);
        return response.data;
    },
};