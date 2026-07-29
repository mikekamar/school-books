export default function StatCard({
    title,
    value,
    icon = null,
    color = "indigo",
}) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-green-50 text-green-600",
        yellow: "bg-yellow-50 text-yellow-600",
        blue: "bg-blue-50 text-blue-600",
        red: "bg-red-50 text-red-600",
        gray: "bg-gray-50 text-gray-600",
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </h2>
                </div>

                {icon && (
                    <div
                        className={`rounded-full p-3 ${colors[color]}`}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}