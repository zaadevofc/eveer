import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ModalBody from '../../../ModalBody'
import ReactDOMServer from 'react-dom/server'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const TambahModal = ({ modalRef, getData }) => {
    const submitRef = useRef();
    const axios = useAxiosPrivate()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [nip, setNip] = useState('')
    const [nipError, setNipError] = useState('')
    const [namaLengkap, setNamaLengkap] = useState('')
    const [namaLengkapError, setNamaLengkapError] = useState('')
    const [jenisKelamin, setJenisKelamin] = useState('')
    const [jenisKelaminError, setJenisKelaminError] = useState('')
    const [tanggalLahir, setTanggalLahir] = useState('')
    const [tanggalLahirError, setTanggalLahirError] = useState('')
    const [nomorPonsel, setNomorPonsel] = useState('')
    const [nomorPonselError, setNomorPonselError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        submitRef.current.disabled = true
        submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/guru`,
            data: {
                email,
                password,
                namaLengkap,
                nip,
                jenisKelamin,
                tanggalLahir: new Date(tanggalLahir),
                nomorPonsel
            }
        }).then((res) => {
            if (res.data?.id) {
                modalRef.hide()
                getData()
                Swal.fire('Berhasil', 'Guru berhasil ditambahkan!', 'success')
                setEmail('')
                setEmailError('')
                setPassword('')
                setPasswordError('')
                setNip('')
                setNipError('')
                setNamaLengkap('')
                setNamaLengkapError('')
                setJenisKelamin('')
                setJenisKelaminError('')
                setTanggalLahir('')
                setTanggalLahirError('')
                setNomorPonsel('')
                setNomorPonselError('')
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
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

                    if (error?.namaLengkap) {
                        setNamaLengkapError(error.namaLengkap)
                    } else {
                        setNamaLengkapError('')
                    }

                    if (error?.nip) {
                        setNipError(error.nip)
                    } else {
                        setNipError('')
                    }

                    if (error?.jenisKelamin) {
                        setJenisKelaminError(error.jenisKelamin)
                    } else {
                        setJenisKelaminError('')
                    }

                    if (error?.tanggalLahir) {
                        setTanggalLahirError(error.tanggalLahir)
                    } else {
                        setTanggalLahirError('')
                    }

                    if (error?.nomorPonsel) {
                        setNomorPonselError(error.nomorPonsel)
                    } else {
                        setNomorPonselError('')
                    }
                }
            }
        }).finally(() => {
            submitRef.current.disabled = false
            submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</>)
        })
    }
    return (
        <ModalBody targetModal={'tambah'} size='xl' title={<h6 className='mb-0'><FontAwesomeIcon icon={faPlus} /> Tambah</h6>} footer={<button type='button' onClick={handleSubmit} ref={submitRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</button>}>
            <form action="" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="mb-1">Email Address <span className="text-danger">*</span></label>
                        <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} email='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {emailError !== '' && (
                            <div className="invalid-feedback">{emailError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="mb-1">Password</label>
                        <input type="password" className={`form-control ${passwordError !== '' ? 'is-invalid' : ''}`} password='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        {passwordError !== '' && (
                            <div className="invalid-feedback">{passwordError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="namaLengkap" className="mb-1">Nama Lengkap <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${namaLengkapError !== '' ? 'is-invalid' : ''}`} namaLengkap='namaLengkap' value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
                        {namaLengkapError !== '' && (
                            <div className="invalid-feedback">{namaLengkapError}</div>
                        )}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nip" className="mb-1">Nomor Induk Pegawai (NIP) <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${nipError !== '' ? 'is-invalid' : ''}`} nip='nip' value={nip} onChange={(e) => setNip(e.target.value)} required />
                        {nipError !== '' && (
                            <div className="invalid-feedback">{nipError}</div>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="jenisKelamin" className="mb-1">Jenis Kelamin <span className="text-danger">*</span></label>
                        <select className={`form-control ${jenisKelaminError !== '' ? 'is-invalid' : ''}`} jenisKelamin='jenisKelamin' value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} required>
                            <option value="" selected hidden disabled>-- Pilih Jenis Kelamin --</option>
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                        {jenisKelaminError !== '' && (
                            <div className="invalid-feedback">{jenisKelaminError}</div>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="tanggalLahir" className="mb-1">Tanggal Lahir <span className="text-danger">*</span></label>
                        <input type="date" className={`form-control ${tanggalLahirError !== '' ? 'is-invalid' : ''}`} tanggalLahir='tanggalLahir' value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} required />
                        {tanggalLahirError !== '' && (
                            <div className="invalid-feedback">{tanggalLahirError}</div>
                        )}
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="nomorPonsel" className="mb-1">Nomor Ponsel <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">+62</div>
                            <input type="number" className={`form-control ${nomorPonselError !== '' ? 'is-invalid' : ''}`} nomorPonsel='nomorPonsel' value={nomorPonsel} onChange={(e) => setNomorPonsel(e.target.value)} required />
                            {nomorPonselError !== '' && (
                                <div className="invalid-feedback">{nomorPonselError}</div>
                            )}
                        </div>
                    </div>
                </div>
                <button type='submit' className='d-none'>Submit</button>
            </form>
        </ModalBody >
    )
}

export default TambahModal