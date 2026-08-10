import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useMemo, useState, useEffect } from "react";

export default function SubCountyDispatch({ dispatch, stats }) {

    const [search, setSearch] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const { data, setData, patch, processing } = useForm({

        receiver_name: "",

        receiver_phone: "",

        remarks: "",

    });

    const [selectedSchools, setSelectedSchools] = useState([]);

    const [activeSection, setActiveSection] = useState("all");

    useEffect(() => {

    const pending = dispatch.items
        .filter(item => item.status === "Pending")
        .map(item => item.id);

    setSelectedSchools(pending);

}, [dispatch.items]);

    const toggleSchool = (id) => {

    setSelectedSchools(current =>

        current.includes(id)

            ? current.filter(item => item !== id)

            : [...current, id]

    );

    };

    const toggleAllSchools = () => {

    if (selectedSchools.length === filteredItems.length) {

        setSelectedSchools([]);

    } else {

        setSelectedSchools(

            filteredItems

                .filter(item => item.status === "Pending")

                .map(item => item.id)

        );

    }

    };


    const confirmCompleteDeliveries = () => {

    if (selectedSchools.length === 0) {
        alert("Please select at least one school.");
        return;
    }

    router.post(
        route("dispatch-items.confirm-complete"),
        {
            selected_dispatch_items: selectedSchools,
        },
        {
            preserveScroll: true,

            onSuccess: () => {

            router.reload({

                only: ["dispatch", "stats"]

            });

        },
        }
    );
};

    const filteredItems = useMemo(() => {

        const term = search.toLowerCase();

        return dispatch.items.filter((item) => {

            return (
        item.school.school_name.toLowerCase().includes(term) ||
        item.school.uic?.toLowerCase().includes(term) ||
        item.school.subCounty?.name?.toLowerCase().includes(term)
    );

        });

    }, [dispatch.items, search]);

        const completedSchools = dispatch.items.filter(
            item => item.status === "Delivered"
        );

        const partialSchools = dispatch.items.filter(
            item => item.status === "Partial"
        );

        const pendingSchools = dispatch.items.filter(
            item => item.status === "Pending"
        );
        
    function openDeliveryModal(item) {

        setSelectedItem(item);

        setData({

            receiver_name: "",

            receiver_phone: "",

            remarks: "",

        });

        setShowModal(true);

    }

    function deliver() {

        patch(
            route(
                "dispatch-items.deliver",
                selectedItem.id
            ),
            {
                preserveScroll: true,

                onSuccess: () => {

                    setShowModal(false);

                },

            }
        );

    }

    function badge(status) {

        switch (status) {

            case "Delivered":
                return "bg-green-100 text-green-700";

            default:
                return "bg-yellow-100 text-yellow-700";

        }

    }

    const reopenSchool = (dispatchItem) => {

    if (
        !window.confirm(
            `Reopen delivery for ${dispatchItem.school.school_name}?\n\n` +
            "This will reset the delivery details and return the school to Pending."
        )
    ) {
        return;
    }

    router.patch(
        route("dispatch-items.reopen", dispatchItem.id),
        {},
        {
            preserveScroll: true,
        }
    );
};

    return (

        <AuthenticatedLayout>

            <Head title="Sub County Dispatch" />

            <div className="max-w-7xl mx-auto py-6">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h1 className="text-2xl font-bold">

                            {dispatch.dispatch_number}

                        </h1>

                        <p className="text-gray-900">

                            {dispatch.county.name}

                        </p>

                        <p className="text-gray-600">

                            {dispatch.subCounty.name}

                        </p>

                    </div>

                    <Link
                        href={route("dispatches.mine")}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Back
                    </Link>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

                {/* Total Schools */}
                <div onClick={() => setActiveSection("all")} className={`cursor-pointer rounded-lg shadow p-4 transition
                    ${
                        activeSection === "all"
                            ? "bg-green-600 text-white"
                            : "bg-white hover:bg-green-50"
                    }`}>

                    <div className="text-gray-500">
                        Total Schools
                    </div>

                    <div className="text-3xl font-bold">
                        {stats.total_schools}
                    </div>

                </div>

                {/* Delivered */}
                <div onClick={() => setActiveSection("delivered")} className={`cursor-pointer rounded-lg shadow p-4 transition
                    ${
                        activeSection === "delivered"
                            ? "bg-green-600 text-white"
                            : "bg-white hover:bg-green-50"
                    }`}>

                    <div className="text-gray-500">
                        Delivered
                    </div>

                    <div className="text-3xl font-bold text-white-600">
                        {stats.delivered_schools}
                    </div>

                </div>

                {/* Partial */}
                <div onClick={() => setActiveSection("partial")} className={`cursor-pointer rounded-lg shadow p-4 transition
                    ${
                        activeSection === "partial"
                        ? "bg-yellow-500 text-white"
                        : "bg-white hover:bg-yellow-50"
                    }`}>

                    <div className="text-gray-500">
                        Partial
                    </div>

                    <div className="text-3xl font-bold text-yellow-500">
                        {stats.partial_schools}
                    </div>

                </div>

                {/* Pending */}
                <div
                    onClick={() => setActiveSection("pending")}
                    className={`cursor-pointer rounded-lg shadow p-4 transition
                        ${
                            activeSection === "pending"
                                ? "bg-red-600 text-white"
                                : "bg-white hover:bg-red-50"
                        }`}
                >

                    <div>Pending</div>

                    <div className="text-3xl font-bold">

                        {stats.pending_schools}

                    </div>

                </div>

                {/* Progress */}
                <div className="bg-white shadow rounded p-4">

                    <div className="text-gray-500">
                        Progress
                    </div>

                    <div className="text-3xl font-bold text-blue-600">
                        {stats.school_progress}%
                    </div>

                </div>

                <div className="bg-white rounded-lg shadow p-6">

                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Book Progress
                    </h3>

                    <div className="flex justify-between text-sm mb-2">

                        <span>Allocated Books</span>

                        <span className="font-semibold">
                            {stats.allocated_books}
                        </span>

                    </div>

                    <div className="flex justify-between text-sm mb-2">

                        <span>Received Books</span>

                        <span className="font-semibold text-green-600">
                            {stats.received_books}
                        </span>

                    </div>

                    <div className="flex justify-between text-sm mb-2">

                        <span>Missing Books</span>

                        <span className="font-semibold text-red-600">
                            {stats.missing_books}
                        </span>

                    </div>

                    <div className="flex justify-between text-sm mb-4">

                        <span>Damaged Books</span>

                        <span className="font-semibold text-yellow-600">
                            {stats.damaged_books}
                        </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all"
                            style={{
                                width: `${stats.book_progress}%`,
                            }}
                        />

                    </div>

                    <p className="text-center mt-3 font-bold text-lg">

                        {stats.book_progress}%

                    </p>

                </div>

                </div>

                <div className="bg-white rounded shadow">

                    <div className="p-4 border-b">

                        <input
                            type="text"
                            placeholder="Search school..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded p-2"
                        />

                    </div>

                    {activeSection === "all" && (
                    <div className="flex justify-between items-center p-4">

                        <div>

                            Selected:

                            <strong>

                                {selectedSchools.length}

                            </strong>

                            schools

                        </div>

                        <button
                            onClick={confirmCompleteDeliveries}
                            disabled={selectedSchools.length === 0}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
                        >
                            ✓ Confirm Complete Deliveries
                        </button>

                    </div>
                    )}

                    {(activeSection === "all") && (
                    <table className="min-w-full">

                        <thead className="bg-gray-50">

                            <tr>
                                <th className="p-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredItems.length > 0 &&
                                            filteredItems.every(item => selectedSchools.includes(item.id))
                                        }
                                        onChange={toggleAllSchools}
                                    />
                                </th>

                                <th className="p-3 text-left">School</th>

                                <th className="p-3 text-left">UIC</th>

                                <th className="p-3 text-left">Status</th>

                                <th className="p-3 text-left">Delivered</th>

                                <th className="p-3 text-center">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredItems.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t"
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedSchools.includes(item.id)}
                                            onChange={() => toggleSchool(item.id)}
                                            disabled={item.status === "Delivered"}
                                        />
                                    </td>

                                    <td className="p-3">

                                        {item.school.school_name}

                                    </td>

                                    <td className="p-3">

                                        {item.school.uic}

                                    </td>

                                    <td className="p-3">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${badge(item.status)}`}
                                        >

                                            {item.status}

                                        </span>

                                        {(item.status === "Delivered" || item.status === "Partial") && (

                                            <button
                                                onClick={() => reopenSchool(item)}
                                                className="ml-2 inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-600 hover:text-white"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3.5 w-3.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4 4v6h6M20 20v-6h-6M20 9A8 8 0 0 0 6.34 5.34L4 8m16 8-2.34 2.66A8 8 0 0 1 4 15"
                                                    />
                                                </svg>

                                                Reopen
                                            </button>
                                        )}

                                    </td>

                                    <td className="p-3">

                                        {item.delivered_at ?? "-"}

                                    </td>

                                    <td className="p-3 text-center">

                                        {item.status === "Pending" ? (

                                            <Link
                                                href={route(
                                                    "dispatch-items.verify",
                                                    item.id
                                                )}
                                                className="bg-green-600 text-white px-3 py-2 rounded"
                                            >
                                                Receive Books
                                            </Link>

                                        ) : (

                                            <span className="text-green-600 font-semibold">

                                                ✓ Delivered 

                                            </span>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    )}
 
                    {(activeSection === "delivered") && (
                            <div className="mt-8">

            <h2 className="text-xl font-semibold text-green-700 mb-4">
                ✓ Completed Deliveries ({completedSchools.length})
            </h2>

            {completedSchools.length === 0 ? (

                <div className="rounded-lg border bg-green-50 p-6 text-center text-gray-600">
                    No completed deliveries yet.
                </div>

            ) : (

                <div className="overflow-x-auto rounded-lg border">

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-green-100">

                            <tr>

                                <th className="px-4 py-3 text-left">School</th>

                                <th className="px-4 py-3 text-left">UIC</th>

                                <th className="px-4 py-3 text-left">Sub County</th>

                                <th className="px-4 py-3 text-center">Delivered At</th>

                                <th className="px-4 py-3 text-center">Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {completedSchools.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-4 py-3">
                                        {item.school.school_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.school.uic}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.school.sub_county}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {item.delivered_at
                                            ? new Date(item.delivered_at).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-3 text-center">

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                            Delivered

                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

                            </div>
                    )}


                    {(activeSection === "partial") && (
                    <div className="mt-10">

                        <h2 className="text-xl font-semibold text-yellow-700 mb-4">

                            ⚠ Partial Deliveries ({partialSchools.length})

                        </h2>

                        {partialSchools.length === 0 ? (

                            <div className="rounded-lg border bg-green-50 p-6 text-center">

                                No schools with shortages.

                            </div>

                        ) : (

                            <div className="overflow-x-auto rounded-lg border">

                                <table className="min-w-full divide-y divide-gray-200">

                                    <thead className="bg-yellow-100">

                                        <tr>

                                            <th className="px-4 py-3 text-left">
                                                School
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                UIC
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Sub County
                                            </th>

                                            <th className="px-4 py-3 text-center">
                                                Status
                                            </th>

                                            <th className="px-4 py-3 text-center">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {partialSchools.map((item) => (

                                            <tr
                                                key={item.id}
                                                className="border-t hover:bg-yellow-50"
                                            >

                                                <td className="px-4 py-3">

                                                    {item.school.school_name}

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.school.uic}

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.school.sub_county}

                                                </td>

                                                <td className="px-4 py-3 text-center">

                                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">

                                                        Partial

                                                    </span>

                                                </td>

                                                <td className="px-4 py-3 text-center">

                                                    <Link
                                                        href={route(
                                                            "dispatches.subcounty.shortages",
                                                            [
                                                                dispatch.id,
                                                                dispatch.subCounty.id,
                                                            ]
                                                        )}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        View Shortages
                                                    </Link>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>
                    )}

                    {(activeSection === "pending") && (

                    <div className="mt-10">

                        <h2 className="text-xl font-semibold text-red-700 mb-4">
                            ⏳ Pending Deliveries ({pendingSchools.length})
                        </h2>

                        {pendingSchools.length === 0 ? (

                            <div className="rounded-lg border bg-green-50 p-6 text-center">

                                <p className="text-green-700 font-medium">
                                    There are no pending schools in this subcounty.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto rounded-lg border">

                                <table className="min-w-full divide-y divide-gray-200">

                                    <thead className="bg-red-50">

                                        <tr>

                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                School
                                            </th>

                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                UIC
                                            </th>

                                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                                Sub County
                                            </th>

                                            <th className="px-4 py-3 text-center text-sm font-semibold">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {pendingSchools.map((item) => (

                                            <tr
                                                key={item.id}
                                                className="border-t hover:bg-gray-50"
                                            >

                                                <td className="px-4 py-3">
                                                    {item.school.school_name}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {item.school.uic}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {item.school.subCounty?.name}
                                                </td>

                                                <td className="px-4 py-3 text-center">

                                                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                                        Pending
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                )}

                </div>

            </div>

            {showModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

                    <div className="bg-white rounded-lg w-full max-w-lg p-6">

                        <h2 className="text-xl font-bold mb-4">

                            Deliver School

                        </h2>

                        <input
                            type="text"
                            placeholder="Receiver Name"
                            value={data.receiver_name}
                            onChange={(e) =>
                                setData(
                                    "receiver_name",
                                    e.target.value
                                )
                            }
                            className="border rounded w-full p-2 mb-3"
                        />

                        <input
                            type="text"
                            placeholder="Receiver Phone"
                            value={data.receiver_phone}
                            onChange={(e) =>
                                setData(
                                    "receiver_phone",
                                    e.target.value
                                )
                            }
                            className="border rounded w-full p-2 mb-3"
                        />

                        <textarea
                            placeholder="Remarks"
                            value={data.remarks}
                            onChange={(e) =>
                                setData(
                                    "remarks",
                                    e.target.value
                                )
                            }
                            className="border rounded w-full p-2"
                        />

                        <div className="flex justify-end gap-3 mt-4">

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >

                                Cancel

                            </button>

                            <button
                                disabled={processing}
                                onClick={deliver}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >

                                Confirm Delivery

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AuthenticatedLayout>

    );

}