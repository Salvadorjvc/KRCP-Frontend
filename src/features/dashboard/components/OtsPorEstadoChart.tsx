import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardBarrasResponseDto} from "@/features/dashboard/types/dashboard.types"

interface OtsPorEstadoChartProps {
    data: DashboardBarrasResponseDto[];
}

function OtsPorEstadoChart({data} : OtsPorEstadoChartProps){
    if (!data || data.length === 0) {
        return (
            <div className="bg-color4 p-5 rounded-xl shadow-sm border border-color3">
              <h3 className="text-sm font-semibold text-color1 mb-4">
                 Órdenes de Trabajo por Estado
              </h3>
              <div className="w-full h-72 flex items-center justify-center text-color1 text-sm">
                  No hay datos registrados para mostrar
             </div>
           </div>

        );
    }

    return (
        <div className="bg-color4 p-5 rounded-xl shadow-sm border border-color3">
            <h3 className="text-sm font-semibold text-color1 mb-4">
                Órdenes de Trabajo por Estado
            </h3>

            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                    data={data}  
                    margin={{top: 10, right: 10,  left: -20,bottom: 0,}}
                    >

                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    
                    <XAxis
                     dataKey="estado" 
                     interval={0}
                     tick={{ fontSize: 12, fill: "var(--color-color1)"}}
                    />
                    <YAxis allowDecimals={false} />

                    <Tooltip 
                      contentStyle= {{
                        backgroundColor: "var(--color-color1)",
                        borderRadius: '4px',
                        border: "none",
                        color: "var(--color-color4)",
                        fontSize: '12px',
                      }}
                      cursor ={{ fill: "rgba(0, 0, 0, 0.04)"}}
                    />

                    <Legend
                      formatter= {(value) => (
                        <span className="text-xs text-color1">
                            {value}
                        </span>
                      )} 
                    />
                    <Bar
                        dataKey="cantidad"
                        fill = "var(--color-color2)"
                        radius={[10, 10, 0, 0]}
                        maxBarSize={50}
                    />

                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>

        
    );
}


export default OtsPorEstadoChart;