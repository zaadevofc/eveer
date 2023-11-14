import Head from 'next/head'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import styles from '../../styles/pages/index.module.css'
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Launcher from '../components/Launcher';
import { useKonfigurasiContext } from '../context/KonfigurasiProvider';

const ResetPassword = ({ token, permission, konfigurasi }) => {
    const router = useRouter()
    const buttonRef = useRef()
    const { namaAplikasi, logoAplikasi, gambarAplikasi } = useKonfigurasiContext()
    const [passwordBaru, setPasswordBaru] = useState('')
    const [passwordBaruError, setPasswordBaruError] = useState('')
    const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState('')
    const [konfirmasiPasswordBaruError, setKonfirmasiPasswordBaruError] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()

        const sendReset = async () => {
            await axios({
                method: 'PATCH',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/auth/reset-password`,
                data: {
                    token,
                    passwordBaru,
                    konfirmasiPasswordBaru
                }
            }).then((res) => {
                if (res.data?.id) {
                    Swal.fire('Berhasil', 'Password Anda sudah berhasil direset. Anda akan diarahkan ke halaman utama dalam 5 detik!', 'success')
                    setPasswordBaru('')
                    setPasswordBaruError('')
                    setKonfirmasiPasswordBaru('')
                    setKonfirmasiPasswordBaruError('')
                    setTimeout(() => {
                        router.push('/')
                    }, 5000)
                }
            }).catch((err) => {
                const error = err.response.data

                if (error.statusCode === 400) {
                    if (error.passwordBaru) {
                        setPasswordBaruError(error.passwordBaru)
                    } else {
                        setPasswordBaruError('')
                    }

                    if (error.konfirmasiPasswordBaru) {
                        setKonfirmasiPasswordBaruError(error.konfirmasiPasswordBaru)
                    } else {
                        setKonfirmasiPasswordBaruError('')
                    }
                }
            })
        }

        sendReset()
    }
    return (
        <>
            <Head>
                <title>{`Reset Password | ${konfigurasi.namaAplikasi}`}</title>
                <meta name="description" content={konfigurasi.deskripsiAplikasi} />
            </Head>
            {permission === true && (
                <Launcher>
                    <div className={`${styles.container} container w-100`}>
                        <div className="card overflow-hidden rounded-3 shadow border-0 w-100">
                            <div className="card-body p-0">
                                <div className="d-block d-md-flex align-items-center">
                                    <div className={styles.gambar} style={{ background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${process.env.NEXT_PUBLIC_RESTFUL_API}/konfigurasi/gambar/${gambarAplikasi}) center` }} alt="">
                                        <h4 className={styles.nama}>{namaAplikasi}</h4>
                                    </div>
                                    <div className='w-100 py-4 px-3'>
                                        <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/konfigurasi/gambar/${logoAplikasi}`} className='w-25 mx-auto d-block' alt="" />
                                        <h5 className='text-center text-muted mb-3'>Lupa Password</h5>
                                        <form action="" onSubmit={handleSubmit}>
                                            <div>
                                                <label className='mb-1'>Password Baru</label>
                                                <input type='password' onChange={(e) => setPasswordBaru(e.target.value)} value={passwordBaru} className={`form-control ${passwordBaruError != '' && 'is-invalid'}`} />
                                                {passwordBaruError != '' && (<div className='invalid-feedback'>{passwordBaruError}</div>)}
                                            </div>
                                            <div className='mt-4 mb-3'>
                                                <label className='mb-1'>Konfirmasi Password Baru</label>
                                                <input type='password' onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)} value={konfirmasiPasswordBaru} className={`form-control ${konfirmasiPasswordBaruError != '' && 'is-invalid'}`} />
                                                {konfirmasiPasswordBaruError != '' && (<div className='invalid-feedback'>{konfirmasiPasswordBaruError}</div>)}
                                            </div>
                                            <div className="clearfix">
                                                <button type='submit' className='btn btn-primary float-end w-100 rounded-pill fw-bold'>Reset</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Launcher>
            )}
        </>
    )
}

export async function getServerSideProps(context) {
    const { token } = context.query
    let permission = false
    await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/auth/check-reset-password-token`,
        data: {
            token
        }
    }).then((res) => {
        if (res.data?.userId) {
            permission = true
        }
    }).catch((err) => {
        console.error(err)
    })
    const res = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/konfigurasi?nama[]=nama_aplikasi&nama[]=deskripsi_aplikasi`
    }).then((res) => {
        let konfigurasi = {}

        if (res.data?.length > 0) {
            res.data.map((val) => {
                if (val.nama === 'nama_aplikasi') konfigurasi = { ...konfigurasi, ...{ namaAplikasi: val.nilai } }
                if (val.nama === 'deskripsi_aplikasi') konfigurasi = { ...konfigurasi, ...{ deskripsiAplikasi: val.nilai } }
            })
        }

        return konfigurasi
    })

    return {
        props: {
            token,
            permission,
            konfigurasi: res
        }
    }
}

export default ResetPassword