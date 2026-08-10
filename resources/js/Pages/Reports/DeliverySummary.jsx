import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";


export default function DeliverySummary({ stats }) {
    return (
        <AuthenticatedLayout>
            <Head title="Delivery Summary" />
            <div className="space-y-10">

    {/* School Summary */}

    <div>

        <div className="mb-4">

            <h2 className="text-xl font-semibold text-gray-800">
                School Delivery Progress
            </h2>

            <p className="text-sm text-gray-500">
                Progress based on schools that have completed delivery.
            </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

            <StatCard
                title="Total Schools"
                value={stats.total_schools}
                color="blue"
            />

            <StatCard
                title="Delivered"
                value={stats.delivered_schools}
                color="green"
            />

            <StatCard
                title="Partial"
                value={stats.partial_schools}
                color="orange"
            />

            <StatCard
                title="Pending"
                value={stats.pending_schools}
                color="yellow"
            />

            <StatCard
                title="School Progress"
                value={`${stats.school_progress}%`}
                color="purple"
            />

        </div>

    </div>


    {/* Book Summary */}

    <div>

        <div className="mb-4">

            <h2 className="text-xl font-semibold text-gray-800">
                Book Delivery Progress
            </h2>

            <p className="text-sm text-gray-500">
                Progress based on books received versus allocated.
            </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

            <StatCard
                title="Allocated Books"
                value={stats.allocated_books.toLocaleString()}
                color="indigo"
            />

            <StatCard
                title="Received Books"
                value={stats.received_books.toLocaleString()}
                color="green"
            />

            <StatCard
                title="Missing Books"
                value={stats.missing_books.toLocaleString()}
                color="red"
            />

            <StatCard
                title="Damaged Books"
                value={stats.damaged_books.toLocaleString()}
                color="yellow"
            />

            <StatCard
                title="Book Progress"
                value={`${stats.book_progress}%`}
                color="blue"
            />

        </div>

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
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
    orange: "bg-orange-100 text-orange-700",
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