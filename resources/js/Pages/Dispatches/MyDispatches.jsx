import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function MyDispatches({ dispatches }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Dispatches" />

            <div className="max-w-7xl mx-auto py-8 px-6">

                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    My Dispatches
                </h1>

                {dispatches.length === 0 ? (

                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        You have no assigned dispatches.
                    </div>

                ) : (

                    <div className="space-y-6">

                        {dispatches.map((dispatch) => (

                            <div
                                key={dispatch.id}
                                className="bg-white rounded-lg shadow border"
                            >

                                {/* Dispatch Header */}

                                <div className="border-b p-5">

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <h2 className="text-lg font-semibold">

                                                {dispatch.dispatch_number}

                                            </h2>

                                            <p className="text-gray-600">

                                                County: {dispatch.county}

                                            </p>

                                            <p className="text-gray-500 text-sm">

                                                Dispatch Date: {dispatch.dispatch_date}

                                            </p>

                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${
                                                dispatch.status === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : dispatch.status === "In Transit"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {dispatch.status}
                                        </span>

                                    </div>

                                </div>

                                {/* Assigned Areas */}

                                <div className="p-5">

                                    <h3 className="font-semibold text-gray-700 mb-4">
                                        Assigned Areas
                                    </h3>

                                    {dispatch.assigned_subcounties.length === 0 ? (

                                        <div className="text-gray-500">
                                            No assigned sub counties.
                                        </div>

                                    ) : (

                                        <div className="space-y-3">

                                            {dispatch.assigned_subcounties.map((subCounty) => (

                                                <div
                                                    key={subCounty.id}
                                                    className="flex items-center justify-between border rounded-lg p-4 bg-gray-50"
                                                >

                                                    <div>

                                                        <h4 className="font-semibold">

                                                            {subCounty.name}

                                                        </h4>

                                                        <p className="text-sm text-gray-500">

                                                            {subCounty.schools} Schools

                                                        </p>

                                                        {subCounty.assigned_to && (

                                                            <p className="text-xs text-blue-600 mt-1">

                                                                Assigned to: {subCounty.assigned_to}

                                                            </p>

                                                        )}

                                                    </div>

                                                    <Link
                                                        href={route(
                                                            "dispatches.subcounty",
                                                            [
                                                                dispatch.id,
                                                                subCounty.id,
                                                            ]
                                                        )}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Open
                                                    </Link>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </AuthenticatedLayout>
    );
}