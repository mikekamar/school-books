import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Schools({ county, subCounty, schools }) {

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredSchools = useMemo(() => {

    return schools.filter((school) => {

        const term = search.toLowerCase();

        const matchesSearch =
            school.school_name.toLowerCase().includes(term) ||
            school.uic?.toLowerCase().includes(term) ||
            school.status.toLowerCase().includes(term) ||
            (school.field_agent ?? "").toLowerCase().includes(term);

        const matchesStatus =
            statusFilter === "All"
                ? true
                : school.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

}, [schools, search, statusFilter]);

    const badge = (status) => {

    switch (status) {

        case "Delivered":
            return "bg-green-100 text-green-700";

        case "Pending":
            return "bg-yellow-100 text-yellow-700";

        case "Not Dispatched":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }

};

    return (
        <AuthenticatedLayout>

            <div className="space-y-6">

                {/* Header */}

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            Schools
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {county.name} / {subCounty.name}
                        </p>

                    </div>

                </div>

                {/* Statistics */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Schools
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {schools.length}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Delivered
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-green-600">
                            {schools.filter(s => s.status === "Delivered").length}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Pending
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                            {schools.filter(s => s.status === "Pending").length}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Not Dispatched
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-red-600">
                            {schools.filter(s => s.status === "Not Dispatched").length}
                        </h2>
                    </div>

                </div>

                {/* Search */}

                <div className="rounded-xl border bg-white p-4 shadow-sm">

                    <input
                        type="text"
                        placeholder="Search school, UIC, status or field agent..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">

    {[
        "All",
        "Delivered",
        "Pending",
        "Not Dispatched",
    ].map((status) => (

        <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition

            ${
                statusFilter === status
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-400"
            }`}
        >
            {status}

            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">

                {status === "All"
                    ? schools.length
                    : schools.filter(s => s.status === status).length}

            </span>

        </button>

    ))}

</div>

                </div>

                {/* Table */}

                <div className="overflow-hidden rounded-xl border bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    School
                                </th>

                                <th className="text-left">
                                    UIC
                                </th>

                                <th className="text-left">
                                    Dispatch
                                </th>

                                <th className="text-left">
                                    Field Agent
                                </th>

                                <th className="text-left">
                                    Status
                                </th>

                                <th className="text-left">
                                    Delivered
                                </th>

                                <th className="text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredSchools.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No schools found.
                                    </td>

                                </tr>

                            )}

                            {filteredSchools.map((school) => (

                                <tr
                                    key={school.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4 font-medium">
                                        {school.school_name}
                                    </td>

                                    <td>
                                        {school.uic}
                                    </td>

                                    <td>
                                        {school.dispatch_number ?? "-"}
                                    </td>

                                    <td>
                                        {school.field_agent ?? "-"}
                                    </td>

                                    <td>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(school.status)}`}
                                        >
                                            {school.status}
                                        </span>

                                    </td>

                                    <td>
                                        {school.delivered_at ?? "-"}
                                    </td>

                                    <td className="text-center">

                                    <Link
                                        href={route('reports.school', school.id)}
                                        className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        View Details
                                    </Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}