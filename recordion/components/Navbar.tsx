'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const user = {}

const Navbar = () => {
    const router = useRouter();
    return (
        <header className="navbar">
            <nav>
                <Link href="/">
                    <Image src="/assets/icons/logo.svg" alt="Logo" height={32} width={32}/>
                    <h1>Recordion</h1>
                </Link>
                {user && (
                    <figure className="mr-16 flex justify-center gap-x-5">
                        <button onClick={() => router.push('/profile/123456')}>
                            <Image className="rounded-full aspect-square" src="/assets/images/dummy.jpg"alt="user" height={36} width={36}/>
                        </button>
                        <button className="cursor-pointer">
                            <Image className="rotate-180" src="/assets/icons/logout.svg" alt="logout" height={36} width={36}/>
                        </button>
                    </figure>
                )}
            </nav>
        </header>
    )
}
export default Navbar;