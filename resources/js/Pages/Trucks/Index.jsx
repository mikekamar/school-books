import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ trucks }) {

    const deleteTruck = (truck) => {
        if (
            confirm(
                `Are you sure you want to delete truck ${truck.registration_number}?`
            )
        ) {
            router.delete(route('trucks.destroy', truck.id));
        }
    };

    const statusClass = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-700';

            case 'assigned':
                return 'bg-blue-100 text-blue-700';

            case 'maintenance':
                return 'bg-yellow-100 text-yellow-700';

            case 'inactive':
                return 'bg-gray-100 text-gray-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Trucks" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Trucks
                        </h1>

                        <p className="text-gray-500">
                            Manage trucks used for book distribution.
                        </p>
                    </div>

                    <Link
                        href={route('trucks.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Register Truck
                    </Link>
                </div>

                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        #
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Registration
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Make
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Model
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Capacity
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Dispatches
                                    </th>

                                    <th className="px-6 py-3 text-right text-sm font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {trucks.length > 0 ? (
                                    trucks.map((truck, index) => (
                                        <tr
                                            key={truck.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 font-semibold">
                                                {truck.registration_number}
                                            </td>

                                            <td className="px-6 py-4">
                                                {truck.make || '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {truck.model || '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {truck.capacity
                                                    ? truck.capacity.toLocaleString()
                                                    : '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                                                        truck.status
                                                    )}`}
                                                >
                                                    {truck.status.replace(
                                                        '_',
                                                        ' '
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {truck.dispatches_count}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'trucks.show',
                                                            truck.id
                                                        )}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={route(
                                                            'trucks.edit',
                                                            truck.id
                                                        )}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            deleteTruck(truck)
                                                        }
                                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No trucks registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}