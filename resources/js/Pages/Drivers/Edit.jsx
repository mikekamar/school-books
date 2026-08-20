import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ driver }) {

    const { data, setData, put, processing, errors } = useForm({
        name: driver.name || '',
        phone: driver.phone || '',
        license_number: driver.license_number || '',
        license_expiry: driver.license_expiry
            ? driver.license_expiry.substring(0, 10)
            : '',
        status: driver.status || 'available',
        remarks: driver.remarks || '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('drivers.update', driver.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${driver.name}`} />

            <div className="p-6 max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Driver
                        </h1>

                        <p className="text-gray-500">
                            {driver.name}
                        </p>
                    </div>

                    <Link
                        href={route('drivers.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                    >
                        Back
                    </Link>

                </div>

                <form
                    onSubmit={submit}
                    className="bg-white shadow rounded-xl p-6"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Full Name *
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />

                            {errors.name && (
                                <p className="text-red-600 text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Driving License Number *
                            </label>

                            <input
                                type="text"
                                value={data.license_number}
                                onChange={(e) =>
                                    setData(
                                        'license_number',
                                        e.target.value.toUpperCase()
                                    )
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />

                            {errors.license_number && (
                                <p className="text-red-600 text-sm">
                                    {errors.license_number}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                License Expiry
                            </label>

                            <input
                                type="date"
                                value={data.license_expiry}
                                onChange={(e) =>
                                    setData(
                                        'license_expiry',
                                        e.target.value
                                    )
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Status
                            </label>

                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                            >
                                <option value="available">
                                    Available
                                </option>

                                <option value="assigned">
                                    Assigned
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium mb-1">
                                Remarks
                            </label>

                            <textarea
                                rows="4"
                                value={data.remarks}
                                onChange={(e) =>
                                    setData('remarks', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />

                        </div>

                    </div>

                    <div className="mt-6 flex justify-end">

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                        >
                            {processing
                                ? 'Updating...'
                                : 'Update Driver'}
                        </button>

                    </div>

                </form>

            </div>
        </AuthenticatedLayout>
    );
}