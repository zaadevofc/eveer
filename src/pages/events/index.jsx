import React from 'react'
import Layouts from '../../components/Layouts'
import { dayjs, fetchJson, statusColor, statusDisplay, useQFetchFn } from '../../utils/tools'
import Loading from '../../components/Loading'
import Link from 'next/link'
import { LuArrowRight } from 'react-icons/lu'

const EventPage = () => {
  const _EventList = useQFetchFn(async () => await fetchJson('/api/signal/event/lists'), ['event_lists_page'])

  if (_EventList.isLoading) return <Loading />

  return (
    <>
      <Layouts className={'px-4 sm:px-10'}>
        <div className="overflow-x-hidden mt-3">
          <div>
            <div className="max-w-3xl flex justify-between mx-auto">
              <div className="w-full mx-auto">
                {_EventList.data?.data.length == 0 && (
                    <div className="max-w-4xl px-8 py-6 mb-5 mx-auto border-back bg-white rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-light text-center mx-auto text-gray-600">
                          Tidak ada event apapun disini
                        </span>
                      </div>
                    </div>
                )}
                {_EventList.data?.data.map(x => (
                  <Link href={`/events/${x.event_name.replace(/ /g, '-').trim()}`} className='cursor-pointer'>
                    <img src={x.event_thumbnail}
                      className="rounded-t-xl w-full h-36 object-cover"
                    />
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
            </div>
          </div>
        </div>
      </Layouts>
    </>
  )
}

export default EventPage