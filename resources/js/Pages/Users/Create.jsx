import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';


export default function Create({ roles }) {


    const { data, setData, post, processing, errors } = useForm({

        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',

    });



    const submit = (e) => {

        e.preventDefault();

        post(route('users.store'));

    };



    return (

        <AuthenticatedLayout header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Users
                </h2>
            }>

            <Head title="Create User" />


            <div className="max-w-3xl mx-auto">


                <div className="
                    bg-white 
                    rounded-xl 
                    shadow-sm 
                    p-6
                ">


                    <div className="flex justify-between items-center mb-6">


                        <div>

                            <h2 className="
                                text-xl 
                                font-bold 
                                text-gray-800
                            ">
                                Create User
                            </h2>

                            <p className="text-sm text-gray-500">
                                Add a new system user and assign a role
                            </p>

                        </div>



                        <Link
                            href={route('users.index')}
                            className="
                            px-4 py-2
                            rounded-lg
                            bg-gray-200
                            hover:bg-gray-300
                            "
                        >
                            Back
                        </Link>


                    </div>





                    <form onSubmit={submit} className="space-y-5">



                        {/* Name */}

                        <div>

                            <label className="block text-sm font-medium">
                                Full Name
                            </label>


                            <input
                                type="text"
                                value={data.name}
                                onChange={e=>setData('name',e.target.value)}
                                className="
                                mt-1 w-full rounded-lg border-gray-300
                                focus:ring-indigo-500
                                "
                            />


                            {errors.name && (
                                <p className="text-red-500 text-sm">
                                    {errors.name}
                                </p>
                            )}

                        </div>





                        {/* Email */}

                        <div>

                            <label className="block text-sm font-medium">
                                Email Address
                            </label>


                            <input
                                type="email"
                                value={data.email}
                                onChange={e=>setData('email',e.target.value)}
                                className="
                                mt-1 w-full rounded-lg border-gray-300
                                "
                            />


                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email}
                                </p>
                            )}

                        </div>

                        {/* Role */}

                        <div>

                            <label className="block text-sm font-medium">
                                Assign Role
                            </label>


                            <select

                                value={data.role}

                                onChange={e=>setData('role',e.target.value)}

                                className="
                                mt-1 w-full rounded-lg border-gray-300
                                "

                            >

                                <option value="">
                                    Select Role
                                </option>


                                {
                                    roles.map(role=>(

                                        <option
                                            key={role.id}
                                            value={role.name}
                                        >
                                            {role.name}
                                        </option>

                                    ))
                                }


                            </select>


                            {errors.role && (
                                <p className="text-red-500 text-sm">
                                    {errors.role}
                                </p>
                            )}

                        </div>







                        {/* Password */}

                        <div>

                            <label className="block text-sm font-medium">
                                Password
                            </label>


                            <input

                                type="password"

                                value={data.password}

                                onChange={e=>setData('password',e.target.value)}

                                className="
                                mt-1 w-full rounded-lg border-gray-300
                                "

                            />


                        </div>







                        {/* Confirm Password */}

                        <div>

                            <label className="block text-sm font-medium">
                                Confirm Password
                            </label>


                            <input

                                type="password"

                                value={data.password_confirmation}

                                onChange={
                                    e=>setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }

                                className="
                                mt-1 w-full rounded-lg border-gray-300
                                "

                            />

                        </div>







                        <button

                            disabled={processing}

                            className="
                            w-full
                            bg-indigo-600
                            text-white
                            py-3
                            rounded-lg
                            hover:bg-indigo-700
                            transition
                            "

                        >

                            {
                                processing
                                ? 'Creating...'
                                : 'Create User'
                            }

                        </button>




                    </form>



                </div>


            </div>


        </AuthenticatedLayout>

    );

}