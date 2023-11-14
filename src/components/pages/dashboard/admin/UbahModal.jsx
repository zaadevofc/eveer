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
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [namaLengkap, setNamaLengkap] = useState('')
    const [namaLengkapError, setNamaLengkapError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        submitRef.current.disabled = true
        submitRef.current.innerHTML = ReactDOMServer.renderToString(<><FontAwesomeIcon spin={true} icon={faSpinner} />&nbsp; Processing</>)
        await axios({
            method: 'PATCH',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/admin/${id}`,
            data: {
                email,
                namaLengkap
            }
        }).then((res) => {
            if (res.data?.id) {
                modalRef.hide()
                getData()
                Swal.fire('Berhasil', 'Admin berhasil diubah!', 'success')
            }
        }).catch((err) => {
            const error = err.response?.data

            if (err.response?.status === 400) {
                if (error?.email) {
                    setEmailError(error.email)
                } else {
                    setEmailError('')
                }

                if (error?.namaLengkap) {
                    setNamaLengkapError(error.namaLengkap)
                } else {
                    setNamaLengkapError('')
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
                url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/admin/${id ? id : ''}`,
            }).then((res) => {
                if (res.data?.id) {
                    setEmail(res.data.email)
                    setNamaLengkap(res.data.namaLengkap)
                    setEmailError('')
                    setPasswordError('')
                }
            }).catch((err) => {
                console.error(err)
            })
        }

        if (id) {
            getCurrentData()
        }
    }, [id])
    return (
        <ModalBody targetModal={'ubah'} size='lg' title={<h6 className='mb-0'><FontAwesomeIcon icon={faPenAlt} /> Ubah</h6>} footer={<button type='button' onClick={handleSubmit} ref={submitRef} className='btn btn-primary float-end'><FontAwesomeIcon icon={faSave} fixedWidth /> Simpan</button>}>
            <form action="" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="email" className="mb-1">Email Address <span className="text-danger">*</span></label>
                        <input type="email" className={`form-control ${emailError !== '' ? 'is-invalid' : ''}`} email='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {emailError !== '' && (
                            <div className="invalid-feedback">{emailError}</div>
                        )}
                    </div>
                    <div className="col-md-12 mb-3">
                        <label htmlFor="namaLengkap" className="mb-1">Nama Lengkap <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${namaLengkapError !== '' ? 'is-invalid' : ''}`} namaLengkap='namaLengkap' value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
                        {namaLengkapError !== '' && (
                            <div className="invalid-feedback">{namaLengkapError}</div>
                        )}
                    </div>
                </div>
                <button type='submit' className='d-none'>Submit</button>
            </form>
        </ModalBody>
    )
}

export default UbahModal