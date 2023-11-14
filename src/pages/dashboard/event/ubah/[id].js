
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Template from '../../../../components/Template'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Editor } from '@tinymce/tinymce-react'

const Ubah = () => {
    const router = useRouter()
    const { id } = router.query
    const axios = useAxiosPrivate()
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const deskripsiRef = useRef()
    const [deskripsi, setDeskripsi] = useState('')
    const [deskripsiError, setDeskripsiError] = useState('')
    const [nagari, setNagari] = useState('')
    const [nagariError, setNagariError] = useState('')
    const [tanggalMulai, setTanggalMulai] = useState('')
    const [tanggalMulaiError, setTanggalMulaiError] = useState('')
    const [tanggalSelesai, setTanggalSelesai] = useState('')
    const [tanggalSelesaiError, setTanggalSelesaiError] = useState('')
    const [status, setStatus] = useState('')
    const [statusError, setStatusError] = useState('')
    const [gambar, setGambar] = useState('')
    const [gambarError, setGambarError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = new FormData()
        form.append('nama', nama)
        form.append('deskripsi', deskripsiRef.current.getContent())
        form.append('nagari', nagari)
        form.append('tanggalMulai', tanggalMulai)
        form.append('tanggalSelesai', tanggalSelesai)
        form.append('status', status)

        if (gambar !== '' && gambar !== null) {
            form.append('gambar', gambar)
        }

        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event/${id ? id : ''}`,
            data: form,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Berhasil', 'Event berhasil diubah!', 'success').then((res) => {
                    router.push('/dashboard/event')
                })
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.nama) {
                    setNamaError(error.nama)
                } else {
                    setNamaError('')
                }

                if (error?.deskripsi) {
                    setDeskripsiError(error.deskripsi)
                } else {
                    setDeskripsiError('')
                }

                if (error?.nagari) {
                    setNagariError(error.nagari)
                } else {
                    setNagariError('')
                }

                if (error?.gambar) {
                    setGambarError(error.gambar)
                } else {
                    setGambarError('')
                }

                if (error?.tanggalMulai) {
                    setTanggalMulaiError(error.tanggalMulai)
                } else {
                    setTanggalMulaiError('')
                }

                if (error?.tanggalSelesai) {
                    setTanggalSelesaiError(error.tanggalSelesai)
                } else {
                    setTanggalSelesaiError('')
                }

                if (error?.status) {
                    setStatusError(error.status)
                } else {
                    setStatusError('')
                }
            }
        })
    }

    useEffect(() => {
        const getData = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/event/${id ? id : ''}`,
            }).then((res) => {
                if (res.data?.id) {
                    setNama(res.data.nama)
                    setDeskripsi(res.data.deskripsi)
                    setNagari(res.data.nagari)
                    setTanggalMulai(res.data.tanggalMulai)
                    setTanggalSelesai(res.data.tanggalSelesai)
                    setStatus(res.data.status)
                }
            }).catch((err) => {
                console.error(err)
            })
        }
        getData()
    }, [id])
    return (
        <>
            <Head>
                <title>Ubah Event</title>
            </Head>
            <Template header='Ubah Event' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Event', link: '/dashboard/event' }, { label: 'Ubah Event', link: `/dashboard/event/ubah/${id}` }]} breadCrumbRightContent={
                <Link href='/dashboard/event' className='btn btn-secondary rounded-xl'>
                    <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Kembali
                </Link>
            }>
                <form action="" onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="nama" className="mb-1">Nama <span className="text-danger">*</span></label>
                                <input type='text' className={`form-control ${namaError !== '' ? 'is-invalid' : ''}`} id='nama' value={nama} onChange={(e) => setNama(e.target.value)} required />
                                {namaError !== '' && (
                                    <div className="invalid-feedback">{namaError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deskripsi" className="mb-1">Deskripsi <span className="text-danger">*</span></label>
                                <Editor
                                    key={1}
                                    apiKey='9iem6r5b3z4jb4wphkcm5oigo5hxd7i4q70d53lmlylhd4gq'
                                    onInit={(_, editor) => deskripsiRef.current = editor}
                                    initialValue={deskripsi}
                                    init={{
                                        height: 150,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                                {deskripsiError !== '' && (
                                    <div className="invalid-feedback">{deskripsiError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nagari" className="mb-1">Nagari <span className="text-danger">*</span></label>
                                <input type='text' className={`form-control ${nagariError !== '' ? 'is-invalid' : ''}`} id='nagari' value={nagari} onChange={(e) => setNagari(e.target.value)} required />
                                {nagariError !== '' && (
                                    <div className="invalid-feedback">{nagariError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tanggalMulai" className="mb-1">Tanggal Mulai <span className="text-danger">*</span></label>
                                <input type='date' className={`form-control ${tanggalMulaiError !== '' ? 'is-invalid' : ''}`} id='tanggalMulai' value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
                                {tanggalMulaiError !== '' && (
                                    <div className="invalid-feedback">{tanggalMulaiError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tanggalSelesai" className="mb-1">Tanggal Selesai <span className="text-danger">*</span></label>
                                <input type='date' className={`form-control ${tanggalSelesaiError !== '' ? 'is-invalid' : ''}`} id='tanggalSelesai' value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} required />
                                {tanggalSelesaiError !== '' && (
                                    <div className="invalid-feedback">{tanggalSelesaiError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="mb-1">Status <span className="text-danger">*</span></label>
                                <select className={`form-control ${statusError !== '' ? 'is-invalid' : ''}`} id='status' value={status} onChange={(e) => setStatus(e.target.value)} required>
                                    <option value="" selected hidden disabled>-- Pilih Status --</option>
                                    <option value="Belum Dilaksanakan">Belum Dilaksanakan</option>
                                    <option value="Berlangsung">Berlangsung</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                                {statusError !== '' && (
                                    <div className="invalid-feedback">{statusError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gambar" className="mb-1">Gambar</label>
                                <input type='file' className={`form-control ${gambarError !== '' ? 'is-invalid' : ''}`} id='gambar' onChange={(e) => setGambar(e.target.files[0])} />
                                {gambarError !== '' && (
                                    <div className="invalid-feedback">{gambarError}</div>
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

export default Ubah