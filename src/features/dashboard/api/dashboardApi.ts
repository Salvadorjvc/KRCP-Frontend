import { axiosClient } from "@/api/axiosClient";

import type { DashboardCardsResponseDto, DashboardBarrasResponseDto, DashboardPieResponseDto} from "../types/dashboard.types";

export const dashboardApi = {
    getCards: async (): Promise<DashboardCardsResponseDto> => {
        const response = await axiosClient.get<DashboardCardsResponseDto>("/Dashboard/cards");
        return response.data;
    },

    getBarras: async (): Promise<DashboardBarrasResponseDto[]> => {
        const response = await axiosClient.get<DashboardBarrasResponseDto[]>("/Dashboard/barras");
        return response.data
    },

    getPie: async (): Promise<DashboardPieResponseDto[]> => {
        const response = await axiosClient.get<DashboardPieResponseDto[]>("/Dashboard/pie");
        return response.data;
    },
};