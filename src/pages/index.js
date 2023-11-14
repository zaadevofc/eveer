import React, { useEffect, useState } from 'react'
import Template from '../components/TemplateLanding'
import Head from 'next/head'
import EventCard from '../components/EventCard'
import axios from '../api/axios'

const index = () => {
    const [listEvent, setListEvent] = useState([])
    const getEvent = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event`,
        }).then((res) => {
            if (res.data?.data) {
                setListEvent(res.data.data)
            }
        })
    }
    useEffect(() => {
        getEvent()
    }, [])
    return (
        <>
            <Head>
                <title>Beranda</title>
            </Head>
            <Template>
                <h2 className='text-black mt-4 text-center'>Event</h2>
                {listEvent.length > 0 && listEvent.map((val) => (
                    <div className="my-3">
                        <EventCard id={val.id} gambar={val.gambar} deskripsi={val.deskripsi} event={val.nama} tanggal={`${val.tanggalMulai} s/d ${val.tanggalSelesai}`} />
                    </div>
                ))}
            </Template>
        </>
    )
}

export default index