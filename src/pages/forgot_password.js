import Head from 'next/head'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import styles from '../../styles/pages/index.module.css'
import { useKonfigurasiContext } from '../context/KonfigurasiProvider';
import Launcher from '../components/Launcher';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const ForgotPassword = ({ konfigurasi }) => {
    const { namaAplikasi, logoAplikasi, gambarAplikasi } = useKonfigurasiContext()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()

        const sendReset = async () => {
            await axios({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/auth/reset-password`,
                data: { email }
            }).then((res) => {
                if (res.status === 201) {
                    Swal.fire('Berhasil', 'Permintaan reset password berhasil. Silahkan cek inbox pada email Anda!', 'success')
                    setEmail('')
                    setEmailError('')
                }
            }).catch((err) => {
                const error = err.response.data

                if (err.response.status == 422) {
                    setEmailError('Email doesn\'t exists')
                } else {
                    if (error.statusCode === 400) {
                        if (error.email) {
                            setEmailError(error.email)
                        } else {
                            setEmailError('')
                        }
                    }
                }
            })
        }

        sendReset()
    }
    return (
        <>
            <Head>
                <title>{`Forgot Password | ${konfigurasi.namaAplikasi}`}</title>
                <meta name="description" content={konfigurasi.deskripsiAplikasi} />
            </Head>
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
                                        <div className="mb-3">
                                            <label className='mb-1' htmlFor="email">Email Address</label>
                                            <div className="input-group">
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </div>
                                                <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} id='email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                                                {emailError !== '' && (
                                                    <div className="invalid-feedback">{emailError}</div>
                                                )}
                                            </div>
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
        </>
    )
}

export async function getStaticProps() {
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
            konfigurasi: res,
        },
        revalidate: 600
    }
}

export default ForgotPassword