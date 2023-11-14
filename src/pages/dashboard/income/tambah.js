
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Template from '../../../components/Template'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Tambah = () => {
    const router = useRouter()
    const axios = useAxiosPrivate()
    const [listEvent, setListEvent] = useState([])
    const [eventId, setEventId] = useState('')
    const [eventIdError, setEventIdError] = useState('')
    const [jumlah, setJumlah] = useState('')
    const [jumlahError, setJumlahError] = useState('')
    const [tanggal, setTanggal] = useState('')
    const [tanggalError, setTanggalError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/income`,
            data: {
                eventId,
                jumlah,
                tanggal
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Berhasil', 'Income berhasil ditambahkan!', 'success').then((res) => {
                    router.push('/dashboard/income')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.eventId) {
                    setEventIdError(error.eventId)
                } else {
                    setEventIdError('')
                }

                if (error?.jumlah) {
                    setJumlahError(error.jumlah)
                } else {
                    setJumlahError('')
                }

                if (error?.tanggal) {
                    setTanggalError(error.tanggal)
                } else {
                    setTanggalError('')
                }
            }
        })
    }
    const getEvent = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event?offset=0&limit=99999`,
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
                <title>Tambah Income</title>
            </Head>
            <Template header='Tambah Income' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Income', link: '/dashboard/income' }, { label: 'Tambah Income', link: '/dashboard/income/tambah' }]} breadCrumbRightContent={
                <Link href='/dashboard/income' className='btn btn-secondary rounded-xl'>
                    <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Kembali
                </Link>
            }>
                <form action="" onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="eventId" className="mb-1">Event <span className="text-danger">*</span></label>
                                <select className={`form-control ${eventIdError !== '' ? 'is-invalid' : ''}`} id='eventId' value={eventId} onChange={(e) => setEventId(e.target.value)} required>
                                    <option value="" selected hidden disabled>-- Pilih Event --</option>
                                    {listEvent.map((val) => (
                                        <option value={val.id}>{val.nama}</option>
                                    ))}
                                </select>
                                {eventIdError !== '' && (
                                    <div className="invalid-feedback">{eventIdError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="jumlah" className="mb-1">Jumlah <span className="text-danger">*</span></label>
                                <input type='number' className={`form-control ${jumlahError !== '' ? 'is-invalid' : ''}`} id='jumlah' value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
                                {jumlahError !== '' && (
                                    <div className="invalid-feedback">{jumlahError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tanggal" className="mb-1">Tanggal <span className="text-danger">*</span></label>
                                <input type='date' className={`form-control ${tanggalError !== '' ? 'is-invalid' : ''}`} id='tanggal' value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                {tanggalError !== '' && (
                                    <div className="invalid-feedback">{tanggalError}</div>
                                )}
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="clearfix">
                                <button type='submit' className='btn btn-primary float-end'>Simpan</button>
                            </div>
                        </div>
                    </div>
                </form>
            </Template>
        </>
    )
}

export default Tambah