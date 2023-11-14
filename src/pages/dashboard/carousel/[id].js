import Template from '../../../components/Template'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Ubah = () => {
    const router = useRouter();
    const { id } = router.query;
    const axiosPrivate = useAxiosPrivate();
    const submitRef = useRef();
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
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/carousel/${id}`,
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data?.id) {
                Swal.fire('Berhasil', 'Carousel berhasil diubah!', 'success').then(() => router.push('/dashboard/carousel'))
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
    const getData = async () => {
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/carousel/${id}`,
        }).then((res) => {
            const resBody = res.data;

            if (Object.keys(resBody).length > 0) {
                setPrioritas(resBody.prioritas)
            }
        })
    }
    useEffect(() => {
        if (id !== undefined) {
            getData()
        }
    }, [id])
    return (
        <React.Fragment>
            <Head>
                <title>Ubah Carousel</title>
            </Head>
            <Template header='Ubah Carousel' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Carousel', link: '/dashboard/carousel' }, { label: 'Ubah Carousel', link: `/dashboard/carousel/ubah/${id}` }]} breadCrumbRightContent={
                <Link href='/dashboard/carousel' className='btn btn-secondary rounded-xl'>
                    <FontAwesomeIcon icon={faAngleLeft} />&nbsp; Kembali
                </Link>
            }>
                <div className="card">
                    <form action="" encType='multipart/form-data' onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="prioritas" className="mb-1">Prioritas <span className="text-danger">*</span></label>
                                <input type="prioritas" id='prioritas' className={`form-control ${prioritasError !== '' ? 'is-invalid' : ''}`} onChange={(e) => setPrioritas(e.target.value)} value={prioritas} required />
                                {prioritasError !== '' && (
                                    <div className="invalid-feedback">{prioritasError}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gambar" className="mb-1">Gambar</label>
                                <input type="file" id='gambar' className={`form-control ${gambarError !== '' ? 'is-invalid' : ''}`} onChange={(e) => setGambar(e.target.files[0])} />
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

export default Ubah