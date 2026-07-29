import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DeliverySummary({ stats }) {
    return (
        <AuthenticatedLayout>
            <div className="space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Delivery Summary
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Monitor the progress of book deliveries across all counties.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Schools"
                        value={stats.total}
                        color="blue"
                    />

                    <StatCard
                        title="Delivered"
                        value={stats.delivered}
                        color="green"
                    />

                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        color="yellow"
                    />

                    <StatCard
                        title="Progress"
                        value={`${stats.progress}%`}
                        color="purple"
                    />

                </div>

            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, color }) {

    const colors = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
    };

    return (
        <div className="rounded-xl bg-white shadow border p-6">

            <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${colors[color]}`}>
                {title}
            </div>

            <h2 className="mt-4 text-4xl font-bold text-gray-800">
                {value}
            </h2>

        </div>
    );
}