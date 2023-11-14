import { faEye, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import Template from '../../components/Template'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ReactDOMServer from 'react-dom/server';

const UbahPassword = () => {
    const axios = useAxiosPrivate()
    const buttonRef = useRef()
    const [passwordLama, setPasswordLama] = useState('')
    const [passwordLamaError, setPasswordLamaError] = useState('')
    const [passwordLamaSee, setPasswordLamaSee] = useState(false)
    const [passwordBaru, setPasswordBaru] = useState('')
    const [passwordBaruError, setPasswordBaruError] = useState('')
    const [passwordBaruSee, setPasswordBaruSee] = useState(false)
    const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState('')
    const [konfirmasiPasswordBaruError, setKonfirmasiPasswordBaruError] = useState('')
    const [konfirmasiPasswordBaruSee, setKonfirmasiPasswordBaruSee] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        buttonRef.current.disabled = true
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)

        if (passwordBaru == konfirmasiPasswordBaru) {
            await axios({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/user/ubah-password`,
                data: {
                    passwordLama,
                    passwordBaru,
                    konfirmasiPasswordBaru
                }
            }).then((res) => {
                if (res.data?.email) {
                    Swal.fire('Berhasil', 'Password telah berhasil diubah!', 'success')
                }
            }).catch((err) => {
                const error = err.response.data

                if (err.response?.status === 400) {
                    if (error?.passwordLama) {
                        setPasswordLamaError(error.passwordLama)
                    } else {
                        setPasswordLamaError('')
                    }

                    if (error?.passwordBaru) {
                        setPasswordBaruError(error.passwordBaru)
                    } else {
                        setPasswordBaruError('')
                    }

                    if (error?.konfirmasiPasswordBaru) {
                        setKonfirmasiPasswordBaruError(error.konfirmasiPasswordBaru)
                    } else {
                        setKonfirmasiPasswordBaruError('')
                    }
                }
            })
        } else {
            Swal.fire('Gagal', 'Periksa isian form!', 'error')
        }

        buttonRef.current.disabled = false
        buttonRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} />&nbsp; Simpan</>)
    }
    useEffect(() => {
        setPasswordLamaError('')

        if (passwordBaru !== konfirmasiPasswordBaru) {
            setKonfirmasiPasswordBaruError('konfirmasiPasswordBaru must be the same as passwordBaru')
        } else {
            setKonfirmasiPasswordBaruError('')
        }
    }, [passwordLama, passwordBaru, konfirmasiPasswordBaru])
    return (
        <>
            <Head>
                <title>Ubah Password</title>
            </Head>
            <Template header='Ubah Password' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Configuration' }, { label: 'Ubah Password', link: '/dashboard/ubah-password' }]}>
                <form action="" onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className='mb-3'>
                                <label className='mb-1'>Password Lama <span className="text-danger">*</span></label>
                                <div className='position-relative'>
                                    <input type={passwordLamaSee ? 'text' : 'password'} onChange={(e) => setPasswordLama(e.target.value)} value={passwordLama} className={`form-control ${passwordLamaError != '' ? 'is-invalid' : ''}`} required />
                                    <a href='#!' className='position-absolute' style={{ right: 10, top: '50%', transform: 'translate(0%, -50%)' }} onClick={() => setPasswordLamaSee(!passwordLamaSee)}><FontAwesomeIcon icon={faEye} className='text-muted' /></a>
                                </div>
                                {passwordLamaError != '' && (<div className='invalid-feedback'>{passwordLamaError}</div>)}
                            </div>
                            <div className='mb-3'>
                                <label className='mb-1'>Password Baru <span className="text-danger">*</span></label>
                                <div className='position-relative'>
                                    <input type={passwordBaruSee ? 'text' : 'password'} onChange={(e) => setPasswordBaru(e.target.value)} value={passwordBaru} className={`form-control ${passwordBaruError != '' ? 'is-invalid' : ''}`} required />
                                    <a href='#!' className='position-absolute' style={{ right: 10, top: '50%', transform: 'translate(0%, -50%)' }} onClick={() => setPasswordBaruSee(!passwordBaruSee)}><FontAwesomeIcon icon={faEye} className='text-muted' /></a>
                                </div>
                                {passwordBaruError != '' && (<div className='invalid-feedback'>{passwordBaruError}</div>)}
                            </div>
                            <div className='mb-3'>
                                <label className='mb-1'>Konfirmasi Password Baru <span className="text-danger">*</span></label>
                                <div className='position-relative'>
                                    <input type={konfirmasiPasswordBaruSee ? 'text' : 'password'} onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)} value={konfirmasiPasswordBaru} className={`form-control ${konfirmasiPasswordBaruError != '' ? 'is-invalid' : ''}`} required />
                                    <a href='#!' className='position-absolute' style={{ right: 10, top: '50%', transform: 'translate(0%, -50%)' }} onClick={() => setKonfirmasiPasswordBaruSee(!konfirmasiPasswordBaruSee)}><FontAwesomeIcon icon={faEye} className='text-muted' /></a>
                                </div>
                                {konfirmasiPasswordBaruError != '' && (<div className='invalid-feedback'>{konfirmasiPasswordBaruError}</div>)}
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                            <button type='submit' ref={buttonRef} className='btn btn-primary'><FontAwesomeIcon icon={faSave} />&nbsp; Simpan</button>
                        </div>
                    </div>
                </form>
            </Template>
        </>
    )
}

export default UbahPassword