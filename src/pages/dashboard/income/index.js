
import { Table } from 'antd'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import Spinner from '../../../components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faPlus, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import Swal from 'sweetalert2'
import Template from '../../../components/Template'

const Index = () => {
    const axios = useAxiosPrivate()
    const [search, setSearch] = useState('')
    const [currentSort, setCurrentSort] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const columns = [
        {
            title: 'No',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Event',
            dataIndex: ["event", "nama"],
            key: ["event", "nama"],
            sorter: (a, b) => { },
            sortOrder: currentSort && JSON.stringify(currentSort.index) === JSON.stringify(["event", "nama"]) ? currentSort.order : undefined,
        },
        {
            title: 'Jumlah',
            dataIndex: "jumlah",
            key: "jumlah",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'jumlah' ? currentSort.order : undefined,
            render: (text, record, index) => formatRupiah(text.toString(), 'Rp')
        },
        {
            title: 'Tanggal',
            dataIndex: "tanggal",
            key: "tanggal",
            sorter: (a, b) => { },
            sortOrder: currentSort && currentSort.index == 'tanggal' ? currentSort.order : undefined,
            render: (text, record, index) => `${tanggalIndo(text.split('T')[0])}`
        },
        {
            title: 'Aksi',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div className='d-flex gap-2 justify-content-center'>
                        <Link href={`/dashboard/income/ubah/${record.id}`} className='btn btn-success btn-sm' data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Ubah Income'>
                            <FontAwesomeIcon icon={faEdit} fixedWidth />
                        </Link>
                        <button type='button' className='btn btn-danger btn-sm' onClick={() => handleDelete(record.id)} data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content='Hapus Income'><FontAwesomeIcon icon={faTrashAlt} fixedWidth /></button>
                    </div>
                )
            }
        }
    ];
    const tanggalIndo = (tanggal) => {
        const bulan = [
            '',
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ]

        const pecahkan = tanggal.split('-');
        return `${pecahkan[2]} ${bulan[parseInt(pecahkan[1])]} ${pecahkan[0]}`;
    }

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

    const getData = async () => {
        const order = Object.keys(currentSort).length > 0 && JSON.stringify({
            index: currentSort?.index,
            order: currentSort?.order == 'ascend' ? 'asc' : 'desc'
        })
        setIsLoading(true)
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/income?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${Object.keys(currentSort).length > 0 ? '&order=' + order : ''}${search != '' ? '&search=' + search : ''}`,
        }).then((res) => {
            setTableData(res.data.data)
            setTotal(res.data.totalData)
            setIsLoading(false)
        })
    }
    const handleDelete = (id) => {
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
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/income/${id}`
                }).then((res) => {
                    if (res.data?.id) {
                        getData()
                        Swal.fire('Berhasil', 'Income berhasil dihapuskan!', 'success')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        })
    }
    useEffect(() => {
        getData()
    }, [currentPage, currentSort, pageSize, search])

    return (
        <>
            <Head>
                <title>Daftar Income</title>
            </Head>
            <Template header='Daftar Income' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Income', link: '/dashboard/income' }, { label: 'Daftar Income', link: '/dashboard/income' }]} breadCrumbRightContent={
                <Link href='/dashboard/income/tambah' className='btn btn-primary rounded-xl'>
                    <FontAwesomeIcon icon={faPlus} />&nbsp; Tambah
                </Link>
            }>
                <div className="alert border-success rounded-xl alert-dismissible fade show shadow-sm" role="alert">
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    <h4 className="alert-heading"><FontAwesomeIcon className='text-warning' icon={faExclamationTriangle} /> Peringatan!</h4>
                    <p>Data yang ditampilkan pada tabel berikut merupakan data master yang dimana data tersebut mempengaruhi data lainnya</p>
                    <hr />
                    <p className="mb-0">Gunakanlah secara bijak dan sesuai petunjuk penggunaan.</p>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div style={{ position: 'relative' }}>
                            <input className='form-control mb-3 rounded-pill' onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} placeholder='Pencarian' />
                            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translate(0%,-50%)' }} />
                        </div>
                        <div className="table-responsive">
                            <Table
                                loading={{
                                    spinning: isLoading ? true : false,
                                    indicator: <Spinner />
                                }}
                                sortDirections={['ascend', 'descend', 'ascend']}
                                showSorterTooltip={true}
                                columns={columns}
                                dataSource={tableData}
                                bordered={true}
                                rowKey={record => record.id}
                                onChange={(pagination, filters, sorter, extra) => {
                                    if (extra.action === 'sort') {
                                        setCurrentSort({
                                            index: sorter.field,
                                            order: sorter.order
                                        })
                                    }
                                    if (extra.action === 'paginate') {
                                        setCurrentPage(pagination.current)
                                        setPageSize(pagination.pageSize)
                                    }
                                }}
                                pagination={{
                                    current: currentPage || 1,
                                    pageSize: pageSize,
                                    total: total,
                                    showSizeChanger: true,
                                    locale: { items_per_page: "" },
                                    pageSizeOptions: ['5', '10', '25', '50', '100', '150'],
                                    showTotal: (total, range) => `Menampilkan ${range[0]} sampai ${range[1]} dari ${total} entri`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Template>
        </>
    )
}

export default Index