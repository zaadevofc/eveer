import React, { useEffect, useState } from 'react'
import Template from '../../../components/Template'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { faExclamationTriangle, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { Table } from 'antd'
import Spinner from '../../../components/Spinner'
import Swal from 'sweetalert2'
import Head from 'next/head'

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
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Gambar',
            key: 'gambar',
            dataIndex: 'gambar',
            render: (text) => (<img className='w-50' src={`${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/carousel/gambar/${text}`} />)
        },
        {
            title: 'Prioritas',
            key: 'prioritas',
            dataIndex: 'prioritas',
            align: 'center',
            sortOrder: currentSort && currentSort.index == 'prioritas' ? currentSort.order : undefined,
            sorter: (a, b) => { }
        },
        {
            title: 'Aksi',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div className='d-flex gap-2 justify-content-center'>
                        <Link href={`/dashboard/carousel/${record.id}`} className='btn btn-info btn-sm'><FontAwesomeIcon icon={faEdit} /></Link>
                        <a href='#!' className='btn btn-danger btn-sm' onClick={() => handleDelete(record.id)}><FontAwesomeIcon icon={faTrashAlt} /></a>
                    </div>
                )
            }
        }
    ];
    const handleDelete = async (id) => {
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
                    url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/carousel/${id}`,
                }).then((res) => {
                    if (res.data?.id) {
                        getData()
                        Swal.fire('Berhasil', 'Carousel berhasil dihapuskan!', 'success')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        })
    }
    const getData = async () => {
        const order = Object.keys(currentSort).length > 0 && JSON.stringify({
            index: currentSort?.index,
            order: currentSort?.order == 'ascend' ? 'asc' : 'desc'
        })
        setIsLoading(true)
        await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_RESTFUL_API != undefined ? process.env.NEXT_PUBLIC_RESTFUL_API : ''}/carousel?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}${Object.keys(currentSort).length > 0 ? '&order=' + order : ''}${search != '' ? '&search=' + search : ''}`,
        }).then((res) => {
            setTableData(res.data.data)
            setTotal(res.data.totalData)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getData()
    }, [currentPage, currentSort, pageSize, search])

    return (
        <React.Fragment>
            <Head>
                <title>Daftar Carousel</title>
            </Head>
            <Template header='Daftar Carousel' breadCrumb={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Carousel', link: '/dashboard/carousel' }, { label: 'Daftar Carousel', link: '/dashboard/carousel' }]} breadCrumbRightContent={
                <Link href='/dashboard/carousel/tambah' className='btn btn-primary rounded-xl'>
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
                                    // itemRender: itemRender,
                                    pageSize: pageSize,
                                    total: total,
                                    showSizeChanger: true,
                                    locale: { items_per_page: "" },
                                    pageSizeOptions: ['5', '10', '25', '50', '100', '150'],
                                    showTotal: (total, range) =>
                                        `Menampilkan ${range[0]} sampai ${range[1]} dari ${total} entri`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Template>
        </React.Fragment >
    )
}

export default Index