import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ truck }) {

    const { data, setData, put, processing, errors } = useForm({
        registration_number: truck.registration_number || '',
        make: truck.make || '',
        model: truck.model || '',
        capacity: truck.capacity || '',
        status: truck.status || 'available',
        remarks: truck.remarks || '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('trucks.update', truck.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${truck.registration_number}`} />

            <div className="p-6 max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Truck
                        </h1>

                        <p className="text-gray-500">
                            {truck.registration_number}
                        </p>
                    </div>

                    <Link
                        href={route('trucks.index')}
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
                            />

                            {errors.registration_number && (
                                <p className="text-red-600 text-sm">
                                    {errors.registration_number}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Make
                            </label>

                            <input
                                type="text"
                                value={data.make}
                                onChange={(e) =>
                                    setData('make', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Model
                            </label>

                            <input
                                type="text"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                className="w-full border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
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

                                <option value="maintenance">
                                    Maintenance
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
                                : 'Update Truck'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}