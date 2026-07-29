import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {

    return (
        <>
            <Head title="Welcome" />

            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                
                <div className="text-center">

                    {/* Logo */}
                    <img
                        src="/images/Picture1.png"
                        alt="Logo"
                        className="mx-auto w-48 h-48 object-contain mb-8"
                    />

                    {/* Authentication Links */}
                    <div className="flex justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                >
                                    Log in
                                </Link>

                            </>
                        )}
                    </div>

                </div>

            </div>
        </>
    );
}