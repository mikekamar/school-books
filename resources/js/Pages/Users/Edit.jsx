import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm, Link} from '@inertiajs/react';


export default function Edit({user, roles}) {


const {data,setData,put,processing,errors}=useForm({

    name:user.name,
    email:user.email,
    role:user.role

});


function submit(e){

    e.preventDefault();

    put(route('users.update',user.id));

}


return (

<AuthenticatedLayout header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit User
                </h2>
            }>

<Head title="Edit User"/>


<div className="p-6">

<div className="flex items-center justify-between mb-6">

    <h1 className="text-xl font-bold">
        Edit User
    </h1>


    <Link
        href={route('users.index')}
        className="
            inline-flex
            items-center
            px-4
            py-2
            bg-gray-200
            text-gray-700
            rounded-lg
            hover:bg-gray-300
            transition
        "
    >
        ← Back to Users
    </Link>

</div>


<form onSubmit={submit} className="space-y-4">


<input
className="border rounded p-2 w-full"
value={data.name}
onChange={e=>setData('name',e.target.value)}
/>


<input
className="border rounded p-2 w-full"
value={data.email}
onChange={e=>setData('email',e.target.value)}
/>


<select

className="border rounded p-2 w-full"

value={data.role}

onChange={e=>setData('role',e.target.value)}

>

<option value="">
Select Role
</option>


{
roles.map(role=>(

<option key={role} value={role}>
{role}
</option>

))
}


</select>



<button
disabled={processing}
className="bg-blue-600 text-white px-4 py-2 rounded"
>

Update User

</button>


</form>


</div>


</AuthenticatedLayout>

)

}