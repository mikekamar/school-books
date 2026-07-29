import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';


export default function Index({users}) {


return (

<AuthenticatedLayout header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users List
                </h2>
            }>
    

<Head title="Users"/>


<div className="bg-white p-6 rounded-xl shadow">


<div className="flex justify-between mb-6">

<Link
href="/users/create"
className="
bg-indigo-600 
text-white 
px-4 py-2 
rounded-lg
"
>
Add User
</Link>


</div>


<div className="overflow-x-auto">
    <table className="w-full">


<thead>

<tr className="border-b">

<th className="text-left p-3">
Name
</th>

<th>
Email
</th>

<th>
Role
</th>

<th>Actions</th>

</tr>

</thead>



<tbody>

{
users.map(user=>(

<tr key={user.id}
className="border-b"
>

<td className="p-3">
{user.name}
</td>


<td>
{user.email}
</td>


<td>

{
user.roles.map(role=>(
<span
key={role.id}
className="
bg-gray-200 
px-2 py-1 
rounded
"
>
{role.name}
</span>
))
}

</td>

<td className="p-3">

<div className="flex items-center gap-2">

<Link
href={route('users.edit',user.id)}
className="
flex items-center gap-1
px-3 py-2
text-sm
text-blue-700
bg-blue-100
rounded-lg
hover:bg-blue-200
"
>
<Pencil size={16}/>
Edit
</Link>


<button
onClick={()=>{
if(confirm(`Delete ${user.name}?`))
{
router.delete(route('users.destroy',user.id))
}
}}
className="
flex items-center gap-1
px-3 py-2
text-sm
text-red-700
bg-red-100
rounded-lg
hover:bg-red-200
"
>
<Trash2 size={16}/>
Delete
</button>

</div>

</td>

</tr>

))
}


</tbody>


</table>
</div>

</div>


</AuthenticatedLayout>

)

}