import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function SubCountyReconciliation({
    auth,
    dispatches = [],
    selectedDispatchId = "",
    subCounties = [],
    totals = { schools: 0, dispatched: 0, received: 0, variance: 0, percentage: 0 }
}) {

    // Handles dropdown selection change
    const handleDispatchChange = (e) => {
        const dispatchId = e.target.value;
        if (dispatchId) {
            router.get(
                route("reports.subcounty-reconciliation", { dispatch: dispatchId }),
                {},
                { preserveState: true }
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Sub County Reconciliation" />

            <div className="max-w-7xl mx-auto py-8 px-6">
                
                {/* Header & Dropdown Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Sub-County Reconciliation Report
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Select a dispatch batch below to view reconciliation totals.
                        </p>
                    </div>

                    <div className="w-full md:w-72">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                            Select Dispatch Batch
                        </label>
                        <select
                            value={selectedDispatchId || ""}
                            onChange={handleDispatchChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium"
                        >
                            {dispatches.length === 0 ? (
                                <option value="">No dispatches available</option>
                            ) : (
                                dispatches.map((dispatch) => (
                                    <option key={dispatch.id} value={dispatch.id}>
                                        {dispatch.dispatch_number || `Dispatch #${dispatch.id}`}
                                        {dispatch.county?.name ? ` (${dispatch.county.name})` : dispatch.county ? ` (${dispatch.county})` : ''}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-5">
                        <p className="text-gray-500 text-sm">Books Dispatched</p>
                        <h2 className="text-3xl font-bold text-blue-700 mt-2">
                            {totals.dispatched.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-5">
                        <p className="text-gray-500 text-sm">Books Received</p>
                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {totals.received.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-5">
                        <p className="text-gray-500 text-sm">Variance</p>
                        <h2 className={`text-3xl font-bold mt-2 ${
                            totals.variance === 0 ? "text-green-600" : "text-red-600"
                        }`}>
                            {totals.variance.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow p-5">
                        <p className="text-gray-500 text-sm">Receiving %</p>
                        <h2 className="text-3xl font-bold text-indigo-600 mt-2">
                            {totals.percentage}%
                        </h2>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Sub County
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Schools
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Dispatched
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Received
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    Variance
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    %
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {subCounties.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No reconciliation records found for this dispatch.
                                    </td>
                                </tr>
                            ) : (
                                subCounties.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-700">
                                            {row.schools}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-700">
                                            {row.dispatched.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-700">
                                            {row.received.toLocaleString()}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold ${
                                            row.variance === 0
                                                ? "text-green-600"
                                                : row.variance <= 20
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}>
                                            {row.variance.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            row.percentage === 100
                                                                ? "bg-green-600"
                                                                : row.percentage >= 95
                                                                ? "bg-blue-600"
                                                                : "bg-yellow-500"
                                                        }`}
                                                        style={{ width: `${row.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="font-semibold text-xs text-gray-700">
                                                    {row.percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {subCounties.length > 0 && (
                                <tr className="bg-gray-100 font-bold text-gray-900">
                                    <td className="px-6 py-4">TOTAL</td>
                                    <td className="px-6 py-4 text-center">{totals.schools}</td>
                                    <td className="px-6 py-4 text-right">{totals.dispatched.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">{totals.received.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">{totals.variance.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">{totals.percentage}%</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}