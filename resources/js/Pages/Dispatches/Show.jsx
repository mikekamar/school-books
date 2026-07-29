import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ auth, dispatch, stats, fieldAgents, subCounties }) {
    const [search, setSearch] = useState("");
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [selectedSubCounty, setSelectedSubCounty] = useState("");

    const handleSelectAll = (checked) => {
    if (checked) {
        setSelectedSchools(dispatch.items.map(item => item.id));
    } else {
        setSelectedSchools([]);
    }
    };

    const toggleSchool = (id) => {
        if (selectedSchools.includes(id)) {
            setSelectedSchools(selectedSchools.filter(x => x !== id));
        } else {
            setSelectedSchools([...selectedSchools, id]);
        }
    };

    const markSelectedDelivered = () => {
    if (selectedSchools.length === 0) {
        alert('Please select at least one school.');
        return;
    }


    if (!confirm(`Mark ${selectedSchools.length} schools as delivered?`)) {
        return;
    }

    router.post(route('dispatch-items.bulk-deliver'), {
        items: selectedSchools,
    }, {
        preserveScroll: true,
        onSuccess: () => {
            setSelectedSchools([]);
        },
    });
    };

   

    const filteredItems = dispatch.items.filter((item) => {

    const term = search.toLowerCase().trim();

    const school = item.school.school_name?.toLowerCase() || "";
    const subCounty = item.school.sub_county?.toLowerCase() || "";
    const uic = item.school.uic?.toString().toLowerCase() || "";

    // Search filter
    const matchesSearch =
        school.includes(term) ||
        subCounty.includes(term) ||
        uic.includes(term);

    // Sub County dropdown filter
    const matchesSubCounty =
        selectedSubCounty === "" ||
        item.school.sub_county_id == selectedSubCounty;

    return matchesSearch && matchesSubCounty;

});
    const badgeClass = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const [selectedItem, setSelectedItem] = useState(null);

    const { data, setData, patch, processing, reset } = useForm({
        receiver_name: '',
        receiver_phone: '',
        remarks: '',
    });

    const openDeliveryModal = (item) => {
        setSelectedItem(item);

        reset();

        setData({
            receiver_name: '',
            receiver_phone: '',
            remarks: '',
        });
    };

    const submitDelivery = (e) => {
    e.preventDefault();

    patch(route('dispatch-items.deliver', selectedItem.id), {
        preserveScroll: true,

        onSuccess: () => {
            setSelectedItem(null);
            reset();
        },
        });
    };
    
    const {
    data: assignData,
    setData: setAssignData,
    post,
    processing: assignProcessing,
    } = useForm({
        sub_county_id: '',
        field_agent_id: '',
    });

    const assignSubCounty = () => {

    if (!selectedSubCounty) {
        alert("Please select a sub county.");
        return;
    }

    if (!assignData.field_agent_id) {
        alert("Please select a field agent.");
        return;
    }

    setAssignData("sub_county_id", selectedSubCounty);

    post(route("dispatches.assignSubCounty", dispatch.id), {
        preserveScroll: true,
        onSuccess: () => {
            alert("Schools assigned successfully.");
        },
    });
};

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Dispatch Details
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {dispatch.dispatch_number}
                        </p>
                    </div>

                    <Link
                        href={route("dispatches.index")}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                    >
                        Back
                    </Link>
                </div>
            }
        >
            <Head title={dispatch.dispatch_number} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Dispatch Information */}

                    <div className="rounded-lg bg-white shadow p-6">

                        <h3 className="text-lg font-semibold mb-4">
                            Dispatch Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <span className="font-semibold">
                                    Dispatch Number:
                                </span>
                                <br />
                                {dispatch.dispatch_number}
                            </div>

                            <div>
                                <span className="font-semibold">
                                    County:
                                </span>
                                <br />
                                {dispatch.county.name}
                            </div>

                            <div>
                                <span className="font-semibold">
                                    Field Agent:
                                </span>
                                <br />
                                {dispatch.field_agent.name}
                            </div>

                            <div>
                                <span className="font-semibold">
                                    Dispatch Date:
                                </span>
                                <br />
                                {dispatch.dispatch_date}
                            </div>

                            <div>
                                <span className="font-semibold">
                                    Created By:
                                </span>
                                <br />
                                {dispatch.creator.name}
                            </div>

                            <div>
                                <span className="font-semibold">
                                    Status:
                                </span>
                                <br />
                                {dispatch.status}
                            </div>

                        </div>

                        {dispatch.remarks && (

                            <div className="mt-5">

                                <span className="font-semibold">
                                    Remarks
                                </span>

                                <p className="mt-2 text-gray-600">
                                    {dispatch.remarks}
                                </p>

                            </div>

                        )}

                    </div>

                    {/* Statistics */}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <div className="rounded-lg bg-white shadow p-5">

                            <p className="text-gray-500 text-sm">
                                Total Schools
                            </p>

                            <h2 className="text-3xl font-bold">
                                {stats.total}
                            </h2>

                        </div>

                        <div className="rounded-lg bg-white shadow p-5">

                            <p className="text-gray-500 text-sm">
                                Delivered
                            </p>

                            <h2 className="text-3xl font-bold text-green-600">
                                {stats.delivered}
                            </h2>

                        </div>

                        <div className="rounded-lg bg-white shadow p-5">

                            <p className="text-gray-500 text-sm">
                                Pending
                            </p>

                            <h2 className="text-3xl font-bold text-yellow-600">
                                {stats.pending}
                            </h2>

                        </div>

                        <div className="rounded-lg bg-white shadow p-5">

                            <p className="text-gray-500 text-sm">
                                Progress
                            </p>

                            <h2 className="text-3xl font-bold text-blue-600">
                                {stats.progress}%
                            </h2>

                        </div>

                    </div>

                    {/* Progress Bar */}

                    <div className="rounded-lg bg-white shadow p-6">

                        <div className="flex justify-between mb-2">

                            <span className="font-semibold">
                                Dispatch Progress
                            </span>

                            <span>{stats.progress}%</span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">

                            <div
                                className="bg-green-600 h-3 rounded-full"
                                style={{
                                    width: `${stats.progress}%`,
                                }}
                            />

                        </div>

                    </div>

                    {/* Search */}

<div className="rounded-lg bg-white shadow p-6">

<div className="overflow-x-auto">

    <div className="bg-white rounded-lg shadow p-6 mb-6">

        <h2 className="text-lg font-semibold mb-4">
            Assign Sub County
        </h2>

        <div className="grid grid-cols-3 gap-4">

            <div>
                <label className="block text-sm font-medium mb-2">
                    Sub County
                </label>

                <select
                    value={selectedSubCounty}
                    onChange={(e) => setSelectedSubCounty(e.target.value)}
                    className="w-full border rounded-lg p-2"
                >
                    <option value="">All Sub Counties</option>

                    {subCounties.map((subCounty) => (
                        <option
                            key={subCounty.id}
                            value={subCounty.id}
                        >
                            {subCounty.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Field Agent
                </label>

                <select
                    value={assignData.field_agent_id}
                    onChange={(e) =>
                        setAssignData('field_agent_id', e.target.value)
                    }
                    className="w-full border rounded-lg"
                >
                    <option value="">
                        Select Agent
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
            </div>

            <div className="flex items-end">

                <button
                    onClick={assignSubCounty}
                    disabled={assignProcessing}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Assign Sub-County
                </button>

            </div>

        </div>

    </div>
</div>

</div>

                </div>
            </div>

           
        </AuthenticatedLayout>
    );
}