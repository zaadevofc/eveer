import Head from 'next/head'
import React, { Profiler, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import Template from '../../components/Template'
import { useKonfigurasiContext } from '../../context/KonfigurasiProvider'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const Profil = () => {
    const axios = useAxiosPrivate()
    const logoRef = useRef()
    const gambarRef = useRef()
    const { namaAplikasi, setNamaAplikasi, logoAplikasi, setLogoAplikasi, gambarAplikasi, setGambarAplikasi, deskripsiAplikasi, setDeskripsiAplikasi } = useKonfigurasiContext()
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [deskripsiError, setDeskripsiError] = useState('')
    const [gambar, setGambar] = useState(null)
    const [tipeUpload, setTipeUpload] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const namaAplikasiProcess = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/konfigurasi`,
            data: {
                upsert: [{
                    nama: 'nama_aplikasi',
                    nilai: nama
                }]
            }
        }).then((res) => {
            if (res.data[0]?.nama) {
                return true
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response?.status === 400) {
                if (error?.nilai) {
                    setNamaError(error.nilai)
                } else {
                    setNamaError('')
                }
            }
        })
        const deskripsiAplikasiProcess = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/konfigurasi`,
            data: {
                upsert: [{
                    nama: 'deskripsi_aplikasi',
                    nilai: deskripsi
                }]
            }
        }).then((res) => {
            if (res.data[0]?.nama) {
                return true
            }
        }).catch((err) => {
            const error = err.response.data

            if (err.response?.status === 400) {
                if (error?.nilai) {
                    setDeskripsiError(error.nilai)
                } else {
                    setDeskripsiError('')
                }
            }
        })

        if (namaAplikasiProcess && deskripsiAplikasiProcess) {
            Swal.fire('Berhasil', 'Pengaturan website berhasil disimpan!', 'success')
            setNamaAplikasi(nama)
            setDeskripsiAplikasi(deskripsi)
        } else if (namaAplikasiProcess || deskripsiAplikasiProcess) {
            Swal.fire('Peringatan', 'Sebagian pengaturan website berhasil disimpan. Namun masih ada yang belum tersimpan', 'warning')
        } else {
            Swal.fire('Error', 'Terjadi kesalahan pada sistem', 'error')
        }
    }
    const handleUbahGambar = async (tipe) => {
        setTipeUpload(tipe)

        if (tipe === 'logo_aplikasi') {
            logoRef.current.click()
        } else {
            gambarRef.current.click()
        }
    }
    const handleSubmitGambar = (e) => {
        setGambar(e.target.files[0])
    }
    const handleSubmitGambarAPI = async () => {
        const form = new FormData()
        form.append('gambar', gambar)
        form.append('nama', tipeUpload)
        await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/konfigurasi/gambar`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data[0]?.nilai) {
                Swal.fire('Berhasil', (tipeUpload === 'logo_aplikasi' ? 'Logo aplikasi' : 'Wallpaper aplikasi') + ' berhasil diubah!', 'success')

                if (res.data[0]?.nama === 'logo_aplikasi') {
                    setLogoAplikasi(res.data[0].nilai)
                } else {
                    setGambarAplikasi(res.data[0].nilai)
                }
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
        setNama(namaAplikasi)
        setDeskripsi(deskripsiAplikasi)
    }, [namaAplikasi, deskripsiAplikasi])
    return (
        <>
            <Head>
                <title>Pengaturan Website</title>
            </Head>
            <Template header='Pengaturan Website' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Configuration' }, { label: 'Pengaturan Website', link: '/dashboard/pengaturan-website' }]} >
                <div className="row">
                    <div className="col-md-8">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="card my-2">
                                <div className="card-header pt-3 d-block d-md-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-start gap-2">
                                        <img style={{ width: '70px', aspectRatio: '1/1', objectFit: 'cover' }} className='rounded-circle' src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/konfigurasi/gambar/${logoAplikasi}`} alt="" />
                                        <div>
                                            <h6 className='mb-0 fw-bold'>{namaAplikasi}</h6>
                                            <small className='text-muted d-block'>{deskripsiAplikasi}</small>
                                        </div>
                                    </div>
                                    <button type='button' onClick={() => handleUbahGambar('logo_aplikasi')} className='btn btn-success btn-sm rounded-pill' style={{ whiteSpace: 'nowrap' }}>Ubah Gambar</button>
                                    <input type="file" className='d-none' ref={logoRef} onChange={handleSubmitGambar} />
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="nama" className="mb-1">Nama Aplikasi</label>
                                            <input type="text" className={`form-control ${namaError !== '' ? 'is-invalid' : ''}`} id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                            {namaError !== '' && (
                                                <div className="invalid-feedback">{namaError}</div>
                                            )}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="deskripsi" className="mb-1">Deskripsi Aplikasi</label>
                                            <textarea className={`form-control ${deskripsiError !== '' ? 'is-invalid' : ''}`} id="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required></textarea>
                                            {deskripsiError !== '' && (
                                                <div className="invalid-feedback">{deskripsiError}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-end">
                                    <button type='submit' className='btn btn-primary'>Simpan</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <div className="card my-2">
                            <div className="card-header pt-3">
                                <h6 className='mb-0'><FontAwesomeIcon icon={faImage} />&nbsp; Wallpaper</h6>
                            </div>
                            <div className="card-body">
                                <img className='w-100' style={{ aspectRatio: 12 / 9, objectFit: 'cover' }} src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/konfigurasi/gambar/${gambarAplikasi}`} alt="" />
                                <input type="file" onClick={() => handleUbahGambar('gambar_aplikasi')} ref={gambarRef} onChange={handleSubmitGambar} className='form-control mt-3' />
                            </div>
                        </div>
                    </div>
                </div>
            </Template >
        </>
    )
}

export default Profil