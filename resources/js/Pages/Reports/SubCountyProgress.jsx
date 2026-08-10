import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";

export default function SubCountyProgress({ county, subCounties }) {
    return (
        <AuthenticatedLayout>
            <Head title={`${county.name} Progress`} />

            <div className="space-y-6">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            {county.name}
                        </h1>

                        <p className="text-gray-500">
                            Delivery progress by sub-county.
                        </p>
                    </div>

                    <a
                        href={route(
                            "reports.subcounty-progress.pdf",
                            county.id
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                    >
                        Export PDF
                    </a>

                </div>

                {/* County Summary */}

                <div className="overflow-hidden rounded-xl border bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    County
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Total Schools
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Delivered
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Pending
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Books Allocated
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Books Delivered
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Books Pending
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Progress
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="px-6 py-4 font-semibold">
                                    {county.name}
                                </td>

                                <td className="px-4 py-4 text-center">
                                    {county.total}
                                </td>

                                <td className="px-4 py-4 text-center text-green-600 font-semibold">
                                    {county.delivered}
                                </td>

                                <td className="px-4 py-4 text-center text-red-600 font-semibold">
                                    {county.pending}
                                </td>

                                <td className="px-4 py-4 text-center font-semibold">
                                    {county.books_allocated ?? 0}
                                </td>

                                <td className="px-4 py-4 text-center text-green-600 font-semibold">
                                    {county.books_delivered ?? 0}
                                </td>

                                <td className="px-4 py-4 text-center text-red-600 font-semibold">
                                    {county.books_pending ?? 0}
                                </td>

                                <td className="px-6 py-4 text-center text-blue-600 font-semibold">
                                    {county.progress}%
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>


                {/* Sub County Progress */}

                <div className="overflow-hidden rounded-xl border bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    Sub County
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Total Schools
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Delivered
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Pending
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Books Allocated
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Books Delivered
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Books Pending
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Progress
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {subCounties.map((subCounty) => (

                                <tr
                                    key={subCounty.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">

                                        <Link
                                            href={route(
                                                "reports.schools",
                                                subCounty.id
                                            )}
                                            className="font-medium text-indigo-600 hover:underline"
                                        >
                                            {subCounty.name}
                                        </Link>

                                    </td>

                                    <td className="px-4 py-4 text-center">
                                        {subCounty.total}
                                    </td>

                                    <td className="px-4 py-4 text-center text-green-600 font-semibold">
                                        {subCounty.delivered}
                                    </td>

                                    <td className="px-4 py-4 text-center text-red-600 font-semibold">
                                        {subCounty.pending}
                                    </td>

                                    <td className="px-4 py-4 text-center font-semibold">
                                        {subCounty.books_allocated ?? 0}
                                    </td>

                                    <td className="px-4 py-4 text-center text-green-600 font-semibold">
                                        {subCounty.books_delivered ?? 0}
                                    </td>

                                    <td className="px-4 py-4 text-center text-red-600 font-semibold">
                                        {subCounty.books_pending ?? 0}
                                    </td>

                                    <td className="px-6 py-4 text-center text-blue-600 font-semibold">
                                        {subCounty.progress}%
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}