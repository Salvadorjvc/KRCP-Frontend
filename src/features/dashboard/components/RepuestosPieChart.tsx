import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  type PieLabelRenderProps

} from 'recharts';

import type { DashboardPieResponseDto } from "@/features/dashboard/types/dashboard.types"

interface RepuestosPieChartProps {
    data: DashboardPieResponseDto[];
}

const COLORS = ["#27374D", "#526D82", "#9DB2BF", "#DDE6ED", "#7A8B99"];

function RepuestosPieChart({data}: RepuestosPieChartProps) {
    if (!data || data.length === 0) {
    return (
      <div className="bg-color4 p-5 rounded-xl shadow-sm border border-color3">
      <h3 className="text-sm font-semibold text-color1 mb-4">
        Repuestos más Consumidos (mes actual)
      </h3>

      <div className="w-full h-72 flex items-center justify-center text-color1 text-sm">
        Sin datos registrados este mes
      </div>
    </div>
    );
  }

  const chartData = data.map((item, index) => ({...item,
    fill: COLORS[index % COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.cantidadTotalConsumida, 0);

    return(
        <div className="bg-color4 p-5 rounded-xl shadow-sm border border-color3">
            <h3 className="text-sm font-semibold text-color1 mb-4">
                Repuestos más Consumidos (mes actual)
            </h3>
            <div className= "w-full h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                         data={chartData}
                         dataKey="cantidadTotalConsumida"
                         nameKey="nombreProducto"
                         cx="50%"
                         cy="50%"
                         outerRadius={80}
                         innerRadius={45}
                         paddingAngle={3}
                         label={
                            ({ percent }: PieLabelRenderProps) => `${((percent ?? 0) * 100).toFixed(0)}%`
                         } 
                        />
                        
                        <Tooltip                        
                          contentStyle={{
                           backgroundColor: "var(--color-color1)",
                           color: "var(--color-color4)",
                           borderRadius: "8px",
                           border: "none",
                           fontSize: "12px",
                          }}
                          labelStyle={{
                           color: "var(--color-color4)",
                           fontWeight: "bold",
                         }}
                         itemStyle={{
                           color: "var(--color-color4)",
                         }}
                            formatter={(value) => {
                              const porcentaje = total > 0 ? ((Number(value) / total) * 100).toFixed(1) 
                                : "0";

                                return [`${value} unidades (${porcentaje}%)`, "Consumo"];
                            }}
                           
                        />

                        <Legend
                         formatter={(value) => (
                        <span className="text-xs text-color1">{value}</span>
                        )}
                        /> 

                    </PieChart>
                </ResponsiveContainer>
            </div>  
        </div>

    );
}

export default RepuestosPieChart;