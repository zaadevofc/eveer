import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate'
import ModalBody from '../../../../ModalBody'
import ReactDOMServer from 'react-dom/server'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const TambahModal = ({ ujianId, isAcakSoal, modalRef, getData }) => {
    const formRef = useRef()
    const submitRef = useRef()
    const axios = useAxiosPrivate()
    const [nomorSoal, setNomorSoal] = useState('')
    const [nomorSoalError, setNomorSoalError] = useState('')
    const [penilaian, setPenilaian] = useState('')
    const [penilaianError, setPenilaianError] = useState('')
    const [pertanyaan, setPertanyaan] = useState('')
    const [pertanyaanError, setPertanyaanError] = useState('')
    const [jenis, setJenis] = useState('')
    const [jenisError, setJenisError] = useState('')
    const [nilai, setNilai] = useState('')
    const [nilaiError, setNilaiError] = useState('')
    const [jawaban, setJawaban] = useState('')
    const [jawabanError, setJawabanError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        submitRef.current.disabled = true
        submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/soal`,
            data: {
                ujianId,
                ...(!isAcakSoal && { nomorSoal }),
                penilaian,
                pertanyaan,
                jenis,
                ...(penilaian === 'Soal' && { nilai }),
                ...(jenis === 'Essay' && { jawaban })
            }
        }).then((res) => {
            if (res.data?.id) {
                modalRef.hide()
                getData()
                Swal.fire('Berhasil', 'Soal berhasil ditambahkan!', 'success')
                setNomorSoal('')
                setNomorSoalError('')
                setPenilaian('')
                setPenilaianError('')
                setPertanyaan('')
                setPertanyaanError('')
                setJenis('')
                setJenisError('')
                setNilai('')
                setNilaiError('')
                setJawaban('')
                setJawabanError('')
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.nomorSoal) {
                    setNomorSoalError(error.nomorSoal)
                } else {
                    setNomorSoalError('')
                }

                if (error?.penilaian) {
                    setPenilaianError(error.penilaian)
                } else {
                    setPenilaianError('')
                }

                if (error?.pertanyaan) {
                    setPertanyaanError(error.pertanyaan)
                } else {
                    setPertanyaanError('')
                }

                if (error?.jenis) {
                    setJenisError(error.jenis)
                } else {
                    setJenisError('')
                }

                if (error?.nilai) {
                    setNilaiError(error.nilai)
                } else {
                    setNilaiError('')
                }

                if (error?.jawaban) {
                    setJawabanError(error.jawaban)
                } else {
                    setJawabanError('')
                }

            }
        }).finally(() => {
            submitRef.current.disabled = false
            submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</>)
        })
    }
    return (
        <ModalBody targetModal={'tambahSoal'} size='lg' title={<h6 className='mb-0'><FontAwesomeIcon icon={faPlus} /> Tambah</h6>} footer={<button type='button' onClick={handleSubmit} ref={submitRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</button>}>
            <form action="" onSubmit={handleSubmit} ref={formRef}>
                <div className="mb-3">
                    {!isAcakSoal && (
                        <div className="mb-3">
                            <label htmlFor="nomorSoal" className="mb-1">Nomor Soal <span className="text-danger">*</span></label>
                            <input type='number' className={`form-control ${nomorSoalError !== '' ? 'is-invalid' : ''}`} id='nomorSoal' value={nomorSoal} onChange={(e) => setNomorSoal(e.target.value)} required />
                            {nomorSoalError !== '' && (
                                <div className="invalid-feedback">{nomorSoalError}</div>
                            )}
                        </div>
                    )}
                    <label htmlFor="penilaian" className="mb-1">Penilaian <span className="text-danger">*</span></label>
                    <select className={`form-control ${penilaianError !== '' ? 'is-invalid' : ''}`} id='penilaian' value={penilaian} onChange={(e) => setPenilaian(e.target.value)} required>
                        <option value="" selected hidden disabled>-- Pilih Penilaian --</option>
                        <option value="Soal">Soal</option>
                        <option value="Opsi">Opsi</option>
                    </select>
                    {penilaianError !== '' && (
                        <div className="invalid-feedback">{penilaianError}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="pertanyaan" className="mb-1">Pertanyaan <span className="text-danger">*</span></label>
                    <textarea className={`form-control ${pertanyaanError !== '' ? 'is-invalid' : ''}`} id='pertanyaan' value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} required />
                    {pertanyaanError !== '' && (
                        <div className="invalid-feedback">{pertanyaanError}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="jenis" className="mb-1">Jenis <span className="text-danger">*</span></label>
                    <select className={`form-control ${jenisError !== '' ? 'is-invalid' : ''}`} id='jenis' value={jenis} onChange={(e) => setJenis(e.target.value)} required>
                        <option value="" selected hidden disabled>-- Pilih Jenis --</option>
                        <option value="Opsi">Opsi</option>
                        <option value="Essay">Essay</option>
                    </select>
                    {jenisError !== '' && (
                        <div className="invalid-feedback">{jenisError}</div>
                    )}
                </div>
                {penilaian === 'Soal' && (
                    <div className="mb-3">
                        <label htmlFor="nilai" className="mb-1">Nilai <span className="text-danger">*</span></label>
                        <input type="number" className={`form-control ${nilaiError !== '' ? 'is-invalid' : ''}`} id='nilai' value={nilai} onChange={(e) => setNilai(e.target.value)} required />
                        {nilaiError !== '' && (
                            <div className="invalid-feedback">{nilaiError}</div>
                        )}
                    </div>
                )}
                {jenis === 'Essay' && (
                    <div className="mb-3">
                        <label htmlFor="jawaban" className="mb-1">Jawaban <span className="text-danger">*</span></label>
                        <textarea className={`form-control ${jawabanError !== '' ? 'is-invalid' : ''}`} id='jawaban' value={jawaban} onChange={(e) => setJawaban(e.target.value)} required />
                        {jawabanError !== '' && (
                            <div className="invalid-feedback">{jawabanError}</div>
                        )}
                    </div>
                )}
                <button type='submit' className='d-none'>Submit</button>
            </form>
        </ModalBody>
    )
}

export default TambahModal