import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';


export default function Sidebar({open,setOpen,permission}) {


const {auth} = usePage().props;

const user = auth.user;


const can = (permission)=>{

    return user.permissions?.includes(permission);

};

const [reportsOpen, setReportsOpen] = useState(false);

return (

<>

{/* Mobile overlay */}

{
open && (

<div
onClick={()=>setOpen(false)}
className="
fixed inset-0 bg-black/50 z-30 lg:hidden
"
/>

)

}





<aside
className={`
fixed top-0 left-0
h-screen w-64
bg-slate-900
text-white
z-40
transform
transition-transform

${open ? 'translate-x-0':'-translate-x-full'}

lg:translate-x-0
`}
>



<div className="
h-16 
flex items-center 
px-6
border-b border-slate-700
">


<h1 className="
text-xl 
font-bold
tracking-wide
">

Bowen Logistics

</h1>


</div>




<div className="p-4">


<nav className="space-y-2">



<Link
href="/dashboard"
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
transition
"
>

🏠 Dashboard

</Link>

{
can('manage users') && (

<Link
href="/users"
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>

👥 Users

</Link>

)
}


{
can('import schools') && (

<Link
href="/schools/import"
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>
🏫 Import Schools
</Link>

)
}

{
can('import schools') && (

<Link
href={route('trucks.index')}
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>
🏫 Trucks
</Link>

)
}

{
can('import schools') && (

<Link
 href={route('drivers.index')}
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>
🏫 Drivers
</Link>

)
}

{
can('view stock') && (

<Link
href="/stock"
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>

📦 Stock

</Link>

)

}

{
can('dispatch books') && (

<Link
href="/dispatches"
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>

📦 Dispatches

</Link>

)

}


{
can('view assigned deliveries') && (

<Link
href={route('dispatches.mine')}
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>

🚚 My Dispatches

</Link>

)

}



{
can('view payments') && (

<Link
href="/payments"
className="
block px-4 py-3 rounded-lg
hover:bg-slate-800
"
>

💰 Payments

</Link>

)

}


{
can('view reports') && (

<div className="space-y-1">

    <button
        onClick={() => setReportsOpen(!reportsOpen)}
        className="
        w-full
        flex
        items-center
        justify-between
        px-4
        py-3
        rounded-lg
        hover:bg-slate-800
        transition
        "
    >
        <span className="flex items-center gap-2">
            📊 Reports
        </span>

        <span
            className={`transition-transform ${
                reportsOpen ? 'rotate-180' : ''
            }`}
        >
            ▼
        </span>
    </button>

    {reportsOpen && (
        <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">

            <Link
                href={route('reports.delivery-summary')}
                className="
                block
                rounded-lg
                px-3
                py-2
                text-sm
                text-gray-300
                hover:bg-slate-800
                hover:text-white
                "
            >
                📈 CountryWide Progress
            </Link>

            <Link
                href={route('reports.county-progress')}
                className="
                block rounded-lg
                px-3 py-2
                text-sm
                text-gray-300
                hover:bg-slate-800
                hover:text-white
                "
            >
                🗺 County Progress
            </Link>

           <Link
                href={route('reports.subcounty-reconciliation')}
                className="
                    block rounded-lg
                    px-3 py-2
                    text-sm
                    text-gray-300
                    hover:bg-slate-800
                    hover:text-white
                "
            >
                🗺 County Reconciliation
            </Link>
            <Link
                href={route('reports.outstanding-schools')}
                className="
                block
                rounded-lg
                px-3
                py-2
                text-sm
                text-gray-300
                hover:bg-slate-800
                hover:text-white
                "
            >
                ⏳ Outstanding Schools
            </Link>

        </div>
    )}

</div>

)
}



</nav>


</div>





<div className="
absolute bottom-0
w-full
border-t
border-slate-700
p-4
">


<p className="text-sm text-gray-300">
Logged in as
</p>


<p className="font-semibold">
{user.name}
</p>


</div>



</aside>



</>

)

}