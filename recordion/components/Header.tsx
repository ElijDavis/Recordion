import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
//import { ICONS } from '@/constants';
import DropdownList from './DropdownList';
import RecordScreen from './RecordScreen';

export default function Header ({subHeader, title, userImg}: SharedHeaderProps) {
    return (
        <header className="header">
            <section className="header-container">
                <div className="details">
                    {userImg && (
                        <Image src={userImg} alt="user" width={66} height={66} className="rounded-full" />
                    )}
                    <article>
                        <p>{subHeader}</p>
                        <h1>{title}</h1>
                    </article>
                </div>
                <aside>
                    <Link href="/upload">
                     <Image src="/assets/icons/upload.svg" alt="upload" height={16} width={16} />
                    </Link>
                    <RecordScreen />
                </aside>
            </section>
            <section className="flex justify-center gap-x-5">
                <div>
                    <input type='text' placeholder='serach for videos, tags, folders...'/>
                    <Image src="/assets/icons/search.svg" alt='search' height={16} width={16} />
                </div>
                <DropdownList />
            </section>
        </header>
    );
}