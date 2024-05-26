import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { LuBookOpen, LuLayoutDashboard, LuLock, LuLogOut, LuPlaySquare, LuScrollText, LuUser2, LuUsers2, LuWallet, LuX } from 'react-icons/lu'
import Brands from '../../components/Brands'
import { SystemContext } from '../../provider'


const Aside = () => {
  const { aside, setAside } = useContext(SystemContext)
  const { data: user } = useSession()
  const path = usePathname()

  const listSide = [
    {
      sub: 'general',
      list: [
        { i: LuLayoutDashboard, t: 'Dashboard', h: '/dashboard', a: 0, c: ['user', 'panitia', 'admin'] },
        { i: LuPlaySquare, t: 'Events', h: '/dashboard/events', a: 0, c: ['panitia', 'admin'] },
        { i: LuWallet, t: 'Income', h: '/dashboard/income', a: 0, c: ['panitia', 'admin'] },
        { i: LuScrollText, t: 'Prediksi', h: '/dashboard/prediksi', a: 0, c: ['panitia', 'admin'] },
        { i: LuUsers2, t: 'Management', h: '/dashboard/manajemen-user', a: 0, c: ['admin'] },
      ]
    },
    {
      sub: 'configuration',
      list: [
        { i: LuUser2, t: 'Profile', h: '/dashboard/profile', a: 0, c: ['user', 'panitia', 'admin'] },
        { i: LuLock, t: 'Ubah Password', h: '/dashboard/change-password', a: 0, c: ['user', 'panitia', 'admin'] },
        { i: LuBookOpen, t: 'Documentation', h: '/dashboard/documentation', a: 0, c: ['panitia', 'admin'] },
      ]
    },
  ]

  return (
    <>
      <aside className={`
          ${aside && '!fixed !w-full !max-w-60 !shadow-2xl !items-start !flex !px-4'}
          group z-50 max-sm:hover:fixed sticky h-dvh max-sm:hover:!w-full max-sm:hover:!max-w-60 top-0 left-0 bg-white max-sm:hover:shadow-2xl flex flex-col max-[440px]:hidden min-[440px]:px-3 sm:px-4 py-5 max-sm:hover:items-start items-center sm:w-full sm:items-start sm:max-w-60 lg:max-w-72 gap-8 min-h-dvh border-r overflow-y-scroll`}>
        <Brands className={`
          ${aside && '!hidden'}  
          max-sm:group-hover:!hidden sm:hidden sm:pl-5 text-2xl`} custom={'E'} />
        <div className={`
            ${aside && '!flex !px-5'}  
            max-sm:group-hover:!flex max-sm:group-hover:!px-5 sm:pl-5 hidden sm:flex items-center justify-between w-full`}>
          <Brands className={'text-2xl'} custom={'Eveer'} />
          <button onClick={() => setAside(false)}>
            <h1>
              <LuX className={`${aside ? '!block' : 'group-hover:!hidden'} sm:hidden stroke-[3] text-xl`} />
            </h1>
          </button>
        </div>
        <Link href={'/dashboard/profile'} className='flex items-center w-full gap-3 py-2 sm:py-3 px-2 sm:px-4 border bg-blue-50 rounded-xl'>
          <img className='w-8 sm:w-10 h-fit border-back rounded-full' src={user.picture} alt="" />
          <div className={`
              ${aside && '!flex'}  
              max-sm:group-hover:!flex hidden sm:flex flex-col`}>
            <h2 className='font-bold text-sm text-gray-700 line-clamp-1'>{user.name || user.username}</h2>
            <span className='text-xs text-gray-500'>{user.role}</span>
          </div>
        </Link>
        {listSide.map(x => (
          <div className={`
              ${aside && '!items-start'}
              flex flex-col items-center max-sm:group-hover:!items-start sm:items-start gap-2 w-full`}>
            <h2 className='text-xs font-bold text-gray-400 uppercase'>
              <span className={`
                  ${aside && '!block'}
                  max-sm:group-hover:!block hidden sm:block`}>
                {x.sub}
              </span>
              <span className={`
                  ${aside && '!hidden'}
                  max-sm:group-hover:!hidden sm:hidden text-lg`}>•</span>
            </h2>
            <div className={`
                ${aside && '!w-full'}
                flex flex-col gap-1 text-gray-600 max-sm:group-hover:!w-full sm:w-full`}>
              {x.list.map(l => l.c.includes(user.role.toLowerCase()) && (
                <Link href={l.h} className={`${path == l.h && 'font-medium bg-gray-100'} flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-all`}>
                  <l.i className={`${path == l.h && '!fill-blue-200'} fill-gray-200 stroke-gray-500 text-xl sm:text-2xl`} />
                  <h2 className={`
                      ${aside && '!block'}
                      max-sm:group-hover:!block hidden sm:block capitalize text-[15px]`}>{l.t}</h2>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div onClick={() => signOut()} className={`
            ${aside && '!items-start !w-full'}
            flex max-sm:group-hover:!items-start items-center max-sm:group-hover:!w-full sm:w-full gap-4 p-3 hover:bg-gray-100 cursor-pointer rounded-xl transition-all`}>
          <LuLogOut className={`fill-red-200 stroke-gray-500 text-2xl`} />
          <h2 className={`
              ${aside && '!block'}
              max-sm:group-hover:!block hidden sm:block capitalize text-[15px]`}>Logout</h2>
        </div>
      </aside>
    </>
  )
}

export default Aside