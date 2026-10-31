import { useState, useEffect} from "react";
import {dashboardApi} from "./api/dashboardApi";
import type {
    DashboardCardsResponseDto,
    DashboardBarrasResponseDto,
    DashboardPieResponseDto
} from "./types/dashboard.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import MetricCard from "./components/MetricCard";
import OtsPorEstadoChart from "./components/OtsPorEstadoChart";
import RepuestosPieChart from "./components/RepuestosPieChart";

function DashboardPage() {

    const [cards, setCards] = useState<DashboardCardsResponseDto | null>(null);
    const [barras, setBarras] = useState<DashboardBarrasResponseDto[]>([]);
    const [pie, setPie] = useState<DashboardPieResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function cargarDashboard() {
            setIsLoading(true);
            setError(null);

            try {
                const [cardsData, barrasData, pieData] = await Promise.all([
                    dashboardApi.getCards(),
                    dashboardApi.getBarras(),
                    dashboardApi.getPie(),
                ]);

                setCards(cardsData);
                setBarras(barrasData);
                setPie(pieData);
            }
            catch (err){
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        }

        cargarDashboard();
    }, []);
    
    if (isLoading) {
        return <p className="text-color1">Cargando dashboard...</p> /*tengo que crear una animacion cargando */
    }

    if (error) {
        return <p className="text-red-600">{error}</p>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-color1">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard 
                 label="OTs Activas"
                 value= {cards?.totalOtsActivas ?? 0}
                />
                <MetricCard
                 label="Productos con Stock Bajo"
                 value= {cards?.totalProductosStockBajo ?? 0}
                />
                <MetricCard
                 label="Valor Total de Inventario"
                 value= {`S/ ${cards?.valorTotalInventario?.toFixed(2) ?? "0.00"}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OtsPorEstadoChart data={barras} />
                <RepuestosPieChart data={pie} />
            </div>
        </div>
    );
}

export default DashboardPage;