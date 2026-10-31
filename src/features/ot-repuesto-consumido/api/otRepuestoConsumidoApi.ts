import { axiosClient } from "@/api/axiosClient";
import type {
    OtRepuestoConsumidoResponseDto,
    OtRepuestoConsumidoCreateRequestDto
} from "../types/ot-repuesto-consumido.types";

export const otRepuestoConsumidoApi = {

    getByOtId: async (otId: number): Promise<OtRepuestoConsumidoResponseDto[]> => {
        const response = await axiosClient.get<OtRepuestoConsumidoResponseDto[]>("/OtRepuestoConsumido/por-ordentrabajo",
            {params: {otId}}
        );
        return response.data;
    },

    despachar: async (dto: OtRepuestoConsumidoCreateRequestDto): Promise<OtRepuestoConsumidoResponseDto> => {
        const response = await axiosClient.post<OtRepuestoConsumidoResponseDto>("/OtRepuestoConsumido", dto);
        return response.data
    },
};