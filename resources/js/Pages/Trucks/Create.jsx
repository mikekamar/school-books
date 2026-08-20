import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        make: '',
        model: '',
        capacity: '',
        status: 'available',
        remarks: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('trucks.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Register Truck" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Register Truck
                        </h1>

                        <p className="text-gray-500">
                            Add a new truck to the system.
                        </p>
                    </div>

                    <Link
                        href={route('trucks.index')}
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

                        {/* Registration Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Registration Number *
                            </label>

                            <input
                                type="text"
                                value={data.registration_number}
                                onChange={(e) =>
                                    setData(
                                        'registration_number',
                                        e.target.value.toUpperCase()
                                    )
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="e.g. KDA 123A"
                            />

                            {errors.registration_number && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.registration_number}
                                </p>
                            )}
                        </div>

                        {/* Make */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Make
                            </label>

                            <input
                                type="text"
                                value={data.make}
                                onChange={(e) =>
                                    setData('make', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="e.g. Isuzu"
                            />

                            {errors.make && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.make}
                                </p>
                            )}
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Model
                            </label>

                            <input
                                type="text"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="e.g. NPR"
                            />

                            {errors.model && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.model}
                                </p>
                            )}
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacity
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={data.capacity}
                                onChange={(e) =>
                                    setData('capacity', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                                placeholder="e.g. 5000"
                            />

                            <p className="text-xs text-gray-500 mt-1">
                                Enter the approximate number of books the
                                truck can carry.
                            </p>

                            {errors.capacity && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.capacity}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
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

                                <option value="maintenance">
                                    Maintenance
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                            {errors.status && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Remarks */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>

                            <textarea
                                value={data.remarks}
                                onChange={(e) =>
                                    setData('remarks', e.target.value)
                                }
                                rows="4"
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
                                : 'Register Truck'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}