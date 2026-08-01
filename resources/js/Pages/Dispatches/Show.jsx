import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Show({
    auth,
    dispatch,
    stats,
}) {

    const [search, setSearch] = useState("");
    const [schoolSearch, setSchoolSearch] = useState("");
    const [selectedSubCounty, setSelectedSubCounty] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Filter Sub Counties
    |--------------------------------------------------------------------------
    */

    const subCountySummary = useMemo(() => {

    const grouped = {};

    dispatch.items.forEach((item) => {

        const id = item.school.sub_county_id;
        const name = item.school.sub_county;

        if (!grouped[id]) {

            grouped[id] = {
                id,
                name,
                total: 0,
                delivered: 0,
                partial: 0,
                pending: 0,
                progress: 0,
            };

        }

        grouped[id].total++;

        if (item.status === "Delivered") grouped[id].delivered++;

        if (item.status === "Partial") grouped[id].partial++;

        if (item.status === "Pending") grouped[id].pending++;

    });

    return Object.values(grouped).map((subCounty) => ({
        ...subCounty,
        progress:
            subCounty.total > 0
                ? Math.round(
                      (subCounty.delivered / subCounty.total) * 100
                  )
                : 0,
    }));

}, [dispatch.items]);

const filteredSubCounties = useMemo(() => {

    return subCountySummary.filter((subCounty) =>
        subCounty.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

}, [search, subCountySummary]);
    /*
    |--------------------------------------------------------------------------
    | Selected Sub County Schools
    |--------------------------------------------------------------------------
    */

    const schools = useMemo(() => {

        if (!selectedSubCounty) {
            return [];
        }

        return dispatch.items.filter((item) => {

            const matchesSubCounty =
                item.school.sub_county_id === selectedSubCounty;

            const matchesSearch =
                item.school.school_name
                    .toLowerCase()
                    .includes(schoolSearch.toLowerCase()) ||

                item.school.uic
                    .toString()
                    .includes(schoolSearch);

            return matchesSubCounty && matchesSearch;

        });

    }, [dispatch.items, selectedSubCounty, schoolSearch]);

    const selectedSubCountyName =
        subCountySummary.find(
            (s) => s.id === selectedSubCounty
        )?.name ?? "";

    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            Dispatch Monitoring
                        </h2>

                        <p className="text-sm text-gray-500">
                            {dispatch.dispatch_number}
                        </p>

                    </div>

                </div>
            }
        >

            <Head title={dispatch.dispatch_number} />

            <div className="py-8">

                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Dispatch Information */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <h3 className="text-lg font-semibold mb-5">
                            Dispatch Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Dispatch Number
                                </p>

                                <p className="font-semibold">
                                    {dispatch.dispatch_number}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    County
                                </p>

                                <p className="font-semibold">
                                    {dispatch.county.name}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Field Agent
                                </p>

                                <p className="font-semibold">
                                    {dispatch.field_agent.name}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Dispatch Date
                                </p>

                                <p className="font-semibold">
                                    {dispatch.dispatch_date}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                    {dispatch.status}
                                </span>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Created By
                                </p>

                                <p className="font-semibold">
                                    {dispatch.creator.name}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Statistics */}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

                        <StatCard
                            title="Schools"
                            value={stats.total}
                        />

                        <StatCard
                            title="Delivered"
                            value={stats.delivered}
                            color="green"
                        />

                        <StatCard
                            title="Partial"
                            value={stats.partial}
                            color="yellow"
                        />

                        <StatCard
                            title="Pending"
                            value={stats.pending}
                            color="red"
                        />

                        <StatCard
                            title="Sub Counties"
                            value={subCountySummary.length}
                        />

                        <StatCard
                            title="Progress"
                            value={`${stats.progress}%`}
                            color="blue"
                        />

                    </div>

                    {/* Progress */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="flex justify-between mb-3">

                            <span className="font-medium">
                                Overall Progress
                            </span>

                            <span className="font-semibold">
                                {stats.progress}%
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-4">

                            <div
                                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                                style={{
                                    width: `${stats.progress}%`,
                                }}
                            />

                        </div>

                    </div>

                                        {/* ===============================
                        SUB COUNTY SUMMARY
                    ================================ */}

                    {!selectedSubCounty && (

                        <div className="bg-white rounded-xl shadow">

                            <div className="p-6 border-b">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>

                                        <h3 className="text-lg font-semibold">
                                            Sub-County Progress
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Monitor dispatch progress by sub-county.
                                        </p>

                                    </div>

                                    <div className="w-full md:w-80">

                                        <input
                                            type="text"
                                            placeholder="Search sub-county..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="min-w-full divide-y divide-gray-200">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                                Sub County
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Schools
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Delivered
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Partial
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Pending
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Progress
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-gray-100 bg-white">

                                        {filteredSubCounties.length === 0 && (

                                            <tr>

                                                <td
                                                    colSpan={7}
                                                    className="px-6 py-8 text-center text-gray-500"
                                                >
                                                    No sub-counties found.
                                                </td>

                                            </tr>

                                        )}

                                        {filteredSubCounties.map((subCounty) => (

                                            <tr
                                                key={subCounty.id}
                                                className="hover:bg-gray-50 transition"
                                            >

                                                <td className="px-6 py-4 font-medium">
                                                    {subCounty.name}
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    {subCounty.total}
                                                </td>

                                                <td className="px-6 py-4 text-center text-green-600 font-semibold">
                                                    {subCounty.delivered}
                                                </td>

                                                <td className="px-6 py-4 text-center text-yellow-600 font-semibold">
                                                    {subCounty.partial}
                                                </td>

                                                <td className="px-6 py-4 text-center text-red-600 font-semibold">
                                                    {subCounty.pending}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">

                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${subCounty.progress}%`,
                                                                }}
                                                            />

                                                        </div>

                                                        <span className="w-12 text-sm font-semibold text-right">
                                                            {subCounty.progress}%
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-4 text-center">

                                                    <button
                                                        onClick={() =>
                                                            setSelectedSubCounty(
                                                                subCounty.id
                                                            )
                                                        }
                                                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                                                    >
                                                        View Schools
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                                        {/* =====================================
                        SCHOOLS UNDER SELECTED SUB COUNTY
                    ====================================== */}

                    {selectedSubCounty && (

                        <div className="bg-white rounded-xl shadow">

                            {/* Header */}

                            <div className="border-b p-6">

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                    <div>

                                        <button
                                            onClick={() => {
                                                setSelectedSubCounty(null);
                                                setSchoolSearch("");
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-3"
                                        >
                                            ← Back to Sub-County Summary
                                        </button>

                                        <h2 className="text-xl font-bold">
                                            {selectedSubCountyName}
                                        </h2>

                                        <p className="text-gray-500">
                                            Schools under this sub-county
                                        </p>

                                    </div>

                                    <div className="w-full lg:w-80">

                                        <input
                                            type="text"
                                            placeholder="Search school..."
                                            value={schoolSearch}
                                            onChange={(e) =>
                                                setSchoolSearch(e.target.value)
                                            }
                                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* Schools Table */}

                            <div className="overflow-x-auto">

                                <table className="min-w-full divide-y divide-gray-200">

                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                                School
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                                UIC
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                                Status
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                                Receiver
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                                Phone
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                                                Delivered At
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-gray-100 bg-white">

                                        {schools.length === 0 && (

                                            <tr>

                                                <td
                                                    colSpan={6}
                                                    className="py-10 text-center text-gray-500"
                                                >
                                                    No schools found.
                                                </td>

                                            </tr>

                                        )}

                                        {schools.map((item) => (

                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="font-medium">
                                                        {item.school.school_name}
                                                    </div>

                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.school.uic}
                                                </td>

                                                <td className="px-6 py-4 text-center">

                                                    {item.status === "Delivered" && (

                                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                                            Delivered
                                                        </span>

                                                    )}

                                                    {item.status === "Partial" && (

                                                        <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                                                            Partial
                                                        </span>

                                                    )}

                                                    {item.status === "Pending" && (

                                                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                                                            Pending
                                                        </span>

                                                    )}

                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.receiver_name ?? "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.receiver_phone ?? "-"}
                                                </td>

                                                <td className="px-6 py-4">

                                                    {item.delivered_at
                                                        ? new Date(item.delivered_at).toLocaleDateString()
                                                        : "-"}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}
                                    </div>
            </div>

        </AuthenticatedLayout>

    );
}

/*
|--------------------------------------------------------------------------
| Statistics Card Component
|--------------------------------------------------------------------------
*/

function StatCard({ title, value, color = "gray" }) {

    const colors = {
        gray: "text-gray-800",
        green: "text-green-600",
        yellow: "text-yellow-600",
        red: "text-red-600",
        blue: "text-blue-600",
    };

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <h2 className={`mt-2 text-3xl font-bold ${colors[color]}`}>
                {value}
            </h2>

        </div>

    );

}

/*
|--------------------------------------------------------------------------
| Status Badge Component
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {

    const styles = {
        Delivered: "bg-green-100 text-green-700",
        Partial: "bg-yellow-100 text-yellow-700",
        Pending: "bg-red-100 text-red-700",
    };

    return (

        <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                styles[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>

    );

}