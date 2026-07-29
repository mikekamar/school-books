import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export default function Import() {

    const { flash } = usePage().props;


    const importId = flash?.import_id;


    const {
        data,
        setData,
        post,
        processing,
    } = useForm({

        file: null

    });


    const [progress, setProgress] = useState(null);



    useEffect(() => {


        if (!importId) {
            return;
        }


        const timer = setInterval(() => {


            fetch(`/imports/${importId}/status`)

                .then(response => {


                    if (!response.ok) {

                        throw new Error(
                            `HTTP ${response.status}`
                        );

                    }


                    return response.json();


                })


                .then(result => {


                    setProgress(result);



                    if (
                        result.status === 'completed' ||
                        result.status === 'failed'
                    ) {

                        clearInterval(timer);

                    }


                })


                .catch(error => {

                    console.error(
                        'Import status error:',
                        error
                    );


                    clearInterval(timer);

                });


        }, 3000);



        return () => clearInterval(timer);



    }, [importId]);





    function submit(e) {

        e.preventDefault();



        post(
            route('schools.import.store'),
            {

                forceFormData: true,


                onSuccess: () => {

                    console.log(
                        'Import started'
                    );

                },


                onError: (errors) => {

                    console.log(errors);

                }

            }
        );

    }





    return (

        <AuthenticatedLayout>


            <div className="p-6">


                <h1 className="text-xl font-bold mb-5">
                    Import Schools
                </h1>



                {flash?.success && (

                    <div className="bg-green-100 text-green-800 p-3 rounded mb-4">

                        {flash.success}

                    </div>

                )}




                {flash?.error && (

                    <div className="bg-red-100 text-red-800 p-3 rounded mb-4">

                        {flash.error}

                    </div>

                )}






                <form onSubmit={submit}>


                    <input

                        type="file"

                        accept=".xlsx,.xls,.csv"

                        onChange={
                            e =>
                                setData(
                                    'file',
                                    e.target.files[0]
                                )
                        }

                    />





                    <button

                        disabled={processing}

                        className="bg-indigo-600 text-white px-4 py-2 rounded ml-3"

                    >

                        {processing
                            ? 'Uploading...'
                            : 'Import'
                        }


                    </button>



                </form>





                {progress && (

                    <div className="mt-6">


                        <p className="font-semibold">

                            Status:
                            {' '}
                            {progress.status}

                        </p>





                        <div className="w-full bg-gray-200 rounded mt-3">


                            <div

                                className="bg-green-600 h-3 rounded"

                                style={{
                                    width: `${progress.percentage}%`
                                }}

                            >

                            </div>


                        </div>





                        <p className="mt-2">

                            {progress.processed}
                            {' '}
                            /
                            {' '}
                            {progress.total}
                            {' '}
                            rows

                        </p>



                    </div>

                )}



            </div>


        </AuthenticatedLayout>

    );

}