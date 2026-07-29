import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";

export default function CountyProgress({ counties }) {
    return (

        <AuthenticatedLayout>
            <div className="space-y-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        County Progress
                    </h1>

                    <p className="text-gray-500">
                        Monitor delivery progress across all counties.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left">
                                    County
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

                                <th className="px-6">
                                    Progress
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {counties.map((county) => (

                                <tr
                                    key={county.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4 font-medium">

                                    <Link
                                        href={route('reports.subcounty-progress', county.id)}
                                        className="font-medium text-indigo-600 hover:underline"
                                    >
                                        {county.name}
                                    </Link>
                                        
                                    </td>

                                    <td className="text-center">
                                        {county.total}
                                    </td>

                                    <td className="text-center text-green-600 font-semibold">
                                        {county.delivered}
                                    </td>

                                    <td className="text-center text-red-600 font-semibold">
                                        {county.pending}
                                    </td>

                                    <td className="text-center text-blue-600 font-semibold">
                                            {county.progress}%
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