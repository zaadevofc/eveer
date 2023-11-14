import { faPenAlt, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ModalBody from '../../../ModalBody'
import ReactDOMServer from 'react-dom/server'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const UbahModal = ({ id, modalRef, getData }) => {
    const submitRef = useRef();
    const axios = useAxiosPrivate()
    const [listMataPelajaranKelas, setListMataPelajaranKelas] = useState(null)
    const [nama, setNama] = useState(null)
    const [namaError, setNamaError] = useState('')
    const [mataPelajaranKelasId, setMataPelajaranKelasId] = useState(null)
    const [mataPelajaranKelasIdError, setMataPelajaranKelasIdError] = useState('')
    const [isWaktuPengerjaan, setIsWaktuPengerjaan] = useState('')
    const [isWaktuPengerjaanError, setIsWaktuPengerjaanError] = useState('')
    const [time, setTime] = useState('')
    const [timeError, setTimeError] = useState('')
    const [timeStart, setTimeStart] = useState('')
    const [timeStartError, setTimeStartError] = useState('')
    const [timeEnd, setTimeEnd] = useState('')
    const [timeEndError, setTimeEndError] = useState('')
    const [isAcakSoal, setIsAcakSoal] = useState('')
    const [isAcakSoalError, setIsAcakSoalError] = useState('')
    const [isShowNilai, setIsShowNilai] = useState('')
    const [isShowNilaiError, setIsShowNilaiError] = useState('')
    const [isTerbuka, setIsTerbuka] = useState('')
    const [isTerbukaError, setIsTerbukaError] = useState('')
    const [isPublish, setIsPublish] = useState('')
    const [isPublishError, setIsPublishError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        submitRef.current.disabled = true
        submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/ujian/${id}`,
            data: {
                nama,
                ...((isTerbuka === '0' && isTerbuka !== '') && { mataPelajaranKelasId }),
                ...(isWaktuPengerjaan !== '' && { isWaktuPengerjaan: Boolean(Number(isWaktuPengerjaan)) }),
                time,
                ...((isWaktuPengerjaan === '0' && isWaktuPengerjaan !== '') && { timeStart: new Date(timeStart) }),
                ...((isWaktuPengerjaan === '0' && isWaktuPengerjaan !== '') && { timeEnd: new Date(timeEnd) }),
                ...(isAcakSoal !== '' && { isAcakSoal: Boolean(Number(isAcakSoal)) }),
                ...(isShowNilai !== '' && { isShowNilai: Boolean(Number(isShowNilai)) }),
                ...(isTerbuka !== '' && { isTerbuka: Boolean(Number(isTerbuka)) }),
                ...(isPublish !== '' && { isPublish: Boolean(Number(isPublish)) }),
            }
        }).then((res) => {
            if (res.data?.id) {
                modalRef.hide()
                getData()
                Swal.fire('Berhasil', 'Ujian berhasil diubah!', 'success')
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (err.response?.status === 400) {
                    if (error?.nama) {
                        setNamaError(error.nama)
                    } else {
                        setNamaError('')
                    }

                    if (error?.mataPelajaranKelasId) {
                        setMataPelajaranKelasIdError(error.mataPelajaranKelasId)
                    } else {
                        setMataPelajaranKelasIdError('')
                    }

                    if (error?.isWaktuPengerjaan) {
                        setIsWaktuPengerjaanError(error.isWaktuPengerjaan)
                    } else {
                        setIsWaktuPengerjaanError('')
                    }

                    if (error?.time) {
                        setTimeError(error.time)
                    } else {
                        setTimeError('')
                    }

                    if (error?.timeEnd) {
                        setTimeEndError(error.timeEnd)
                    } else {
                        setTimeEndError('')
                    }

                    if (error?.timeStart) {
                        setTimeStartError(error.timeStart)
                    } else {
                        setTimeStartError('')
                    }

                    if (error?.isAcakSoal) {
                        setIsAcakSoalError(error.isAcakSoal)
                    } else {
                        setIsAcakSoalError('')
                    }

                    if (error?.isShowNilai) {
                        setIsShowNilaiError(error.isShowNilai)
                    } else {
                        setIsShowNilaiError('')
                    }

                    if (error?.isTerbuka) {
                        setIsTerbukaError(error.isTerbuka)
                    } else {
                        setIsTerbukaError('')
                    }

                    if (error?.isPublish) {
                        setIsPublishError(error.isPublish)
                    } else {
                        setIsPublishError('')
                    }
                }
            }
        }).finally(() => {
            submitRef.current.disabled = false
            submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</>)
        })
    }
    useEffect(() => {
        const getCurrentData = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/ujian/${id ? id : ''}`,
            }).then((res) => {
                if (res.data?.id) {
                    setNama(res.data.nama)
                    setMataPelajaranKelasId(res.data.mataPelajaranKelasId)
                    setIsWaktuPengerjaan(Number(res.data.isWaktuPengerjaan).toString())
                    setTime(res.data.time)
                    setTimeStart(res.data.timeStart)
                    setTimeEnd(res.data.timeEnd)
                    setIsAcakSoal(Number(res.data.isAcakSoal).toString())
                    setIsShowNilai(Number(res.data.isShowNilai).toString())
                    setIsTerbuka(Number(res.data.isTerbuka).toString())
                    setIsPublish(Number(res.data.isPublish).toString())
                    setNamaError('')
                    setMataPelajaranKelasIdError('')
                    setIsWaktuPengerjaanError('')
                    setTimeError('')
                    setTimeStartError('')
                    setTimeEndError('')
                    setIsAcakSoalError('')
                    setIsShowNilaiError('')
                    setIsTerbukaError('')
                    setIsPublishError('')
                }
            }).catch((err) => {
                console.error(err)
            })
        }

        if (id) {
            getCurrentData()
        }
    }, [id])
    useEffect(() => {
        if (isTerbuka === '0') {
            const getMataPelajaranKelas = async () => {
                await axios({
                    method: 'GET',
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/mata-pelajaran-kelas`,
                }).then((res) => {
                    if (res.data?.data) {
                        setListMataPelajaranKelas(res.data.data)
                    }
                })
            }

            getMataPelajaranKelas()
        }
    }, [isTerbuka])
    return (
        <ModalBody targetModal={'ubah'} size='xl' title={<h6 className='mb-0'><FontAwesomeIcon icon={faPenAlt} /> Ubah</h6>} footer={<button type='button' onClick={handleSubmit} ref={submitRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</button>}>
            <form action="" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nama" className="mb-1">Nama <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${namaError !== '' ? 'is-invalid' : ''}`} id='nama' value={nama} onChange={(e) => setNama(e.target.value)} required />
                        {namaError !== '' && (
                            <div className="invalid-feedback">{namaError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="isWaktuPengerjaan" className="mb-1">Menggunakan Waktu Pengerjaan? <span className="text-danger">*</span></label>
                        <select className={`form-control ${isWaktuPengerjaanError !== '' ? 'is-invalid' : ''}`} id='isWaktuPengerjaan' value={isWaktuPengerjaan} onChange={(e) => setIsWaktuPengerjaan(e.target.value)} required>
                            <option value="" selected hidden disabled>-- Pilih Opsi --</option>
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                        {isWaktuPengerjaanError !== '' && (
                            <div className="invalid-feedback">{isWaktuPengerjaanError}</div>
                        )}
                    </div>
                    {isWaktuPengerjaan == 1 && (
                        <div className="col-md-6 mb-3">
                            <label htmlFor="time" className="mb-1">Waktu Pengerjaan</label>
                            <input type="number" min={0} className={`form-control ${timeError !== '' ? 'is-invalid' : ''}`} id='time' value={time} onChange={(e) => setTime(e.target.value)} />
                            {timeError !== '' && (
                                <div className="invalid-feedback">{timeError}</div>
                            )}
                        </div>
                    )}
                    {(isWaktuPengerjaan == 0 && isWaktuPengerjaan != '') && (
                        <>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="timeStart" className="mb-1">Waktu Mulai <span className="text-danger">*</span></label>
                                <input type="date" className={`form-control ${timeStartError !== '' ? 'is-invalid' : ''}`} id='timeStart' value={timeStart} onChange={(e) => setTimeStart(e.target.value)} required />
                                {timeStartError !== '' && (
                                    <div className="invalid-feedback">{timeStartError}</div>
                                )}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="timeEnd" className="mb-1">Waktu Selesai <span className="text-danger">*</span></label>
                                <input type="date" className={`form-control ${timeEndError !== '' ? 'is-invalid' : ''}`} id='timeEnd' value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} required />
                                {timeEndError !== '' && (
                                    <div className="invalid-feedback">{timeEndError}</div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="isAcakSoal" className="mb-1">Soal Acak? <span className="text-danger">*</span></label>
                        <select className={`form-control ${isAcakSoalError !== '' ? 'is-invalid' : ''}`} id='isAcakSoal' value={isAcakSoal} onChange={(e) => setIsAcakSoal(e.target.value)} required>
                            <option value="" selected hidden disabled>-- Pilih Opsi --</option>
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                        {isAcakSoalError !== '' && (
                            <div className="invalid-feedback">{isAcakSoalError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="isShowNilai" className="mb-1">Tampilkan Nilai? <span className="text-danger">*</span></label>
                        <select className={`form-control ${isShowNilaiError !== '' ? 'is-invalid' : ''}`} id='isShowNilai' value={isShowNilai} onChange={(e) => setIsShowNilai(e.target.value)} required>
                            <option value="" selected hidden disabled>-- Pilih Opsi --</option>
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                        {isShowNilaiError !== '' && (
                            <div className="invalid-feedback">{isShowNilaiError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="isTerbuka" className="mb-1">Terbuka untuk Umum? <span className="text-danger">*</span></label>
                        <select className={`form-control ${isTerbukaError !== '' ? 'is-invalid' : ''}`} id='isTerbuka' value={isTerbuka} onChange={(e) => setIsTerbuka(e.target.value)} required>
                            <option value="" selected hidden disabled>-- Pilih Opsi --</option>
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                        {isTerbukaError !== '' && (
                            <div className="invalid-feedback">{isTerbukaError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="isPublish" className="mb-1">Publish Ujian? <span className="text-danger">*</span></label>
                        <select className={`form-control ${isPublishError !== '' ? 'is-invalid' : ''}`} id='isPublish' value={isPublish} onChange={(e) => setIsPublish(e.target.value)} required>
                            <option value="" selected hidden disabled>-- Pilih Opsi --</option>
                            <option value="0">Tidak</option>
                            <option value="1">Ya</option>
                        </select>
                        {isPublishError !== '' && (
                            <div className="invalid-feedback">{isPublishError}</div>
                        )}
                    </div>
                    {(isTerbuka == 0 && isTerbuka != '') && (
                        <div className="col-md-6 mb-3">
                            <label htmlFor="mataPelajaranKelasId" className="mb-1">Mata Pelajaran <span className="text-danger">*</span></label>
                            <select className={`form-control ${mataPelajaranKelasIdError !== '' ? 'is-invalid' : ''}`} id='mataPelajaranKelasId' value={mataPelajaranKelasId} onChange={(e) => setMataPelajaranKelasId(e.target.value)}>
                                <option value="" selected hidden disabled>-- Pilih Opsi --</option>
                                {(listMataPelajaranKelas && listMataPelajaranKelas.length > 0) && listMataPelajaranKelas.map((val, index, arr) => (
                                    <option value={val.id}>{`${val.mataPelajaran.nama} (${val.kelas.nama})`}</option>
                                ))}
                            </select>
                            {mataPelajaranKelasIdError !== '' && (
                                <div className="invalid-feedback">{mataPelajaranKelasIdError}</div>
                            )}
                        </div>
                    )}
                </div>
                <button type='submit' className='d-none'>Submit</button>
            </form>
        </ModalBody>
    )
}

export default UbahModal