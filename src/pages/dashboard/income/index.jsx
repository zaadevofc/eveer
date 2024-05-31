'use client'

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { LuPenSquare, LuTrash2 } from 'react-icons/lu';
import TextareaAutosize from 'react-textarea-autosize';
import { Modal, Pagination, Table } from 'rsuite';
import Loading from '../../../components/Loading';
import Alerts from '../../../components/dashboard/Alerts';
import Layouts from '../../../components/dashboard/Layouts';
import { cache, checkLengthValue, dayjs, fetchJson, postJson, signJWT, statusColor, statusDisplay, toLocalISOString, toRupiah, useQFetchFn } from '../../../utils/tools';

const IncomePage = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)
  const [isSearch, setSearch] = useState('')
  const [showDeleteEvent, setShowDeleteEvent] = useState([false, 'name', 'id'])
  const [showUpdateEvent, setShowUpdateEvent] = useState([false, null])

  const _IncomeList = useQFetchFn(async () => await fetchJson('/api/signal/income/lists'), ['income_lists_dash'])
  const _eientList = useQFetchFn(async () => await fetchJson('/api/signal/event/lists'), ['event_lists_income'])
  const { data: user } = useSession()

  const listInput = [
    [
      {
        t: 'Event Target', p: 'Pilih Event', v: showUpdateEvent[1]?.income_event_id || '',
        select: _eientList.data?.data
      },
    ],
    [{ t: 'Jumlah Income (Rp)', p: '.....', v: showUpdateEvent[1]?.income_value || '', number: true }],
    [
      { t: 'Tanggal', p: '.....', v: toLocalISOString(new Date(Number(showUpdateEvent[1]?.income_release) || null)) || '', date: 1 },
    ],
  ]

  const handleAddEventChange = (e) => {
    let savePay = (x) => cache.set('pay_ei', x);
    let getPay = () => showUpdateEvent[0] ?
      ({
        'event target': showUpdateEvent[1]?.income_event_id,
        'jumlah income (rp)': showUpdateEvent[1]?.income_value,
        'tanggal': showUpdateEvent[1]?.income_release,
      })
      : cache.get('pay_ei')

    const target = e.target;
    const name = target.name;
    const value = target.value;

    if (!name.match('Event Target')) savePay({ ...getPay(), ['event target']: _eientList.data?.data[0]?.id })

    savePay({ ...getPay(), [name]: value })
    setDisabled(!checkLengthValue(getPay(), 3, 3) || value.length < 3)
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    const handle = await postJson('/api/signal/income/new', {
      token: await signJWT({
        email: user.email,
        income_event_id: e.target['event target'].value.trim(),
        income_target_id: e.target['event target'].value.trim(),
        income_value: e.target['jumlah income (rp)'].value.trim(),
        income_release: new Date(e.target['tanggal'].value).getTime().toString(),
      }, 10)
    })

    await _IncomeList.refetch()
    cache.set('add_ei', [handle.ok, handle.message])
    setLoading(false)
  }

  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  let data = _IncomeList?.data?.data
    .filter((v, i) => {
      if (isSearch.length > 0) return Object.values({ ...v, ...v.income_target }).join('').toLowerCase().match(isSearch.toLowerCase())
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    })

  const handleUpdateStatus = async (e, id) => {
    const res = await postJson('/api/signal/income/update', {
      token: await signJWT({
        email: user.email,
        id: id,
        event_status: e.target.value
      })
    })

    if (res.ok) {
      await _IncomeList.refetch()
    }
  }

  const handleDeleteEvent = async (e) => {
    cache.set('del_ei_load', true)
    const res = await postJson('/api/signal/income/delete', {
      token: await signJWT({
        email: user.email,
        id: showDeleteEvent[2],
      })
    })

    cache.set('del_ei', [res.ok, res.message])
    if (res.ok) {
      setShowDeleteEvent([false])
      await _IncomeList.refetch()
    }
    cache.set('del_ei_load', false)
  }

  const handleUpdateEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    let payload = {
      email: user.email,
      id: showUpdateEvent[1]?.id,
      income_target_id: e.target['event target'].value.trim(),
      income_value: e.target['jumlah income (rp)'].value.trim(),
      income_release: new Date(e.target['tanggal'].value).getTime().toString(),
    }
    const handle = await postJson('/api/signal/income/update', {
      token: await signJWT(payload, 10)
    })

    if (handle.ok) {
      setShowUpdateEvent([false])
      await _IncomeList.refetch()
    }

    cache.set('add_ei', [handle.ok, handle.message])
    setLoading(false)
  }

  if (_IncomeList.isLoading) return <Loading />
  if (_eientList.isLoading) return <Loading />

  return (
    <>
      <Layouts title={'Income Management'}>
        <Alerts desc={'Harap untuk selalu awasi data. Karna dapat menimbulkan resiko yang cukup tinggi.'} />
        <div className='flex flex-col pb-5 rounded-xl bg-white border-back'>
          <div className='flex gap-4 justify-between w-full p-5'>
            <input onChange={(e => setSearch(e.target.value))} placeholder='Cari income...' />
            <h2 onClick={() => setShowAddEvent(true)} className='button whitespace-nowrap'>Tambah Income</h2>
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
              total={_IncomeList?.data?.data.length}
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
            <Table.Column fullText resizable width={240}>
              <Table.HeaderCell>NAMA EVENT</Table.HeaderCell>
              <Table.Cell dataKey="income_target.event_name">
                {x => (
                  <Link href={`/events/${x.income_target.event_name.replace(/ /g, '-')}`} className='hover:underline font-semibold'>
                    <h1>{x.income_target.event_name}</h1>
                  </Link>
                )}
              </Table.Cell>
            </Table.Column>

            <Table.Column align='center' fullText resizable width={160}>
              <Table.HeaderCell>EVENT STATUS</Table.HeaderCell>
              <Table.Cell dataKey="income_target.event_status">
                {x => (
                  <h2 className={`${statusColor(x.income_target.event_status)} rounded-full uppercase text-xs small !w-fit !border-back font-medium !px-2 !py-0.5`}>
                    {statusDisplay(x.income_target.event_status)}
                  </h2>
                )}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>EVENT INCOME</Table.HeaderCell>
              <Table.Cell dataKey="income_value">
                {x => (<h2>{toRupiah(x.income_value)}</h2>)}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>INCOME DATE</Table.HeaderCell>
              <Table.Cell dataKey="income_release">
                {x => dayjs(Number(x.income_release)).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>INCOME RELEASE</Table.HeaderCell>
              <Table.Cell>
                {x => dayjs(Number(x.income_release)).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={170}>
              <Table.HeaderCell>INCOME UPDATE</Table.HeaderCell>
              <Table.Cell>
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
                      setShowDeleteEvent([true, x.income_target.event_name, x.id])
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
              <h2 className='font-semibold'>Yakin ingin menghapus Income?</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Income pada event <strong>{showDeleteEvent[1]}</strong> akan di hapus secara permanen dan tidak dapat di kembalikan.
            Apakah anda yakin ingin melakukan ini?
            <div className='flex items-center justify-between mt-7 -mb-3'>
              <h2 className={`${cache.get('del_ei')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('del_ei')?.[1]}</h2>
              <button onClick={handleDeleteEvent} disabled={cache.get('del_ei_load')} className='button bg-red-500'>{cache.get('del_ei_load') ? 'Tunggu...' : 'Hapus Income'}</button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal open={showAddEvent} backdrop='static' onClose={() => {
          setShowAddEvent(false)
          cache.clear()
        }}>
          <Modal.Header className='border-b pb-3'>
            <Modal.Title>
              <h2 className='font-semibold'>Tambah Income Baru</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onChange={handleAddEventChange} onSubmit={handleAddEvent} className='flex flex-col gap-3'>
              {listInput.map(x => (
                <div className='flex flex-col sm:flex-row gap-5'>
                  {x.map(o => (
                    <div className='input-body'>
                      <label>{o.t}</label>
                      {(!o.area && !o.select) && <input type={!!o.date ? 'datetime-local' : !!o.number && 'number'} id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                      {!!o.select && (
                        <select id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p}>
                          {o.select.map(s => (
                            <option value={s.id}>({s.event_status}) {s.event_name} - {s.event_kecamatan}</option>
                          ))}
                        </select>
                      )}
                      {!!o.area && <TextareaAutosize className='input-auto' id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                    </div>
                  ))}
                </div>
              ))}
              <div className='flex items-center justify-between mt-5 -mb-3'>
                <h2 className={`${cache.get('add_ei')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('add_ei')?.[1]}</h2>
                <fieldset disabled={isDisabled}>
                  <button type='submit' disabled={isDisabled} className='button'>{isLoading ? 'Tunggu...' : 'Buat Income'}</button>
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
              <h2 className='font-semibold line-clamp-1'>Edit Income "<strong>{showUpdateEvent[1]?.income_target.event_name}</strong>"</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onChange={handleAddEventChange} onSubmit={handleUpdateEvent} className='flex flex-col gap-3'>
              {listInput.map(x => (
                <div className='flex flex-col sm:flex-row gap-5'>
                  {x.map(o => (
                    <div className='input-body'>
                      <label>{o.t}</label>
                      {(!o.area && !o.select) && <input type={!!o.date ? 'datetime-local' : !!o.number && 'number'} id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                      {!!o.select && (
                        <select id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p}>
                          {o.select.map(s => (
                            <option value={s.id}>({s.event_status}) {s.event_name} - {s.event_kecamatan}</option>
                          ))}
                        </select>
                      )}
                      {!!o.area && <TextareaAutosize className='input-auto' id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />}
                    </div>
                  ))}
                </div>
              ))}
              <div className='flex items-center justify-between mt-5 -mb-3'>
                <h2 className={`${cache.get('add_ei')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('add_ei')?.[1]}</h2>
                <fieldset disabled={isDisabled}>
                  <button type='submit' disabled={isDisabled} className='button'>{isLoading ? 'Tunggu...' : 'Buat Income'}</button>
                </fieldset>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Layouts >
    </>
  )
}

export default IncomePage