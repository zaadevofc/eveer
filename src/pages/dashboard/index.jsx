import React from 'react';
import { LuArrowRight, LuCheckCircle, LuCircleDollarSign, LuPieChart, LuUser2 } from 'react-icons/lu';
import Layouts from '../../components/dashboard/Layouts';
import { dayjs, fetchJson, statusColor, statusDisplay, useQFetchFn } from '../../utils/tools';
import Loading from '../../components/Loading';
import Link from 'next/link';
import Countdown from 'react-countdown';
import { useSession } from 'next-auth/react';


const DashobardPage = () => {
  const { data: user } = useSession()

  const _EvenStats = useQFetchFn(async () => await fetchJson('/api/signal/event/stats'), ['event_stats'])
  const _EventList = useQFetchFn(async () => await fetchJson('/api/signal/event/lists'), ['event_lists_dash'])

  if (_EvenStats.isLoading) return <Loading />
  if (_EventList.isLoading) return <Loading />

  const listStats = [
    { i: LuPieChart, t: "Total Event", v: _EvenStats.data.data?.event_total || 0 },
    { i: LuCircleDollarSign, t: "Total Income", v: 0 },
    { i: LuCheckCircle, t: "Event Finish", v: _EvenStats.data.data?.event_finish || 0 },
    { i: LuUser2, t: "Total User", v: _EvenStats.data.data?.user_total || 0 },
  ];

  return (
    <>
      <Layouts title='Dashboard'>
        <div className={`${user.role == 'USER' && 'hidden'} grid md:grid-cols-2 xl:grid-cols-4 gap-6`}>
          {listStats.map(x => (
            <div className="flex items-center px-4 py-3 bg-gray-50 border-back rounded-xl">
              <div className="p-3 mr-4 text-gray-700 bg-blue-200 rounded-full">
                <x.i className="text-xl stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 line-clamp-1">
                  {x.t}
                </p>
                <p className="text-lg font-semibold text-gray-700 line-clamp-1">
                  {x.v}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='grid lg:grid-cols-2 gap-5 w-full'>
          {_EventList.data?.data.map(x => (
            <Link href={`/events/${x.event_name.replace(/ /g, '-').trim()}`} className='cursor-pointer'>
              <div className='relative'>
                <div className="flex justify-center items-center bg-black/10 backdrop-blur-sm rounded-t-xl w-full h-full absolute">
                  <div className='text-white/80 font-semibold text-3xl md:text-4xl tracking-wider'>
                    <Countdown date={Number(x.event_release)} />
                  </div>
                </div>
                <img src={x.event_thumbnail}
                  className="rounded-t-xl w-full h-36 object-cover"
                />
              </div>
              <div className="max-w-4xl px-4 md:px-5 py-4 mb-5 mx-auto border-back bg-white rounded-b-xl">
                <div className="flex items-center justify-between">
                  <span className="font-light text-[15px] text-gray-600">
                    {dayjs(Number(x.event_release)).format('DD MMM - ')}
                    {dayjs(Number(x.event_finish)).format('DD MMM')}
                  </span>
                  <h2 className={`${statusColor(x.event_status)} rounded-md uppercase text-[11px] md:text-xs small !w-fit !border-back font-medium !px-2 !py-0.5`}>
                    {statusDisplay(x.event_status)}
                  </h2>
                </div>
                <div className="mt-2">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-700">
                    {x.event_name}
                  </h1>
                  <p className="text-sm md:text-base mt-2 text-gray-600 line-clamp-3">
                    {x.event_description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <h2 className={`bg-purple-100 text-purple-600 rounded-md uppercase text-xs small !w-fit !border-back font-medium !px-2 !py-0.5`}>
                    {dayjs(Number(x.event_release)).format('YYYY')}
                  </h2>
                  <h1 className='flex items-center gap-3 text-sm'>
                    Lihat selengkapnya
                    <LuArrowRight />
                  </h1>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Layouts>
    </>
  )
}

export default DashobardPage