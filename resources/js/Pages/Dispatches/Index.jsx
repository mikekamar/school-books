import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

import StatCard from "@/Components/UI/StatCard";
import StatusBadge from "@/Components/UI/StatusBadge";

export default function Index({ auth, dispatches, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Dispatch Management
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage county dispatches and monitor delivery progress.
                        </p>
                    </div>

                    <Link
                        href={route("dispatches.create")}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
                    >
                        + New Dispatch
                    </Link>
                </div>
            }
        >
            <Head title="Dispatches" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Statistics */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Total Dispatches"
                            value={stats.total}
                            color="indigo"
                        />

                        <StatCard
                            title="Pending"
                            value={stats.pending}
                            color="yellow"
                        />

                        <StatCard
                            title="In Progress"
                            value={stats.progress}
                            color="blue"
                        />

                        <StatCard
                            title="Completed"
                            value={stats.completed}
                            color="green"
                        />

                    </div>

                    {/* Dispatch Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow">

                        <div className="border-b border-gray-200 px-6 py-4">

                            <h3 className="text-lg font-semibold text-gray-800">
                                Dispatches
                            </h3>

                        </div>

                        <div className="overflow-x-auto">

    <table className="min-w-full divide-y divide-gray-200">

        <thead className="bg-gray-50">

            <tr>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Dispatch No.
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    County
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Truck
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Driver
                </th>

                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Delivered
                </th>

                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Dispatch Date
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                </th>

            </tr>

        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">

            {dispatches.data.length === 0 ? (

                <tr>

                    <td
                        colSpan="9"
                        className="px-6 py-12 text-center text-gray-500"
                    >
                        No dispatches found.
                    </td>

                </tr>

            ) : (

                dispatches.data.map((dispatch) => (

                    <tr
                        key={dispatch.id}
                        className="hover:bg-gray-50"
                    >

                        {/* Dispatch Number */}
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-indigo-600">

                            {dispatch.dispatch_number}

                        </td>


                        {/* County */}
                        <td className="whitespace-nowrap px-6 py-4">

                            {dispatch.county}

                        </td>


                        {/* Truck */}
                        <td className="whitespace-nowrap px-6 py-4">

                            <div className="font-medium text-gray-800">
                                {dispatch.truck ?? '-'}
                            </div>

                        </td>


                        {/* Driver */}
                        <td className="whitespace-nowrap px-6 py-4">

                            <div className="font-medium text-gray-800">
                                {dispatch.driver ?? '-'}
                            </div>

                        </td>
                        

                        {/* Delivery Progress */}
                        <td className="whitespace-nowrap px-6 py-4 text-center">

                            <span className="font-semibold text-gray-700">
                                {dispatch.delivered}
                            </span>

                            <span className="text-gray-400">
                                {' / '}
                            </span>

                            <span className="text-gray-600">
                                {dispatch.schools}
                            </span>

                        </td>


                        {/* Status */}
                        <td className="whitespace-nowrap px-6 py-4 text-center">

                            <StatusBadge
                                status={dispatch.status}
                            />

                        </td>


                        {/* Dispatch Date */}
                        <td className="whitespace-nowrap px-6 py-4">

                            {dispatch.dispatch_date}

                        </td>


                        {/* Actions */}
                        <td className="whitespace-nowrap px-6 py-4">

                            <div className="flex justify-end gap-2">

                                <Link
                                    href={route(
                                        "dispatches.show",
                                        dispatch.id
                                    )}
                                    className="rounded bg-indigo-100 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-200"
                                >
                                    View
                                </Link>


                                {dispatch.status === "Pending" && (

                                    <Link
                                        href={route(
                                            "dispatches.edit",
                                            dispatch.id
                                        )}
                                        className="rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-700 hover:bg-yellow-200"
                                    >
                                        Edit
                                    </Link>

                                )}

                            </div>

                        </td>

                    </tr>

                ))

            )}

        </tbody>

    </table>

</div>

                        {/* Pagination Placeholder */}

                        <div className="border-t border-gray-200 px-6 py-4">

                            <div className="text-sm text-gray-500">

                                Showing{" "}
                                <span className="font-medium">
                                    {dispatches.from ?? 0}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                    {dispatches.to ?? 0}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {dispatches.total}
                                </span>{" "}
                                dispatches

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}