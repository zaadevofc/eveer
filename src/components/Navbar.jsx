import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { Dropdown } from 'rsuite';
import Brands from './Brands';
import { LuAlignRight } from 'react-icons/lu';

const listNav = [
  { t: 'Beranda', h: '/' },
  { t: 'Events', h: '/events' },
  { t: 'Bantuan', h: '/#help' },
]

const Navbar = () => {
  const { data: user } = useSession();
  return (
    <>
      <header className="z-50 fixed w-full bg-white/80 backdrop-blur-md">
        <nav className="border-b border-gray-300 py-4">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
            <Brands />
            <div className='flex items-center gap-5 order-2'>
              {user && <h1 onClick={() => signOut()} className='hidden sm:block button-border'>Logout</h1>}
              {user && <Link href={'/dashboard'} className='button'>Dashboard</Link>}
              {!user && <Link href={'/auth/login'} className='hidden sm:block button-border'>Masuk</Link>}
              {!user && <Link href={'/auth/register'} className='button'>Buat Akun</Link>}
              <Dropdown
                placement={'bottomEnd'}
                noCaret
                renderToggle={(e) => <>
                  <h1 {...e} className='min-[753px]:hidden button-border rounded-lg border-back px-1.5'>
                    <LuAlignRight className='stroke-[3] text-xl' />
                  </h1>
                </>
                }>
                {listNav.map((x, i) => (
                  <Dropdown.Item>
                    <Link href={x.h}>
                      {x.t}
                    </Link>
                  </Dropdown.Item>
                ))}
                <Dropdown.Item disabled>
                  <span className='opacity-0'>
                    WWWWWWWWWWW
                  </span>
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div
              className="items-center justify-between hidden w-full min-[753px]:flex min-[753px]:w-auto min-[753px]:order-1"
            >
              <ul className="flex flex-col mt-4 font-medium text-gray-600 min-[753px]:flex-row min-[753px]:space-x-10 min-[753px]:mt-0">
                {listNav.map((x, i) => (
                  <li>
                    <Link href={x.h}>
                      {x.t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar