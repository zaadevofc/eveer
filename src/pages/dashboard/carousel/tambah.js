import Template from '../../../components/Template'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import React, { useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Tambah = () => {
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();
    const [prioritas, setPrioritas] = useState('');
    const [prioritasError, setPrioritasError] = useState('');
    const [gambar, setGambar] = useState(null);
    const [gambarError, setGambarError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData()
        data.append('prioritas', prioritas)

        if (gambar !== null) {
            data.append('gambar', gambar)
        }

        await axiosPrivate({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/carousel`,
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Berhasil', 'Carousel berhasil ditambahkan!', 'success').then(() => router.push('/dashboard/carousel'))
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.prioritas) {
                    setPrioritasError(error.prioritas)
                } else {
                    setPrioritasError('')
                }

                if (error?.gambar) {
                    setGambarError(error.gambar)
                } else {
                    setGambarError('')
                }
            }
        })
    }
    return (
        <React.Fragment>
            <Head>
                <title>Tambah Carousel</title>
            </Head>
            <Template header='Tambah Carousel' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Carousel', link: '/dashboard/carousel' }, { label: 'Tambah Carousel', link: '/dashboard/carousel/tambah' }]} breadCrumbRightContent={
                <Link href='/dashboard/carousel' className='btn btn-secondary rounded-xl'>
                    <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Kembali
                </Link>
            }>
                <div className="card">
                    <form action="" encType='multipart/form-data' onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="prioritas" className="mb-1">Prioritas <span className="text-danger">*</span></label>
                                <input type="number" id='prioritas' className={`form-control ${prioritasError !== '' ? 'is-invalid' : ''}`} onChange={(e) => setPrioritas(e.target.value)} value={prioritas} required />
                                {prioritasError !== '' && (
                                    <div className="invalid-feedback">{prioritasError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gambar" className="mb-1">Gambar <span className="text-danger">*</span></label>
                                <input type="file" id='gambar' className={`form-control ${gambarError !== '' ? 'is-invalid' : ''}`} onChange={(e) => setGambar(e.target.files[0])} required />
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
                    </form>
                </div>
            </Template>
        </React.Fragment>
    )
}

export default Tambah