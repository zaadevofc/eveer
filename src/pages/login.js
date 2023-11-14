import { faKey, faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../context/AuthProvider'
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import styles from '../../styles/pages/index.module.css'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { useKonfigurasiContext } from '../context/KonfigurasiProvider'
import Launcher from '../components/Launcher'
import Link from 'next/link'
import Swal from 'sweetalert2'
import ReactDOMServer from 'react-dom/server';

const Index = ({ konfigurasi }) => {
    const router = useRouter()
    const buttonRef = useRef()
    const { namaAplikasi, logoAplikasi, gambarAplikasi } = useKonfigurasiContext()
    const { auth, setAuth, profil, setProfil } = useAuthContext()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const getProfilDiri = async (token) => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API}/account/me`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            if (res.data?.id) {
                setProfil(res.data)

                if (res.data.role === 'Admin' || res.data.role === 'Panitia') {
                    router.push('/dashboard')
                } else {
                    router.push('/')
                }
            } else {
                deleteCookie('accessToken')
                setAuth('')
            }
        }).catch((err) => {
            console.error(err)
            deleteCookie('accessToken')
            setAuth('')
        })
    }
    useEffect(() => {
        if (Object.keys(profil).length > 0) {
            if (auth !== '') {
                if (profil.role === 'Admin' || profil.role === 'Panitia') {
                    router.push('/dashboard')
                } else {
                    router.push('/')
                }
            } else {
                const accessToken = getCookie('accessToken')

                if (accessToken) {
                    if (profil.role === 'Admin' || profil.role === 'Panitia') {
                        router.push('/dashboard')
                    } else {
                        router.push('/')
                    }
                }
            }
        } else {
            if (auth !== '') {
                getProfilDiri(auth)
            }
        }
    }, [auth])

    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/auth/login`,
            data: { email, password }
        }).then(async (res) => {
            if (res.data?.access_token) {
                setAuth(res.data.access_token)
                setCookie('accessToken', res.data.access_token, { maxAge: 86400 * 30 })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.email) {
                    setEmailError(error.email)
                } else {
                    setEmailError('')
                }

                if (error?.password) {
                    setPasswordError(error.password)
                } else {
                    setPasswordError('')
                }
            } else if (err.response?.status === 403) {
                Swal.fire('Gagal', 'Email address atau password yang Anda masukkan salah!', 'error')
            }
        }).finally(() => {
            buttonRef.current.disabled = false
            buttonRef.current.innerHTML = 'Login'
        })
    }

    return (
        <>
            <Head>
                <title>{`Login | ${konfigurasi.namaAplikasi}`}</title>
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
                                    <h5 className='text-center text-muted mb-3'>Masuk ke Dalam Aplikasi</h5>
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
                                        <div className="mb-3">
                                            <label className='mb-1' htmlFor="password">Password</label>
                                            <div className="input-group">
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faKey} />
                                                </div>
                                                <input type="password" className={`form-control ${passwordError !== '' ? 'is-invalid' : ''}`} id='password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                                                {passwordError !== '' && (
                                                    <div className="invalid-feedback">{passwordError}</div>
                                                )}
                                            </div>
                                            <div className="clearfix">
                                                <Link href='/forgot_password' legacyBehavior>
                                                    <a className='float-end'>
                                                        <small>Lupa password?</small>
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="clearfix">
                                            <button type='submit' ref={buttonRef} className='btn btn-primary float-end w-100 rounded-pill fw-bold'>Login</button>
                                        </div>
                                    </form>
                                    <small className='d-block mt-3 text-center'>Belum Memiliki Akun? <Link href="/registrasi">Daftar Sekarang</Link></small>
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
export default Index