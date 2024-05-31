import { useParams, usePathname } from "next/navigation";
import React from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { LuFacebook, LuForward, LuTwitter } from "react-icons/lu";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { Highlight } from 'rsuite';
import EventHead from "../../components/EventHead";
import InfoScreen from "../../components/InfoScreen";
import Layouts from "../../components/Layouts";
import Loading from "../../components/Loading";
import { dayjs, fetchJson, statusColor, statusDisplay, useQFetchFn } from "../../utils/tools";

const EventDetailPage = () => {
  const params = useParams()
  const path = usePathname()

  const _EventDetail = useQFetchFn(async () => await fetchJson(`/api/signal/event/detail?name=${params.id}`), ['event_lists_home'])
  if (_EventDetail.isLoading) return <Loading />
  if (!_EventDetail.data?.ok) return <InfoScreen text={'Tidak ditemukan apapun disini'} />

  let x = _EventDetail.data?.data;
  let mulai = dayjs(Number(x.event_release)).format('DD MMMM');
  let selesai = dayjs(Number(x.event_finish)).format('DD MMMM');
  let share_pesan = `Ikuti event terbaru *${x.event_name}* yang fantastik! Akan di mulai pada *${mulai}* sampai dengan *${selesai}*. Jangan sampai ketinggalan! klik link dibawah untuk info lebih lanjut.`
  let share_link = decodeURI(`https://eveer.vercel.app${path}`)

  return (
    <>
      <EventHead 
        event_name={x.event_name}
        event_kecamatan={x.event_kecamatan}
        event_thumbnail={x.event_thumbnail}
        desc={share_pesan}
       />
      <Layouts className={'px-4 sm:px-10'}>
        <div className="flex flex-col max-w-3xl mx-auto w-full">
          <main>
            <div className="mb-4 md:mb-0 w-full mx-auto relative h-[620px]">
              <div className="absolute bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.7))] left-0 bottom-0 w-full h-full z-10" />
              <img src={x.event_thumbnail}
                className="absolute rounded-xl left-0 top-0 w-full h-full z-0 object-cover"
              />
              <div className="p-3 md:p-5 absolute bottom-0 left-0 z-20">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 leading-tight">
                  {x.event_name}
                </h2>
                <div className="flex mt-3">
                  <div>
                    <p className="font-semibold text-gray-200 text-sm">
                      Dipublikasi pada,
                    </p>
                    <p className="font-semibold text-gray-400 text-xs">
                      {dayjs(x.createdAt).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between mt-5">
              <h2 className='flex items-center gap-3 font-semibold'>
                <LuForward className='stroke-[2.5]' />
                Bagikan Event
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <FacebookShareButton title={decodeURI(share_pesan)} url={share_link}>
                  <h2 className="flex items-center gap-2 px-2.5 bg-blue-600 text-white border-back button-border small">
                    <LuFacebook className="fill-white" />
                    Facebook
                  </h2>
                </FacebookShareButton>
                <TwitterShareButton title={decodeURI(share_pesan)} url={share_link}>
                  <h2 className="flex items-center gap-2 px-2.5 bg-sky-500 text-white border-back button-border small">
                    <LuTwitter className="fill-white" />
                    Twitter
                  </h2>
                </TwitterShareButton>
                <WhatsappShareButton title={decodeURI(share_pesan)} url={share_link}>
                  <h2 className="flex items-center gap-2 px-2.5 bg-green-600 text-white border-back button-border small">
                    <AiOutlineWhatsApp />
                    WhatsApp
                  </h2>
                </WhatsappShareButton>
              </div>
            </div>
            <div className="text-sm md:text-base flex flex-wrap gap-10 mt-8">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Event status</h2>
                <h2 className={`${statusColor(x.event_status)} rounded-md uppercase text-xs small !w-fit !border-back font-medium !px-2 !py-0.5`}>
                  {statusDisplay(x.event_status)}
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Event di mulai</h2>
                <h2 className="text-sm">{dayjs(Number(x.event_release)).format("DD MMM YYYY")}</h2>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Event selesai</h2>
                <h2 className="text-sm">{dayjs(Number(x.event_finish)).format("DD MMM YYYY")}</h2>
              </div>
            </div>
            <div className="mt-8 text-gray-700 mx-auto text-lg leading-relaxed">
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                {x.event_name}
              </h1>
              <div className="text-[15.5px] md:text-base pb-6 mt-5 whitespace-pre-line text-pretty">
                <Highlight query={x.event_name}>
                  {x.event_description}
                </Highlight>
              </div>
            </div>
          </main>
        </div>
      </Layouts>
    </>
  )
};

export default EventDetailPage;
