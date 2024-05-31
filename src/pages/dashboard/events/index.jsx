'use client'

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Modal, Pagination, Table } from 'rsuite';
import Loading from '../../../components/Loading';
import Alerts from '../../../components/dashboard/Alerts';
import Layouts from '../../../components/dashboard/Layouts';
import { cache, checkLengthValue, dayjs, exclude, fetchJson, keygen, postJson, signJWT, statusColor, statusDisplay, supabase, toLocalISOString, uploadImage, useQFetchFn } from '../../../utils/tools';
import { LuPenSquare, LuTrash2 } from 'react-icons/lu';

const EventsPage = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)
  const [isSearch, setSearch] = useState('')
  const [isThumbnail, setThumbnail] = useState('')
  const [showDeleteEvent, setShowDeleteEvent] = useState([false, 'name', 'id'])
  const [showForceDeleteEvent, setShowForceDeleteEvent] = useState([false])
  const [showUpdateEvent, setShowUpdateEvent] = useState([false, null])

  const listInput = [
    [{ t: 'Thumbnail Event', p: 'Upload Thumbnail', file: 1, v: showUpdateEvent[1]?.event_thumbnail || '' }],
    [
      { t: 'Nama Event', p: '.....', v: showUpdateEvent[1]?.event_name || '' },
      { t: 'Kecamatan', p: '.....', v: showUpdateEvent[1]?.event_kecamatan || '' }
    ],
    [
      { t: 'Waktu Mulai', p: '.....', v: toLocalISOString(new Date(Number(showUpdateEvent[1]?.event_release) || 0)) || '', date: 1 },
      { t: 'Waktu Selesai', p: '.....', v: toLocalISOString(new Date(Number(showUpdateEvent[1]?.event_finish) || 0)) || '', date: 1 }
    ],
    [{ t: 'Deskripsi', p: '.....', v: showUpdateEvent[1]?.event_description || '', area: 1 }],
  ]

  const _EventList = useQFetchFn(async () => await fetchJson('/api/signal/event/lists'), ['event_lists_dash'])
  const { data: user } = useSession()

  const handleAddEventChange = async (e) => {
    let savePay = (x) => cache.set('pay_pp', x);
    let getPay = () => showUpdateEvent[0] ?
      ({ ...exclude(showUpdateEvent[1], ['id', 'createdAt', 'updateAt', 'event_status']) })
      : cache.get('pay_pp')

    const target = e.target;
    const name = target.name;
    const value = target.value;

    if (name.match('thumbnail event')) {
      let parse = URL.createObjectURL(e.target.files[0])
      setThumbnail(parse)
      cache.set('upl_image', true)
      setDisabled(true)

      const { data, error } = await supabase.storage
        .from("thumbnails")
        .upload(keygen.url(20), e.target.files[0])
      if (data.path) {
        cache.set('thm_image', `https://lzxtpnjdrtpzaozfzjqm.supabase.co/storage/v1/object/public/thumbnails/${data.path}`)
        cache.set('upl_image', false)
      }
    }

    savePay({ ...getPay(), [name]: value })
    let m = new Date(getPay()?.['waktu mulai']).getTime()
    let s = new Date(getPay()?.['waktu selesai']).getTime()
    setDisabled(!checkLengthValue(getPay(), 6, 3) || m > s || value.length < 3 || cache.get('upl_image'))
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    const handle = await postJson('/api/signal/event/new', {
      token: await signJWT({
        email: user.email,
        event_name: e.target['nama event'].value.trim(),
        event_kecamatan: e.target['kecamatan'].value.trim(),
        event_description: e.target['deskripsi'].value.trim(),
        event_thumbnail: cache.get('thm_image'),
        event_release: new Date(e.target['waktu mulai'].value).getTime().toString(),
        event_finish: new Date(e.target['waktu selesai'].value).getTime().toString(),
      }, 10)
    })

    await _EventList.refetch()
    cache.set('add_ev', [handle.ok, handle.message])
    setLoading(false)
  }

  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  let data = _EventList?.data?.data
    .filter((v, i) => {
      if (isSearch.length > 0) return Object.values(v).join('').toLowerCase().includes(isSearch.toLowerCase())
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    })

  const handleUpdateStatus = async (e, id) => {
    const res = await postJson('/api/signal/event/update', {
      token: await signJWT({
        email: user.email,
        id: id,
        event_status: e.target.value
      })
    })

    if (res.ok) {
      await _EventList.refetch()
    }
  }

  const handleDeleteEvent = async (e) => {
    cache.set('del_ev_load', true)
    const res = await postJson('/api/signal/event/delete', {
      token: await signJWT({
        email: user.email,
        id: showDeleteEvent[2],
      })
    })

    if (!res.ok) {
      setShowDeleteEvent([false, showDeleteEvent[1], showDeleteEvent[2]])
      return setShowForceDeleteEvent([true])
    }

    cache.set('del_ev', [res.ok, res.message])
    if (res.ok) {
      setShowDeleteEvent([false])
      await _EventList.refetch()
    }
    cache.set('del_ev_load', false)
  }

  const handleForceDeleteEvent = async (e) => {
    cache.set('fdel_ev_load', true)
    const res = await postJson('/api/signal/event/delete?force=1', {
      token: await signJWT({
        email: user.email,
        id: showDeleteEvent[2],
      })
    })

    cache.set('fdel_ev', [res.ok, res.message])
    if (res.ok) {
      setShowDeleteEvent([false])
      setShowForceDeleteEvent([false])
      await _EventList.refetch()
    }
    cache.set('fdel_ev_load', false)
  }

  const handleUpdateEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    let payload = {
      email: user.email,
      id: showUpdateEvent[1]?.id,
      event_name: e.target['nama event'].value.trim(),
      event_kecamatan: e.target['kecamatan'].value.trim(),
      event_description: e.target['deskripsi'].value.trim(),
      event_thumbnail: cache.get('thm_image'),
      event_release: new Date(e.target['waktu mulai'].value).getTime().toString(),
      event_finish: new Date(e.target['waktu selesai'].value).getTime().toString(),
    }
    const handle = await postJson('/api/signal/event/update', {
      token: await signJWT(payload, 10)
    })

    if (handle.ok) {
      setShowUpdateEvent([false])
      await _EventList.refetch()
    }

    cache.set('add_ev', [handle.ok, handle.message])
    setLoading(false)
  }

  if (!_EventList.data?.data) return <Loading />

  return (
    <>
      <Layouts title={'Event Management'}>
        <Alerts desc={'Data yang ditampilkan pada tabel berikut merupakan data master yang dimana data tersebut mempengaruhi data lainnya. Gunakanlah secara bijak dan sesuai petunjuk penggunaan'} />
        <div className='flex flex-col pb-5 rounded-xl bg-white border-back'>
          <div className='flex gap-4 justify-between w-full p-5'>
            <input onChange={(e => setSearch(e.target.value))} placeholder='Cari event...' />
            <h2 onClick={() => setShowAddEvent(true)} className='button whitespace-nowrap'>Tambah Event</h2>
          </div>
          <div className='pt-2 pb-7 p-5'>
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="xs"
              className='max-md:flex-col !items-start gap-1'
              layout={['total', 'limit', 'pager']}
              total={_EventList?.data?.data.length}
              limitOptions={[6, 12, 24, 48, 100]}
              limit={limit}
              activePage={page}
              onChangePage={setPage}
              onChangeLimit={handleChangeLimit}
            />
          </div>
          <Table
            data={data}
            loading={!data}
            autoHeight
            bordered
            cellBordered
            className='px-3 text-sm'
            onRowClick={rowData => {
              console.log(rowData);
            }}
          >
            <Table.Column fullText resizable width={200}>
              <Table.HeaderCell>NAMA EVENT</Table.HeaderCell>
              <Table.Cell dataKey="event_name">
                {x => (
                  <Link href={`/events/${x.event_name.replace(/ /g, '-')}`} className='hover:underline font-semibold'>
                    <h1>{x.event_name}</h1>
                  </Link>
                )}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={180}>
              <Table.HeaderCell>LOKASI/KECAMATAN</Table.HeaderCell>
              <Table.Cell dataKey="event_kecamatan" />
            </Table.Column>

            <Table.Column align='center' fullText resizable width={160}>
              <Table.HeaderCell>STATUS</Table.HeaderCell>
              <Table.Cell dataKey="event_status">
                {x => (
                  <select onChange={(e) => handleUpdateStatus(e, x.id)} value={`${x.event_status}`}
                    className={`${statusColor(x.event_status)} uppercase text-xs small !w-fit !border-back font-medium !px-2 !py-0.5`}>
                    <option value={`PENDING`}>{statusDisplay('PENDING')}</option>
                    <option value={`PROGRESS`}>{statusDisplay('PROGRESS')}</option>
                    <option value={`FINISH`}>{statusDisplay('FINISH')}</option>
                  </select>
                )}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>WAKTU MULAI</Table.HeaderCell>
              <Table.Cell dataKey="event_release">
                {x => dayjs(Number(x.event_release)).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>WAKTU SELESAI</Table.HeaderCell>
              <Table.Cell dataKey="event_finish">
                {x => dayjs(Number(x.event_finish)).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>WAKTU RILIS</Table.HeaderCell>
              <Table.Cell dataKey="createdAt">
                {x => dayjs(x.createdAt).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>TERAKHIR UPDATE</Table.HeaderCell>
              <Table.Cell dataKey="updateAt">
                {x => dayjs(x.updateAt).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={140} fixed='right' align='center'>
              <Table.HeaderCell>ACTION</Table.HeaderCell>
              <Table.Cell dataKey="updateAt">
                {x => (
                  <div className='flex items-center gap-3'>
                    <div onClick={() => {
                      cache.clear()
                      setShowUpdateEvent([true, x])
                    }} className='p-1.5 rounded-md hover:bg-yellow-50 border-back cursor-pointer'>
                      <LuPenSquare />
                    </div>
                    <div onClick={() => {
                      cache.clear()
                      setShowDeleteEvent([true, x.event_name, x.id])
                    }} className='p-1.5 rounded-md hover:bg-rose-50 border-back cursor-pointer'>
                      <LuTrash2 />
                    </div>
                  </div>
                )}
              </Table.Cell>
            </Table.Column>
          </Table>
        </div>

        <Modal open={showDeleteEvent[0]} onClose={setShowDeleteEvent}>
          <Modal.Header className='border-b pb-3'>
            <Modal.Title>
              <h2 className='font-semibold'>Yakin ingin menghapus Event?</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Event <strong>{showDeleteEvent[1]}</strong> akan di hapus secara permanen dan tidak dapat di kembalikan.
            Apakah anda yakin ingin melakukan ini?
            <div className='flex items-center justify-between mt-7 -mb-3'>
              <h2 className={`${cache.get('del_ev')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('del_ev')?.[1]}</h2>
              <button onClick={handleDeleteEvent} disabled={cache.get('del_ev_load')} className='button bg-red-500'>{cache.get('del_ev_load') ? 'Tunggu...' : 'Hapus Event'}</button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal open={showForceDeleteEvent[0]} onClose={setShowForceDeleteEvent}>
          <Modal.Header className='border-b pb-3'>
            <Modal.Title>
              <h2 className='font-semibold'>Event tertaut dengan Income!</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Event <strong>{showDeleteEvent[1]}</strong> telah di hubungkan dengan data <strong>Income.</strong>
            Secara otomatis <strong>Income</strong> dengan event <strong>{showDeleteEvent[1]}</strong> akan ikut hilang jika ini di lakukan.
            Harap untuk selalu mengecek dan berhati - hati.
            <div className='flex items-center justify-between mt-7 -mb-3'>
              <h2 className={`${cache.get('fdel_ev')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('fdel_ev')?.[1]}</h2>
              <button onClick={handleForceDeleteEvent} disabled={cache.get('fdel_ev_load')} className='button bg-red-500'>{cache.get('fdel_ev_load') ? 'Tunggu...' : 'Tetap Hapus'}</button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal open={showAddEvent} backdrop='static' onClose={() => {
          setShowAddEvent(false)
          cache.clear()
        }}>
          <Modal.Header className='border-b pb-3'>
            <Modal.Title>
              <h2 className='font-semibold'>Tambah Event Baru</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onChange={handleAddEventChange} onSubmit={handleAddEvent} className='flex flex-col gap-3'>
              {listInput.map(x => (
                <div className='flex flex-col sm:flex-row gap-5'>
                  {x.map(o => (
                    <div className='input-body'>
                      <label>{o.t}</label>
                      {o.file && (
                        <>
                          <img className='w-32 rounded-lg' src={isThumbnail} alt="" />
                          <input type={'file'} accept='image/*' id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />
                        </>
                      )}
                      {(!o.area && !o.file) && <input type={!!o.date && 'datetime-local'} id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                      {!!o.area && <TextareaAutosize className='input-auto' id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                    </div>
                  ))}
                </div>
              ))}
              <div className='flex items-center justify-between mt-5 -mb-3'>
                <h2 className={`${cache.get('add_ev')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('add_ev')?.[1]}</h2>
                <fieldset disabled={isDisabled}>
                  <button type='submit' disabled={isDisabled} className='button'>
                    {cache.get('upl_image') ? 'Sedang mengupload thumbnail...' :
                      isLoading ? 'Tunggu...' : 'Buat Event'
                    }
                  </button>
                </fieldset>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        <Modal open={showUpdateEvent[0]} backdrop='static' onClose={() => {
          setShowUpdateEvent([false])
          cache.clear()
        }}>
          <Modal.Header className='border-b pb-3'>
            <Modal.Title>
              <h2 className='font-semibold line-clamp-1'>Edit Event "<strong>{showUpdateEvent[1]?.event_name}</strong>"</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onChange={handleAddEventChange} onSubmit={handleUpdateEvent} className='flex flex-col gap-3'>
              {listInput.map(x => (
                <div className='flex flex-col sm:flex-row gap-5'>
                  {x.map(o => (
                    <div className='input-body'>
                      <label>{o.t}</label>
                      {o.file && (
                        <>
                          <img className='w-32 rounded-lg' src={isThumbnail || o.v} alt="" />
                          <input type={'file'} accept='image/*' id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} disabled={!!o.d} placeholder={o.p} />
                        </>
                      )}
                      {(!o.area && !o.file) && <input type={!!o.date && 'datetime-local'} id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                      {!!o.area && <TextareaAutosize className='input-auto' id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                    </div>
                  ))}
                </div>
              ))}
              <div className='flex items-center justify-between mt-5 -mb-3'>
                <h2 className={`${cache.get('add_ev')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('add_ev')?.[1]}</h2>
                <fieldset disabled={isDisabled}>
                  <button type='submit' disabled={isDisabled} className='button'>
                    {cache.get('upl_image') ? 'Sedang mengupload thumbnail...' :
                      isLoading ? 'Tunggu...' : 'Buat Event'
                    }
                  </button>
                </fieldset>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Layouts >
    </>
  )
}

export default EventsPage