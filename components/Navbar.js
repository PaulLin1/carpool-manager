import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="p-6 sticky top-0 bg-white">
            <div className="container mx-auto flex items-center relative">
                <Link href="/" passHref className="absolute left-1/2 transform -translate-x-1/2 text-xl">
                    Event Carpool Manager
                </Link>
                <Link href="/login" passHref className="ml-auto">
                    Account
                </Link>
            </div>
        </nav>
    );
}