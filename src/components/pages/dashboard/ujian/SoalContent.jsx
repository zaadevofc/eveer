import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import styles from '../../../../../styles/component/SoalContent.module.css'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import UbahModalSoal from './soal/UbahModal'

const SoalContent = ({ data, isAcakSoal, getSoal, nomorSoal = null }) => {
    const axios = useAxiosPrivate();
    const [modalUbahSoal, setModalUbahSoal] = useState(null)
    const handleUbahSoal = () => {
        const element = new bootstrap.Modal(document.getElementById('ubahSoal'))
        element.show()
        setModalUbahSoal(element)
    }
    const handleDeleteSoal = async (id) => {
        Swal.fire({
            title: 'Apa kamu yakin?',
            text: 'Data ini akan dihapus dan tidak dapat dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Iya'
        }).then(async (res) => {
            if (res.isConfirmed) {
                await axios({
                    method: 'DELETE',
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/soal/${id}`,
                }).then((res) => {
                    if (res.data?.id) {
                        getSoal()
                        Swal.fire('Berhasil', 'Soal berhasil dihapuskan!', 'success')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        })
    }
    const handleDeleteOpsi = async (opsiSoalId) => {
        Swal.fire({
            title: 'Apa kamu yakin?',
            text: 'Data ini akan dihapus dan tidak dapat dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Tidak',
            confirmButtonText: 'Iya'
        }).then(async (res) => {
            if (res.isConfirmed) {
                await axios({
                    method: 'DELETE',
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/soal/opsi/${opsiSoalId}`,
                }).then((res) => {
                    if (res.data?.id) {
                        getSoal()
                        Swal.fire('Berhasil', 'Opsi pada soal berhasil dihapuskan!', 'success')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        })
    }
    return (
        <>
            <div className="card shadow-lg rounded-xl mb-4 overflow-hidden" id="146">
                <div className="card-header font-weight-bold py-3">
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <h6 className="mb-0">
                            Soal ke <span className="badge bg-primary">{data.Ujian.isAcakSoal ? nomorSoal : data.nomorSoal}</span>
                        </h6>
                        {data.penilaian === 'Soal' && (
                            <h6 className="mb-0">
                                <span className="text-primary fw-bolder">{data.nilai}</span> / 100
                            </h6>
                        )}
                    </div>
                </div>
                <hr className='m-0' />
                <div className="card-body">
                    <p className='mb-3'>{data.pertanyaan}</p>
                    <ol type="A">
                        {data.OpsiSoal.map((val, index, arr) => (
                            <li className={`px-2 rounded-3 ${styles['opsi-soal']} ${val.isBenar && data.penilaian === 'Soal' ? 'bg-primary text-white' : ''}`}>
                                <div className="d-flex align-items-center justify-content-between py-1">
                                    <div>{val.opsi}</div>
                                    {!data.Ujian.isPublish && (
                                        <div className='d-flex align-items-center justify-content-center gap-1'>
                                            {data.penilaian === 'Opsi' && (
                                                <button type='button' class="btn btn-sm btn-warning font-weight-bold">{val.nilai} / 100</button>
                                            )}
                                            {data.jenis === 'Opsi' && (
                                                <button type='button' class="btn btn-sm btn-success"><FontAwesomeIcon icon={faEdit} /></button>
                                            )}
                                            <button type='button' onClick={() => handleDeleteOpsi(val.id)} class="btn btn-sm btn-danger"><FontAwesomeIcon icon={faTrashAlt} /></button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                {!data.Ujian.isPublish && (
                    <div className="card-footer d-flex align-items-center justify-content-start gap-1">
                        {data.jenis === 'Opsi' && (
                            <button type='button' class="btn btn-sm btn-primary rounded-xl"><FontAwesomeIcon icon={faPlus} fixedWidth /> Opsi</button>
                        )}
                        <button type='button' onClick={() => handleUbahSoal(data.id)} class="btn btn-sm btn-success rounded-xl px-3"><FontAwesomeIcon icon={faEdit} fixedWidth /> Ubah</button>
                        <button type='button' onClick={() => handleDeleteSoal(data.id)} class="btn btn-sm btn-danger rounded-xl px-3"><FontAwesomeIcon icon={faTrashAlt} fixedWidth /> Hapus</button>
                    </div>
                )}
            </div>
            <UbahModalSoal id={data.id} ujianId={data.ujianId} isAcakSoal={isAcakSoal} modalRef={modalUbahSoal} getData={getSoal} />
        </>
    )
}

export default SoalContent