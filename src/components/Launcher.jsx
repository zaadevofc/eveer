import React, { useEffect } from 'react'
import axios from '../api/axios'
import { useKonfigurasiContext } from '../context/KonfigurasiProvider'
import Head from 'next/head'

const Launcher = ({ children }) => {
    const { namaAplikasi, setNamaAplikasi, logoAplikasi, setLogoAplikasi, gambarAplikasi, setGambarAplikasi, deskripsiAplikasi, setDeskripsiAplikasi, semesterAjaran, setSemesterAjaran } = useKonfigurasiContext()
    useEffect(() => {
        const getKonfigurasi = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API}/konfigurasi?nama[]=nama_aplikasi&nama[]=logo_aplikasi&nama[]=gambar_aplikasi&nama[]=deskripsi_aplikasi&nama[]=semester_ajaran`
            }).then((res) => {
                if (res.data?.length > 0) {
                    res.data.map((val) => {
                        if (val.nama === 'nama_aplikasi') setNamaAplikasi(val.nilai)
                        if (val.nama === 'logo_aplikasi') setLogoAplikasi(val.nilai)
                        if (val.nama === 'gambar_aplikasi') setGambarAplikasi(val.nilai)
                        if (val.nama === 'deskripsi_aplikasi') setDeskripsiAplikasi(val.nilai)
                        if (val.nama === 'semester_ajaran') setSemesterAjaran(val.nilai)
                    })
                }
            }).catch((err) => {
                console.error(err)
            })
        }

        if (namaAplikasi === '' || logoAplikasi === '' || deskripsiAplikasi === '') {
            getKonfigurasi()
        }
    }, [namaAplikasi, logoAplikasi, deskripsiAplikasi])
    return (
        <>
            <Head>
                <link rel="shortcut icon" href={`${process.env.NEXT_PUBLIC_RESTFUL_API}/konfigurasi/gambar/${logoAplikasi}`} type="image/x-icon" />
            </Head>
            {children}
        </>
    )
}

export default Launcher