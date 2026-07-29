import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function SubCountyShortages({
    auth,
    dispatch,
    subCounty,
    stats,
    schools,
}) {

    const [expanded, setExpanded] = useState(null);

    const toggleSchool = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >

            <Head title="SubCounty Shortages" />

            <div className="max-w-7xl mx-auto p-6">

                {/* Header */}

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h1 className="text-3xl font-bold">

                            {subCounty.name} Shortages

                        </h1>

                        <p className="text-gray-500">

                            Dispatch #{dispatch.dispatch_number}

                        </p>

                    </div>

                    <Link
                        href={route(
                            'dispatches.subcounty',
                            [
                                dispatch.id,
                                subCounty.id,
                            ]
                        )}
                        className="bg-gray-700 text-white px-5 py-2 rounded-lg"
                    >
                        ← Back
                    </Link>

                </div>

                {/* Summary Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <div className="bg-white rounded-lg shadow p-6">

                        <div className="text-gray-500">

                            Schools With Shortages

                        </div>

                        <div className="text-4xl font-bold text-red-600">

                            {stats.schools_with_shortages}

                        </div>

                    </div>

                    <div className="bg-white rounded-lg shadow p-6">

                        <div className="text-gray-500">

                            Total Missing Books

                        </div>

                        <div className="text-4xl font-bold text-yellow-600">

                            {stats.missing_books}

                        </div>

                    </div>

                </div>

                {/* Schools */}

                <div className="space-y-5">

                    {schools.length === 0 && (

                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">

                            <h2 className="text-xl font-semibold text-green-700">

                                No shortages found

                            </h2>

                            <p className="text-green-600 mt-2">

                                All schools in this subcounty received their allocated books.

                            </p>

                        </div>

                    )}

                    {schools.map((school) => (

                        <div
                            key={school.dispatch_item_id}
                            className="bg-white rounded-lg shadow"
                        >

                            <button
                                onClick={() => toggleSchool(school.dispatch_item_id)}
                                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50"
                            >

                                <div className="text-left">

                                    <h2 className="font-bold text-lg">

                                        {school.school.name}

                                    </h2>

                                    <p className="text-gray-500">

                                        UIC: {school.school.uic}

                                    </p>

                                </div>

                                <div className="text-right">

                                    <div className="text-red-600 font-bold">

                                        Missing {school.total_missing} books

                                    </div>

                                    <div className="text-sm text-gray-500">

                                        Click to view details

                                    </div>

                                </div>

                            </button>

                            {expanded === school.dispatch_item_id && (

                                <div className="border-t">

                                    <table className="min-w-full">

                                        <thead className="bg-gray-100">

                                            <tr>

                                                <th className="px-4 py-3 text-left">

                                                    Book

                                                </th>

                                                <th className="px-4 py-3 text-center">

                                                    Allocated

                                                </th>

                                                <th className="px-4 py-3 text-center">

                                                    Received

                                                </th>

                                                <th className="px-4 py-3 text-center">

                                                    Missing

                                                </th>

                                                <th className="px-4 py-3 text-center">

                                                    Damaged

                                                </th>

                                                <th className="px-4 py-3">

                                                    Remarks

                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {school.books.map((book) => (

                                                <tr
                                                    key={book.id}
                                                    className="border-t"
                                                >

                                                    <td className="px-4 py-3">

                                                        {book.book}

                                                    </td>

                                                    <td className="px-4 py-3 text-center">

                                                        {book.allocated}

                                                    </td>

                                                    <td className="px-4 py-3 text-center">

                                                        {book.received}

                                                    </td>

                                                    <td className="px-4 py-3 text-center text-red-600 font-bold">

                                                        {book.shortage}

                                                    </td>

                                                    <td className="px-4 py-3 text-center">

                                                        {book.damaged}

                                                    </td>

                                                    <td className="px-4 py-3">

                                                        {book.remarks ?? '-'}

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </AuthenticatedLayout>
    );
}