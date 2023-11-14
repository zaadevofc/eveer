import { faCalendar, faCalendarAlt, faNewspaper, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faBookOpen, faDoorOpen, faInfoCircle, faList, faMapLocation, faMoneyBill, faUsersCog, faVolumeOff } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Template from '../../components/Template'
import { useKonfigurasiContext } from '../../context/KonfigurasiProvider'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useAuthContext } from '../../context/AuthProvider'

const Index = () => {
    const axios = useAxiosPrivate()
    const [data, setData] = useState({})
    const [event, setEvent] = useState(0)
    const [income, setIncome] = useState(0)
    const [user, setUser] = useState(0)
    const { deskripsiAplikasi } = useKonfigurasiContext()
    const { profil } = useAuthContext()
    const tanggalIndo = (tanggal) => {
        const bulan = [
            '',
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ]

        const pecahkan = tanggal.split('-');
        return `${pecahkan[2]} ${bulan[parseInt(pecahkan[1])]} ${pecahkan[0]}`;
    }
    useEffect(() => {
        const getUser = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/me`
            }).then((res) => {
                if (res.data?.id) {
                    setData(res.data)
                }
            }).catch((err) => {
                console.error(err)
            })
        }
        const getJumlah = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event?offset=0&limit=0`
            }).then((res) => {
                if (res.data?.totalData) {
                    setEvent(res.data.totalData)
                }
            }).catch((err) => {
                console.error(err)
            })
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/income?offset=0&limit=0`
            }).then((res) => {
                if (res.data?.totalData) {
                    setIncome(res.data.totalData)
                }
            }).catch((err) => {
                console.error(err)
            })
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account?offset=0&limit=0`
            }).then((res) => {
                if (res.data?.totalData) {
                    setUser(res.data.totalData)
                }
            }).catch((err) => {
                console.error(err)
            })
        }
        getUser()
        getJumlah()
    }, [])
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Template breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }]} header='Dashboard'>
                <div className="row mb-4">
                    <div className={`${profil.role === 'Admin' ? 'col-md-4' : 'col-md-6'} my-1`}>
                        <div className='card rounded-xl'>
                            <div className="card-body d-flex align-items-center gap-3">
                                <FontAwesomeIcon icon={faNewspaper} size={'3x'} />
                                <div>
                                    <h6>Event</h6>
                                    <h3 className='mb-0 fw-bolder text-primary'>{event}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${profil.role === 'Admin' ? 'col-md-4' : 'col-md-6'} my-1`}>
                        <div className='card rounded-xl'>
                            <div className="card-body d-flex align-items-center gap-3">
                                <FontAwesomeIcon icon={faMoneyBill} size={'3x'} />
                                <div>
                                    <h6>Income</h6>
                                    <h3 className='mb-0 fw-bolder text-primary'>{income}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {profil.role === 'Admin' && (
                        <div className="col-md-4 my-1">
                            <div className='card rounded-xl'>
                                <div className="card-body d-flex align-items-center gap-3">
                                    <FontAwesomeIcon icon={faUsersCog} size={'3x'} />
                                    <div>
                                        <h6>User</h6>
                                        <h3 className='mb-0 fw-bolder text-primary'>{user}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {Object.keys(data).length > 0 && (
                    <>
                        <div className="row">
                            <div className="col-md-12 my-1">
                                <div className="card">
                                    <div className="card-header pt-3 d-flex align-items-center justify-content-between">
                                        <h6 className='mb-0'><FontAwesomeIcon icon={faUserCircle} className='text-primary' />&nbsp; Informasi User ({data.role})</h6>
                                    </div>
                                    <div className="card-body d-block d-md-flex align-items-center gap-3">
                                        <img className='w-50 d-block mx-auto' src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/foto-profil/${data.gambar}`} alt="" />
                                        <table className='table table-borderless'>
                                            <tr>
                                                <th>Email Address</th>
                                                <td>{data.email}</td>
                                            </tr>
                                            <tr>
                                                <th>Nama Lengkap</th>
                                                <td>{data.namaLengkap}</td>
                                            </tr>
                                            <tr>
                                                <th>Role</th>
                                                <td>{data.role}</td>
                                            </tr>
                                            {(data.role === 'Siswa' || data.role === 'Guru') && (
                                                <>
                                                    {data.role === 'Siswa' && (
                                                        <>
                                                            <tr>
                                                                <th>NIS</th>
                                                                <td>{data.Siswa.nis}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>NISN</th>
                                                                <td>{data.Siswa.nisn}</td>
                                                            </tr>
                                                        </>
                                                    )}
                                                    {data.role === 'Guru' && (
                                                        <tr>
                                                            <th>NIP</th>
                                                            <td>{data.Guru.nip}</td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <th>Jenis Kelamin</th>
                                                        <td>{data[data.role].jenisKelamin}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tanggal Lahir</th>
                                                        <td>{tanggalIndo(data[data.role].tanggalLahir.split('T')[0])}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Nomor Ponsel</th>
                                                        <td>{data[data.role].nomorPonsel}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Template>
        </>
    )
}

export default Index