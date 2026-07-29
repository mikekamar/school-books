import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo } from "react";

export default function Create({ auth, counties, fieldAgents }) {
    const { data, setData, post, processing, errors } = useForm({
        county_id: "",
        field_agent_id: "",
        dispatch_date: new Date().toISOString().split("T")[0],
        remarks: "",
    });

    const selectedCounty = useMemo(() => {
        return counties.find(
            (county) => county.id == data.county_id
        );
    }, [data.county_id, counties]);

    const submit = (e) => {
        e.preventDefault();

        post(route("dispatches.store"));
    };

    const canSubmit =
        data.county_id &&
        data.field_agent_id &&
        data.dispatch_date &&
        !processing;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Create Dispatch
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Create a new county dispatch and assign it to a field
                            agent.
                        </p>
                    </div>

                    <Link
                        href={route("dispatches.index")}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        ← Back
                    </Link>
                </div>
            }
        >
            <Head title="Create Dispatch" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <form onSubmit={submit}>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                            {/* Form */}

                            <div className="lg:col-span-2">

                                <div className="rounded-xl bg-white p-6 shadow">

                                    <h3 className="mb-6 text-lg font-semibold text-gray-800">
                                        Dispatch Information
                                    </h3>

                                    {/* Dispatch Date */}

                                    <div className="mb-5">

                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Dispatch Date
                                        </label>

                                        <input
                                            type="date"
                                            value={data.dispatch_date}
                                            onChange={(e) =>
                                                setData(
                                                    "dispatch_date",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />

                                        {errors.dispatch_date && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.dispatch_date}
                                            </p>
                                        )}

                                    </div>

                                    {/* County */}

                                    <div className="mb-5">

                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            County
                                        </label>

                                        <select
                                            value={data.county_id}
                                            onChange={(e) =>
                                                setData(
                                                    "county_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Select County
                                            </option>

                                            {counties.map((county) => (
                                                <option
                                                    key={county.id}
                                                    value={county.id}
                                                >
                                                    {county.name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.county_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.county_id}
                                            </p>
                                        )}

                                    </div>

                                    {/* Field Agent */}

                                    <div className="mb-5">

                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Field Agent
                                        </label>

                                        <select
                                            value={data.field_agent_id}
                                            onChange={(e) =>
                                                setData(
                                                    "field_agent_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Select Field Agent
                                            </option>

                                            {fieldAgents.map((agent) => (
                                                <option
                                                    key={agent.id}
                                                    value={agent.id}
                                                >
                                                    {agent.name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.field_agent_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.field_agent_id}
                                            </p>
                                        )}

                                    </div>

                                    {/* Remarks */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Remarks
                                        </label>

                                        <textarea
                                            rows="5"
                                            value={data.remarks}
                                            onChange={(e) =>
                                                setData(
                                                    "remarks",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Optional remarks..."
                                        />

                                        {errors.remarks && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.remarks}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* Summary */}

                            <div>

                                <div className="rounded-xl bg-white p-6 shadow">

                                    <h3 className="mb-6 text-lg font-semibold text-gray-800">
                                        County Summary
                                    </h3>

                                    {!selectedCounty ? (

                                        <div className="text-sm text-gray-500">

                                            Select a county to view its details.

                                        </div>

                                    ) : (

                                        <div className="space-y-4">

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    County
                                                </p>

                                                <p className="font-semibold">
                                                    {selectedCounty.name}
                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Schools
                                                </p>

                                                <p className="font-semibold">
                                                    {selectedCounty.schools_count}
                                                </p>

                                            </div>

                                            {selectedCounty.sub_counties_count !== undefined && (

                                                <div>

                                                    <p className="text-sm text-gray-500">
                                                        Sub Counties
                                                    </p>

                                                    <p className="font-semibold">
                                                        {selectedCounty.sub_counties_count}
                                                    </p>

                                                </div>

                                            )}

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Status
                                                </p>

                                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                                    Ready for Dispatch
                                                </span>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="mt-6 flex justify-end gap-3">

                            <Link
                                href={route("dispatches.index")}
                                className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                            >
                                {processing
                                    ? "Creating Dispatch..."
                                    : "Create Dispatch"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}