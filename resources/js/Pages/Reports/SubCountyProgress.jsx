import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";

export default function SubCountyProgress({ county, subCounties }) {
    return (
        <AuthenticatedLayout>
            <div className="space-y-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        {county.name}
                    </h1>

                    <p className="text-gray-500">
                        Delivery progress by sub-county.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    Sub County
                                </th>

                                <th className="text-center">
                                    Total
                                </th>

                                <th className="text-center">
                                    Delivered
                                </th>

                                <th className="text-center">
                                    Pending
                                </th>

                                <th className="text-center">
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
                                                'reports.schools',
                                                subCounty.id
                                            )}
                                            className="font-medium text-indigo-600 hover:underline"
                                        >
                                            {subCounty.name}
                                        </Link>

                                    </td>

                                    <td className="text-center">
                                        {subCounty.total}
                                    </td>

                                    <td className="text-center text-green-600">
                                        {subCounty.delivered}
                                    </td>

                                    <td className="text-center text-red-600">
                                        {subCounty.pending}
                                    </td>

                                    <td className="text-center font-semibold">
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