import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { LuArrowDownRight, LuArrowRight } from "react-icons/lu";
import Layouts from '../components/Layouts';
import Loading from '../components/Loading';
import { fetchJson, useQFetchFn } from '../utils/tools';

const listNav = [
  { t: 'Beranda', h: '/' },
  { t: 'Events', h: '/#event' },
  { t: 'Kontak', h: '/#contact' },
  { t: 'Bantuan', h: '/#help' },
]

const Home = () => {
  const { data: user } = useSession()
  const _EventList = useQFetchFn(async () => await fetchJson('/api/signal/event/lists'), ['event_lists_main'])

  if (_EventList.isLoading) return <Loading />

  return (
    <>
      <Layouts className={'px-4 sm:px-10'}>
        <section>
          <div className="grid pb-8 mx-auto lg:gap-8 xl:gap-0 mb-16 pt-20 lg:grid-cols-12">
            <div className="flex flex-col mr-auto place-self-center gap-y-5 lg:col-span-7">
              <h1 className="max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
                Event Organizer <br />
                Profesional.
              </h1>
              <p className="max-w-md font-light text-gray-500 text-xl">
                Kreativitas, perencanaan matang, dan eksekusi tanpa cela adalah komitmen kami.
              </p>
              <p className="max-w-md font-light text-gray-500 text-xl">
                Mulai dari konferensi berskala besar hingga pesta. Percayakan kesuksesan acara Anda pada kami.
              </p>
              <div className='flex items-center gap-5 mt-5'>
                <Link href='/#events' className='flex items-center gap-2 button-border'>
                  <LuArrowDownRight />
                  Event Terbaru
                </Link>
                <Link href={user ? '/dashboard' : '/auth/login'} className='button'>
                  {user ? 'Dashboard' : 'Masuk'}
                </Link>
              </div>
            </div>
            <div className="mt-20 lg:mt-0 lg:col-span-5 lg:flex">
              <img className='rounded-lg object-cover h-[200px] lg:h-[500px] w-full' src={_EventList.data?.data[0]?.event_thumbnail || '/banner-1.jpg'} />
            </div>
          </div>
        </section>
        <section id='events'>
          <div className="py-8 mx-auto lg:py-32 lg:px-6">
            <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-20">
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight">Event Terbaru Bersiaplah!</h1>
              <p className="mb-5 font-light text-gray-500 max-w-2xl mx-auto sm:text-[19px]">
                Bergabunglah bersama kami dan rasakan pengalaman unik yang tak akan terlupakan. Cek jadwal dan lokasi acara sekarang juga!
              </p>
            </div>
            <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>
              {_EventList.data?.data?.slice(0, 6).map(x => (
                <Link href={`/events/${x.event_name.replace(/ /g, '-').trim()}`} className="group overflow-hidden relative m-0 flex h-72 w-full xl:w-96 rounded-xl hover:shadow-xl sm:mx-auto transition duration-300 ease-in-out">
                  <div className="z-10 absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.7))] group-hover:bg-black/20 rounded-xl transition duration-300 ease-in-out"></div>
                  <div className="h-full w-full overflow-hidden rounded-xl border border-gray-200">
                    <img src={x.event_thumbnail} className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110" alt="" />
                  </div>
                  <div className="absolute bottom-0 z-20 m-0 pb-4 p-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                    <h1 className="text-xl font-bold text-white shadow-xl line-clamp-1">{x.event_name}</h1>
                    <h1 className="text-sm font-light text-gray-400 shadow-xl line-clamp-2">{x.event_description}</h1>
                  </div>
                </Link>
              ))}
            </div>
            <Link href='/events' className='flex items-center gap-2 button-border mt-10 ml-auto'>
              <LuArrowRight />
              Lihat semua
            </Link>
          </div>
        </section>
      </Layouts>
    </>
  )
}

export default Home