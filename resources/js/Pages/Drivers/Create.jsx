import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        license_number: '',
        license_expiry: '',
        status: 'available',
        remarks: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('drivers.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Register Driver" />

            <div className="p-6 max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Register Driver
                        </h1>

                        <p className="text-gray-500">
                            Add a new driver to the system.
                        </p>
                    </div>

                    <Link
                        href={route('drivers.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Back
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white shadow rounded-xl p-6"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="Driver's full name"
                            />

                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="e.g. 0712345678"
                            />

                            {errors.phone && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                placeholder="License number"
                            />

                            {errors.license_number && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.license_number}
                                </p>
                            )}
                        </div>

                        {/* License Expiry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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

                            {errors.license_expiry && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.license_expiry}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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

                        {/* Remarks */}
                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>

                            <textarea
                                rows="4"
                                value={data.remarks}
                                onChange={(e) =>
                                    setData('remarks', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="Optional remarks..."
                            />

                            {errors.remarks && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.remarks}
                                </p>
                            )}

                        </div>

                    </div>

                    <div className="mt-6 flex justify-end">

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing
                                ? 'Registering...'
                                : 'Register Driver'}
                        </button>

                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}