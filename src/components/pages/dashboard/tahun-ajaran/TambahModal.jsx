import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import ModalBody from '../../../ModalBody'
import ReactDOMServer from 'react-dom/server'
import { faSave } from '@fortawesome/free-regular-svg-icons'

const TambahModal = ({ modalRef, getData }) => {
    const formRef = useRef()
    const submitRef = useRef()
    const axios = useAxiosPrivate()
    const [id, setId] = useState('')
    const [idError, setIdError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        submitRef.current.disabled = true
        submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/tahun-ajaran`,
            data: {
                id
            }
        }).then((res) => {
            if (res.data?.id) {
                modalRef.hide()
                getData()
                Swal.fire('Berhasil', 'Tahun ajaran berhasil ditambahkan!', 'success')
                setId('')
                setIdError('')
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.id) {
                    setIdError(error.id)
                } else {
                    setIdError('')
                }
            }
        }).finally(() => {
            submitRef.current.disabled = false
            submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</>)
        })
    }
    return (
        <ModalBody targetModal={'tambah'} size='lg' title={<h6 className='mb-0'><FontAwesomeIcon icon={faPlus} /> Tambah</h6>} footer={<button type='button' onClick={handleSubmit} ref={submitRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</button>}>
            <form action="" onSubmit={handleSubmit} ref={formRef}>
                <div className="mb-3">
                    <label htmlFor="id" className="mb-1">Tahun <span className="text-danger">*</span></label>
                    <input type="number" className={`form-control ${idError !== '' ? 'is-invalid' : ''}`} id='id' value={id} onChange={(e) => setId(e.target.value)} placeholder='Contoh: 2022' required />
                    {idError !== '' && (
                        <div className="invalid-feedback">{idError}</div>
                    )}
                </div>
                <button type='submit' className='d-none'>Submit</button>
            </form>
        </ModalBody>
    )
}

export default TambahModal