import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ drivers }) {

    const deleteDriver = (driver) => {

        if (
            confirm(
                `Are you sure you want to delete ${driver.name}?`
            )
        ) {
            router.delete(
                route('drivers.destroy', driver.id)
            );
        }
    };

    const statusClass = (status) => {

        switch (status) {

            case 'available':
                return 'bg-green-100 text-green-700';

            case 'assigned':
                return 'bg-blue-100 text-blue-700';

            case 'inactive':
                return 'bg-gray-100 text-gray-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const licenseClass = (expiry) => {

        if (!expiry) {
            return 'text-gray-500';
        }

        const today = new Date();
        const expiryDate = new Date(expiry);

        if (expiryDate < today) {
            return 'text-red-600 font-semibold';
        }

        return 'text-green-600';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Drivers" />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Drivers
                        </h1>

                        <p className="text-gray-500">
                            Manage drivers responsible for book transportation.
                        </p>
                    </div>

                    <Link
                        href={route('drivers.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Register Driver
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
                                        Name
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Phone
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        License
                                    </th>

                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        License Expiry
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

                                {drivers.length > 0 ? (

                                    drivers.map((driver, index) => (

                                        <tr
                                            key={driver.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 font-semibold">
                                                {driver.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {driver.phone || '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {driver.license_number}
                                            </td>

                                            <td
                                                className={`px-6 py-4 ${licenseClass(
                                                    driver.license_expiry
                                                )}`}
                                            >
                                                {driver.license_expiry
                                                    ? new Date(
                                                          driver.license_expiry
                                                      ).toLocaleDateString(
                                                          'en-GB'
                                                      )
                                                    : '-'}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(
                                                        driver.status
                                                    )}`}
                                                >
                                                    {driver.status}
                                                </span>

                                            </td>

                                            <td className="px-6 py-4">
                                                {driver.dispatches_count}
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <Link
                                                        href={route(
                                                            'drivers.show',
                                                            driver.id
                                                        )}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={route(
                                                            'drivers.edit',
                                                            driver.id
                                                        )}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            deleteDriver(
                                                                driver
                                                            )
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
                                            No drivers registered yet.
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