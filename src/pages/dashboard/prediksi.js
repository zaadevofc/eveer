import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Template from '../../components/Template'

const Prediksi = () => {
    const [isPredicted, setIsPredicted] = useState(false)
    const [persentase, setPersentase] = useState('')
    const [stand, setStand] = useState('')
    const [nagari, setNagari] = useState('')
    const [pemda, setPemda] = useState('')
    const [sponsor, setSponsor] = useState('')
    const formatRupiah = (angka, prefix) => {
        var number_string = angka.replace(/[^,\d]/g, '').toString(),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            var separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return prefix == undefined ? rupiah : (rupiah ? 'Rp' + rupiah : '');
    }
    return (
        <>
            <Head>
                <title>Prediksi</title>
            </Head>
            <Template header='Prediksi' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Prediksi', link: '/dashboard/prediksi' }]}>
                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="persentase" className='mb-1'>Persentase (%) <span className="text-danger">*</span></label>
                            <input className='form-control' type="number" id='persentase' value={persentase} onChange={(e) => setPersentase(e.target.value)} disabled={isPredicted === true ? true : false} required />
                        </div>
                        <div className="row mb-3">
                            <div className='col-6'>
                                <label htmlFor="dana_stand" className='mb-1'>Dana Stand (Rp) <span className="text-danger">*</span></label>
                                <input className='form-control' type={isPredicted === true ? 'text' : 'number'} id='dana_stand' value={isPredicted === true ? formatRupiah(stand, 'Rp') : stand} onChange={(e) => setStand(e.target.value)} disabled={isPredicted === true ? true : false} required />
                            </div>
                            <div className='col-6'>
                                <label htmlFor="prediksi_dana_stand" className='mb-1'>Prediksi Dana Stand (Rp)</label>
                                <input className='form-control' type="text" id='prediksi_dana_stand' value={isPredicted === true ? formatRupiah((Math.round(((100 + +persentase) / 100) * +stand)).toString(), 'Rp') : ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className='col-6'>
                                <label htmlFor="dana_nagari" className='mb-1'>Dana Nagari (Rp) <span className="text-danger">*</span></label>
                                <input className='form-control' type={isPredicted === true ? 'text' : 'number'} id='dana_nagari' value={isPredicted === true ? formatRupiah(nagari, 'Rp') : nagari} onChange={(e) => setNagari(e.target.value)} disabled={isPredicted === true ? true : false} required />
                            </div>
                            <div className='col-6'>
                                <label htmlFor="prediksi_dana_nagari" className='mb-1'>Prediksi Dana Nagari (Rp)</label>
                                <input className='form-control' type="text" id='prediksi_dana_nagari' value={isPredicted === true ? formatRupiah((Math.round(((100 + +persentase) / 100) * +nagari)).toString(), 'Rp') : ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className='col-6'>
                                <label htmlFor="dana_pemda" className='mb-1'>Dana Pemda (Rp) <span className="text-danger">*</span></label>
                                <input className='form-control' type={isPredicted === true ? 'text' : 'number'} id='dana_pemda' value={isPredicted === true ? formatRupiah(pemda, 'Rp') : pemda} onChange={(e) => setPemda(e.target.value)} disabled={isPredicted === true ? true : false} required />
                            </div>
                            <div className='col-6'>
                                <label htmlFor="prediksi_dana_pemda" className='mb-1'>Prediksi Dana Pemda (Rp)</label>
                                <input className='form-control' type="text" id='prediksi_dana_pemda' value={isPredicted === true ? formatRupiah((Math.round(((100 + +persentase) / 100) * +pemda)).toString(), 'Rp') : ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className='col-6'>
                                <label htmlFor="dana_sponsor" className='mb-1'>Dana Sponsor (Rp) <span className="text-danger">*</span></label>
                                <input className='form-control' type={isPredicted === true ? 'text' : 'number'} id='dana_sponsor' value={isPredicted === true ? formatRupiah(sponsor, 'Rp') : sponsor} onChange={(e) => setSponsor(e.target.value)} disabled={isPredicted === true ? true : false} required />
                            </div>
                            <div className='col-6'>
                                <label htmlFor="prediksi_dana_sponsor" className='mb-1'>Prediksi Dana Sponsor (Rp)</label>
                                <input className='form-control' type="text" id='prediksi_dana_sponsor' value={isPredicted === true ? formatRupiah((Math.round(((100 + +persentase) / 100) * +sponsor)).toString(), 'Rp') : ''} disabled />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className='mb-3'>
                                <label htmlFor="dana_sponsor" className='mb-1'>Total (Rp) <span className="text-danger">*</span></label>
                                <input className='form-control' type={isPredicted === true ? 'text' : 'number'} id='dana_sponsor' value={isPredicted === true ? formatRupiah((+stand + +nagari + +pemda + +sponsor).toString(), 'Rp') : ''} disabled />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="clearfix">
                            {isPredicted === false ? (
                                <button type='button' onClick={() => setIsPredicted(true)} className='btn btn-primary float-end'>Prediksi</button>
                            ) : (
                                <button type='button' onClick={() => setIsPredicted(false)} className='btn btn-warning float-end'>Batal</button>
                            )}
                        </div>
                    </div>
                </div>
            </Template>
        </>
    )
}

export default Prediksi