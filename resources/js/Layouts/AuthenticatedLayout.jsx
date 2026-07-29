import DashboardLogo from '@/Components/DashboardLogo';
import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';


export default function AuthenticatedLayout({ header, children }) {

    const user = usePage().props.auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (

        <div className="min-h-screen bg-gray-100 flex">


            {/* Sidebar */}
            <Sidebar 
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />



            {/* Main Area */}

            <div className="flex-1 flex flex-col lg:ml-64">



                {/* Top Navbar */}

                <nav className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">


                    {/* Mobile menu button */}

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >

                        ☰

                    </button>



                    <div className="hidden lg:block">

                        <h1 className="text-lg font-semibold text-gray-700">
                            Dashboard
                        </h1>

                    </div>




                    {/* User Menu */}

                    <div>

                        <Dropdown>

                            <Dropdown.Trigger>

                                <button
                                    className="
                                    flex items-center gap-3 
                                    px-4 py-2 
                                    rounded-lg
                                    hover:bg-gray-100
                                    "
                                >

                                    <div className="
                                        h-9 w-9 
                                        rounded-full 
                                        bg-indigo-600 
                                        text-white
                                        flex items-center justify-center
                                        font-bold
                                    ">
                                        {user.name.charAt(0)}
                                    </div>


                                    <div className="text-left">

                                        <p className="text-sm font-medium">
                                            {user.name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {user.roles?.[0]}
                                        </p>

                                    </div>


                                    <span>
                                        ▾
                                    </span>


                                </button>


                            </Dropdown.Trigger>



                            <Dropdown.Content>

                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>


                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Logout
                                </Dropdown.Link>


                            </Dropdown.Content>


                        </Dropdown>


                    </div>



                </nav>





                {/* Page Header */}

                {header && (

                    <header className="bg-white shadow-sm">

                        <div className="
                            px-6 py-5
                        ">

                            {header}

                        </div>

                    </header>

                )}






                {/* Content */}

                <main className="p-6">

                    {children}

                </main>



            </div>



        </div>

    );
}