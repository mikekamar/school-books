import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function VerifyDelivery({ dispatchItem }) {

    const { data, setData, post, processing } = useForm({

        receiver_name: "",

        receiver_phone: "",

        remarks: "",

        books: dispatchItem.books.map(book => ({

            id: book.id,

            received_quantity: book.received_quantity,

            damaged_quantity: book.damaged_quantity,

            remarks: book.remarks ?? "",

        })),

    });

    const updateBook = (index, field, value) => {

        const books = [...data.books];

        books[index][field] = value;

        setData("books", books);

    };

    const submit = (e) => {

        e.preventDefault();

        post(route("dispatch-items.complete", dispatchItem.id));

    };

    return (

        <AuthenticatedLayout>

            <Head title="Verify Delivery" />

            <div className="max-w-7xl mx-auto py-8">

                <div className="bg-white shadow rounded-xl p-6">

                    <h1 className="text-2xl font-bold mb-6">

                        Verify School Delivery

                    </h1>

                    <div className="grid grid-cols-2 gap-4 mb-8">

                        <div>

                            <p className="text-sm text-gray-500">

                                School

                            </p>

                            <p className="font-semibold">

                                {dispatchItem.school.school_name}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">

                                UIC

                            </p>

                            <p className="font-semibold">

                                {dispatchItem.school.uic}

                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">

                                Sub County

                            </p>

                            <p className="font-semibold">

                                {dispatchItem.school.sub_county}

                            </p>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">

                        <div>

                            <label className="font-medium">

                                Receiver Name

                            </label>

                            <input

                                className="w-full border rounded-lg mt-2 p-2"

                                value={data.receiver_name}

                                onChange={(e)=>

                                    setData("receiver_name",e.target.value)

                                }

                            />

                        </div>

                        <div>

                            <label className="font-medium">

                                Receiver Phone

                            </label>

                            <input

                                className="w-full border rounded-lg mt-2 p-2"

                                value={data.receiver_phone}

                                onChange={(e)=>

                                    setData("receiver_phone",e.target.value)

                                }

                            />

                        </div>

                    </div>

                    <table className="w-full border">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="border p-2 text-left">

                                    Book

                                </th>

                                <th className="border p-2">

                                    Allocated

                                </th>

                                <th className="border p-2">

                                    Received

                                </th>

                                <th className="border p-2">

                                    Shortage

                                </th>

                                <th className="border p-2">

                                    Remarks

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {dispatchItem.books.map((book,index)=>{

                                const received = Number(data.books[index].received_quantity);

                                const shortage = book.allocated_quantity - received;

                                return(

                                    <tr key={book.id}>

                                        <td className="border p-2">

                                            {book.title}

                                        </td>

                                        <td className="border text-center">

                                            {book.allocated_quantity}

                                        </td>

                                        <td className="border p-2">

                                            <input

                                                type="number"

                                                min="0"

                                                className="w-24 border rounded p-1"

                                                value={data.books[index].received_quantity}

                                                onChange={(e)=>

                                                    updateBook(

                                                        index,

                                                        "received_quantity",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                        </td>

                                        <td className="border text-center text-red-600 font-bold">

                                            {shortage}

                                        </td>

                                        <td className="border p-2">

                                            <input

                                                className="w-full border rounded p-1"

                                                value={data.books[index].remarks}

                                                onChange={(e)=>

                                                    updateBook(

                                                        index,

                                                        "remarks",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                    <div className="mt-8">

                        <label className="font-medium">

                            Overall Remarks

                        </label>

                        <textarea

                            className="w-full border rounded-lg mt-2 p-3"

                            rows="4"

                            value={data.remarks}

                            onChange={(e)=>

                                setData("remarks",e.target.value)

                            }

                        />

                    </div>

                    <button

                        onClick={submit}

                        disabled={processing}

                        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"

                    >

                        Complete Delivery

                    </button>

                </div>

            </div>

        </AuthenticatedLayout>

    );

}