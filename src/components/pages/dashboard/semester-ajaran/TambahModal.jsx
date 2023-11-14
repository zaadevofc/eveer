import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ModalBody from '../../../ModalBody'
import ReactDOMServer from 'react-dom/server'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const TambahModal = ({ modalRef, getData }) => {
    const submitRef = useRef();
    const axios = useAxiosPrivate()
    const [listTahunAjaran, setListTahunAjaran] = useState([])
    const [tahunAjaranId, setTahunAjaranId] = useState('')
    const [tahunAjaranIdError, setTahunAjaranIdError] = useState('')
    const [nama, setNama] = useState('')
    const [namaError, setNamaError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        submitRef.current.disabled = true
        submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/semester-ajaran`,
            data: {
                tahunAjaranId,
                nama
            }
        }).then((res) => {
            if (res.data?.id) {
                modalRef.hide()
                getData()
                Swal.fire('Berhasil', 'Semester ajaran berhasil ditambahkan!', 'success')
                setTahunAjaranId('')
                setTahunAjaranIdError('')
                setNama('')
                setNamaError('')
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.tahunAjaranId) {
                    setTahunAjaranIdError(error.tahunAjaranId)
                } else {
                    setTahunAjaranIdError('')
                }

                if (error?.nama) {
                    setNamaError(error.nama)
                } else {
                    setNamaError('')
                }
            }
        }).finally(() => {
            submitRef.current.disabled = false
            submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</>)
        })
    }
    useEffect(() => {
        const getTahunAjaran = async () => {
            await axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/tahun-ajaran`
            }).then((res) => {
                if (res?.data?.data) {
                    setListTahunAjaran(res.data.data)
                }
            })
        }
        getTahunAjaran()
    }, [])
    return (
        <ModalBody targetModal={'tambah'} size='lg' title={<h6 className='mb-0'><FontAwesomeIcon icon={faPlus} /> Tambah</h6>} footer={<button type='button' onClick={handleSubmit} ref={submitRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</button>}>
            <form action="" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="tahunAjaranId" className="mb-1">Tahun Ajaran <span className="text-danger">*</span></label>
                    <select className={`form-control ${tahunAjaranIdError !== '' ? 'is-invalid' : ''}`} id='tahunAjaranId' value={tahunAjaranId} onChange={(e) => setTahunAjaranId(e.target.value)} required>
                        <option value="" selected hidden disabled>-- Pilih Tahun Ajaran --</option>
                        {listTahunAjaran.length > 0 && listTahunAjaran.map((val, index, arr) => (
                            <option value={val.id}>{val.nama}</option>
                        ))}
                    </select>
                    {tahunAjaranIdError !== '' && (
                        <div className="invalid-feedback">{tahunAjaranIdError}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="nama" className="mb-1">Semester <span className="text-danger">*</span></label>
                    <select className={`form-control ${namaError !== '' ? 'is-invalid' : ''}`} id='nama' value={nama} onChange={(e) => setNama(e.target.value)} required>
                        <option value="" selected hidden disabled>-- Pilih Semester --</option>
                        <option value="Ganjil">Ganjil</option>
                        <option value="Genap">Genap</option>
                    </select>
                    {namaError !== '' && (
                        <div className="invalid-feedback">{namaError}</div>
                    )}
                </div>
                <button type='submit' className='d-none'>Submit</button>
            </form>
        </ModalBody >
    )
}

export default TambahModal