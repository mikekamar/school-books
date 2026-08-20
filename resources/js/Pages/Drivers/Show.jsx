import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Show({ driver }) {

    return (
        <AuthenticatedLayout>
            <Head title={driver.name} />

            <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-2xl font-bold">
                            {driver.name}
                        </h1>

                        <p className="text-gray-500">
                            Driver Details
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Link
                            href={route('drivers.edit', driver.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Edit
                        </Link>

                        <Link
                            href={route('drivers.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                        >
                            Back
                        </Link>

                    </div>

                </div>

                <div className="bg-white shadow rounded-xl p-6 mb-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">
                                Name
                            </p>

                            <p className="font-semibold text-lg">
                                {driver.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Phone
                            </p>

                            <p className="font-semibold">
                                {driver.phone || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                License Number
                            </p>

                            <p className="font-semibold">
                                {driver.license_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                License Expiry
                            </p>

                            <p className="font-semibold">
                                {driver.license_expiry
                                    ? new Date(
                                          driver.license_expiry
                                      ).toLocaleDateString('en-GB')
                                    : '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Status
                            </p>

                            <p className="font-semibold capitalize">
                                {driver.status}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Dispatches
                            </p>

                            <p className="font-semibold">
                                {driver.dispatches?.length || 0}
                            </p>
                        </div>

                    </div>

                    {driver.remarks && (
                        <div className="mt-6">

                            <p className="text-sm text-gray-500">
                                Remarks
                            </p>

                            <p className="mt-1">
                                {driver.remarks}
                            </p>

                        </div>
                    )}

                </div>

                <div className="bg-white shadow rounded-xl overflow-hidden">

                    <div className="px-6 py-4 border-b">
                        <h2 className="font-bold text-lg">
                            Dispatch History
                        </h2>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="px-6 py-3 text-left">
                                        Dispatch
                                    </th>

                                    <th className="px-6 py-3 text-left">
                                        County
                                    </th>

                                    <th className="px-6 py-3 text-left">
                                        Truck
                                    </th>

                                    <th className="px-6 py-3 text-left">
                                        Date
                                    </th>

                                    <th className="px-6 py-3 text-left">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {driver.dispatches?.length > 0 ? (

                                    driver.dispatches.map((dispatch) => (

                                        <tr key={dispatch.id}>

                                            <td className="px-6 py-4 font-semibold">
                                                {dispatch.dispatch_number}
                                            </td>

                                            <td className="px-6 py-4">
                                                {dispatch.county?.name || '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {dispatch.truck?.registration_number || '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {dispatch.dispatch_date || '-'}
                                            </td>

                                            <td className="px-6 py-4 capitalize">
                                                {dispatch.status}
                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No dispatch history.
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