import Head from 'next/head'
import React, { Profiler, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import Template from '../../components/Template'
import { useAuthContext } from '../../context/AuthProvider'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Profil = () => {
    const axios = useAxiosPrivate()
    const inputRef = useRef()
    const { profil, setProfil } = useAuthContext()
    const [gambar, setGambar] = useState(null)
    const [namaLengkap, setNamaLengkap] = useState('')
    const [namaLengkapError, setNamaLengkapError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/change-profile`,
            data: {
                namaLengkap,
                email
            }
        }).then((res) => {
            if (res.data?.email) {
                Swal.fire('Berhasil', 'Profil Anda telah berhasil diubah!', 'success')
                setProfil(res.data)
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response?.status === 400) {
                if (error?.namaLengkap) {
                    setNamaLengkapError(error.namaLengkap)
                } else {
                    setNamaLengkapError('')
                }

                if (error?.email) {
                    setEmailError(error.email)
                } else {
                    setEmailError('')
                }
            }
        })
    }
    const handleUbahGambar = () => {
        inputRef.current.click()
    }
    const handleSubmitGambar = (e) => {
        setGambar(e.target.files[0])
    }
    const handleSubmitGambarAPI = async () => {
        const form = new FormData()
        form.append('gambar', gambar)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/ubah-foto-profil`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.email) {
                Swal.fire('Berhasil', 'Foto profil berhasil diubah!', 'success')
                setProfil(res.data)
            }
        }).catch((err) => {
            if (err.response?.status === 422) {
                Swal.fire('Error', err.response.data.message, 'error')
            }
        })
    }
    useEffect(() => {
        if (gambar) {
            handleSubmitGambarAPI()
        }
    }, [gambar])
    useEffect(() => {
        if (Object.keys(profil).length > 0) {
            setEmail(profil.email)
            setNamaLengkap(profil.namaLengkap)
        }
    }, [profil])
    return (
        <>
            <Head>
                <title>Profil</title>
            </Head>
            <Template header='Profil' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Configuration' }, { label: 'Profil', link: '/dashboard/profil' }]}>
                <form action="" onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-header pt-3 d-block d-md-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-start gap-2">
                                <img style={{ width: '70px', aspectRatio: '1/1', objectFit: 'cover' }} className='rounded-circle' src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/account/foto-profil/${profil.gambar}`} alt="" />
                                <div>
                                    <h6 className='mb-0 fw-bold'>{profil.namaLengkap}</h6>
                                    <small className='text-muted d-block'>{profil.role}</small>
                                </div>
                            </div>
                            <button type='button' onClick={() => handleUbahGambar()} className='btn btn-success btn-sm rounded-pill'>Ubah Gambar</button>
                            <input type="file" className='d-none' ref={inputRef} onChange={handleSubmitGambar} />
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="namaLengkap" className="mb-1">Nama Depan</label>
                                    <input type="text" className={`form-control ${namaLengkapError !== '' ? 'is-invalid' : ''}`} id="namaLengkap" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
                                    {namaLengkapError !== '' && (
                                        <div className="invalid-feedback">{namaLengkapError}</div>
                                    )}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="email" className="mb-1">Email Address</label>
                                    <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    {emailError !== '' && (
                                        <div className="invalid-feedback">{emailError}</div>
                                    )}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="role" className="mb-1">Role</label>
                                    <input type="text" className='form-control' id="role" value={profil.role} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                            <button type='submit' className='btn btn-primary'>Simpan</button>
                        </div>
                    </div>
                </form>
            </Template>
        </>
    )
}

export default Profil