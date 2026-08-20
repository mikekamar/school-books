import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo } from "react";

export default function Create({
    auth,
    counties,
    fieldAgents,
    trucks,
    drivers,
}) {

    const { data, setData, post, processing, errors } = useForm({

        county_id: "",

        truck_id: "",

        driver_id: "",

        dispatch_date: new Date().toISOString().split("T")[0],

        remarks: "",

        assignments: [],

    });

    /**
     * Selected County
     */
    const selectedCounty = useMemo(() => {

        return counties.find(
            county => county.id == data.county_id
        );

    }, [counties, data.county_id]);


    /**
     * County Change
     */
    const handleCountyChange = (e) => {

        const countyId = Number(e.target.value);

        setData("county_id", countyId);

        const county = counties.find(c => c.id === countyId);

        if (!county) {

            setData("assignments", []);

            return;

        }

        setData(
            "assignments",

            county.sub_counties.map(subCounty => ({

                sub_county_id: subCounty.id,

                field_agent_id: "",

            }))
        );

    };


    /**
     * Assign Field Agent
     */
   const updateAssignment = (subCountyId, fieldAgentId) => {

    const assignments = [...data.assignments];

    const index = assignments.findIndex(
        item => item.sub_county_id === subCountyId
    );

    if (fieldAgentId === "") {

        if (index >= 0) {
            assignments.splice(index, 1);
        }

    } else {

        if (index >= 0) {

            assignments[index] = {
                ...assignments[index],
                field_agent_id: Number(fieldAgentId),
            };

        } else {

            assignments.push({
                sub_county_id: subCountyId,
                field_agent_id: Number(fieldAgentId),
            });

        }

    }

    setData("assignments", assignments);

    console.log(assignments);
};


    /**
     * Assignment Statistics
     */

    const totalAssignments = data.assignments.length;

    const assignedCount = data.assignments.filter(

        item => item.field_agent_id !== ""

    ).length;

    const unassignedCount = totalAssignments - assignedCount;


    /**
     * Submit Validation
     */

    const canSubmit =

        data.county_id &&

        data.driver_id &&

        data.dispatch_date &&

        totalAssignments > 0 &&

        assignedCount === totalAssignments &&

        !processing;


    /**
     * Submit
     */

    const submit = (e) => {

        e.preventDefault();
console.log(data);
        post(route("dispatches.store"));

    };


    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">

                            Create County Dispatch

                        </h2>

                        <p className="mt-1 text-sm text-gray-500">

                            Create a dispatch, assign a truck & driver,
                            then allocate each Sub County to a Field Agent.

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

                        <div className="grid grid-cols-1 gap-6">

                            {/* Dispatch Details */}

                            <div className="rounded-xl bg-white shadow">

                                <div className="border-b px-6 py-4">

                                    <h3 className="text-lg font-semibold">

                                        Dispatch Details

                                    </h3>

                                    <p className="text-sm text-gray-500">

                                        Select the county, truck, driver and dispatch date.

                                    </p>

                                </div>

                                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                                    {/* County */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium">

                                            County

                                        </label>

                                        <select
                                            value={data.county_id}
                                            onChange={handleCountyChange}
                                            className="w-full rounded-lg border-gray-300"
                                        >

                                            <option value="">

                                                Select County

                                            </option>

                                            {counties.map(county => (

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

                                    {/* Dispatch Date */}

                                    <div>

                                        <label className="mb-2 block text-sm font-medium">

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
                                            className="w-full rounded-lg border-gray-300"
                                        />

                                    </div>

                                    {/* Driver */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Truck *
                                        </label>

                                        <select
                                            value={data.truck_id}
                                            onChange={(e) =>
                                                setData('truck_id', e.target.value)
                                            }
                                            className="w-full border-gray-300 rounded-lg"
                                        >
                                            <option value="">
                                                Select Truck
                                            </option>

                                            {trucks.map((truck) => (
                                                <option
                                                    key={truck.id}
                                                    value={truck.id}
                                                >
                                                    {truck.registration_number}
                                                    {truck.make
                                                        ? ` - ${truck.make} ${truck.model ?? ''}`
                                                        : ''}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.truck_id && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.truck_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Driver *
                                        </label>

                                        <select
                                            value={data.driver_id}
                                            onChange={(e) =>
                                                setData('driver_id', e.target.value)
                                            }
                                            className="w-full border-gray-300 rounded-lg"
                                        >
                                            <option value="">
                                                Select Driver
                                            </option>

                                            {drivers.map((driver) => (
                                                <option
                                                    key={driver.id}
                                                    value={driver.id}
                                                >
                                                    {driver.name}
                                                    {driver.phone
                                                        ? ` - ${driver.phone}`
                                                        : ''}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.driver_id && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.driver_id}
                                            </p>
                                        )}
                                    </div>

                                    
                                    {/* Remarks */}

                                    <div className="md:col-span-2">

                                        <label className="mb-2 block text-sm font-medium">

                                            Remarks

                                        </label>

                                        <textarea
                                            rows={4}
                                            value={data.remarks}
                                            onChange={(e) =>
                                                setData(
                                                    "remarks",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="Optional remarks..."
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* PART 2 STARTS HERE */}

                            {/* Sub County Assignment */}

<div className="rounded-xl bg-white shadow">

    <div className="border-b px-6 py-4 flex items-center justify-between">

        <div>

            <h3 className="text-lg font-semibold text-gray-800">

                Sub County Assignment

            </h3>

            <p className="text-sm text-gray-500">

                Assign a Field Agent to each Sub County.

            </p>

        </div>

        {selectedCounty && (

            <div className="text-right">

                <div className="text-sm text-gray-500">

                    Assignment Progress

                </div>

                <div className="mt-1 flex gap-2">

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                        Assigned: {assignedCount}

                    </span>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                        Unassigned: {unassignedCount}

                    </span>

                </div>

            </div>

        )}

    </div>

    {!selectedCounty ? (

        <div className="p-10 text-center">

            <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >

                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4m-18 5l9 4 9-4"
                />

            </svg>

            <p className="mt-4 text-gray-500">

                Select a county to load its Sub Counties.

            </p>

        </div>

    ) : (

        <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-50">

                    <tr>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">

                            Sub County

                        </th>

                        <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">

                            Schools

                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">

                            Assigned Field Agent

                        </th>

                    </tr>

                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">

                    {selectedCounty.sub_counties.map((subCounty) => {

                        const assignment = data.assignments.find(

                            item => item.sub_county_id === subCounty.id

                        );

                        return (

                            <tr
                                key={subCounty.id}
                                className="hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">

                                    <div className="font-medium text-gray-900">

                                        {subCounty.name}

                                    </div>

                                </td>

                                <td className="px-6 py-4 text-center">

                                    <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">

                                        {subCounty.schools_count}

                                    </span>

                                </td>

                                <td className="px-6 py-4">

                                    <select
                                        value={
                                            assignment?.field_agent_id ?? ""
                                        }
                                        onChange={(e) =>
                                            updateAssignment(
                                                subCounty.id,
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >

                                        <option value="">

                                            Select Field Agent

                                        </option>

                                        {fieldAgents.map(agent => (

                                            <option
                                                key={agent.id}
                                                value={agent.id}
                                            >

                                                {agent.name}

                                            </option>

                                        ))}

                                    </select>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    )}

</div>

{/* Dispatch Summary */}

<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

    <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">

        <p className="text-sm text-blue-700">

            County

        </p>

        <p className="mt-2 text-2xl font-bold text-blue-900">

            {selectedCounty?.name ?? "-"}

        </p>

    </div>

    <div className="rounded-xl bg-green-50 border border-green-100 p-5">

        <p className="text-sm text-green-700">

            Sub Counties

        </p>

        <p className="mt-2 text-2xl font-bold text-green-900">

            {totalAssignments}

        </p>

    </div>

    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">

        <p className="text-sm text-emerald-700">

            Assigned

        </p>

        <p className="mt-2 text-2xl font-bold text-emerald-900">

            {assignedCount}

        </p>

    </div>

    <div className="rounded-xl bg-red-50 border border-red-100 p-5">

        <p className="text-sm text-red-700">

            Remaining

        </p>

        <p className="mt-2 text-2xl font-bold text-red-900">

            {unassignedCount}

        </p>

    </div>

</div>

{/* PART 3 STARTS HERE */}

{/* Validation */}

{selectedCounty && unassignedCount > 0 && (

    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">

        <div className="flex items-start gap-3">

            <svg
                className="mt-0.5 h-6 w-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                />
            </svg>

            <div>

                <h4 className="font-semibold text-amber-800">

                    Incomplete Assignment

                </h4>

                <p className="mt-1 text-sm text-amber-700">

                    Every Sub County must have a Field Agent assigned
                    before this dispatch can be created.

                </p>

            </div>

        </div>

    </div>

)}

{/* Footer */}

<div className="rounded-xl bg-white shadow">

    <div className="flex flex-col items-center justify-between gap-4 border-t p-6 md:flex-row">

        <div>

            <h3 className="font-semibold text-gray-800">

                Dispatch Summary

            </h3>

            <p className="mt-1 text-sm text-gray-500">

                {selectedCounty
                    ? `${assignedCount} of ${totalAssignments} Sub Counties assigned`
                    : "Select a county to begin."}

            </p>

        </div>

        <div className="flex gap-3">

            <Link
                href={route("dispatches.index")}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >

                Cancel

            </Link>

            <button
                type="submit"
                disabled={!canSubmit}
                className={`rounded-lg px-8 py-2 font-semibold text-white transition

                    ${
                        canSubmit
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "cursor-not-allowed bg-gray-400"
                    }

                `}
            >

                {processing
                    ? "Creating Dispatch..."
                    : "Create Dispatch"}

            </button>

        </div>

    </div>

</div>
</div>
                    </form>

                </div>

            </div>

        </AuthenticatedLayout>

    );

}