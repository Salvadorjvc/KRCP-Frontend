interface MetricCardProps {
    label: string;
    value: string | number;
}

function MetricCard({ label, value }: MetricCardProps){
    return(
        <div className="bg-color4 p-5 rounded-xl shadow-sm border border-color3 flex flex-col justify-between">
            <span className="text-xs font-medium text-color3 uppercase tracking-wider">
                {label}
            </span>
            <h3 className="text-3xl font-bold text-color1 mt-2">
                {value}
            </h3>
        </div>
    );
}

export default MetricCard;