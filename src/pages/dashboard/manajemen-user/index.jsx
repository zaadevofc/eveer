'use client'

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { Modal, Pagination, Table } from 'rsuite';
import Loading from '../../../components/Loading';
import Alerts from '../../../components/dashboard/Alerts';
import Layouts from '../../../components/dashboard/Layouts';
import { cache, dayjs, postJson, signJWT, statusColor, useQFetchFn } from '../../../utils/tools';

const ManajemenUserPage = () => {
  const [isSearch, setSearch] = useState('')
  const [showDeleteUser, setShowDeleteUser] = useState([false, 'name', 'id'])

  const _UserList = useQFetchFn(async () => await postJson('/api/signal/user/lists', { token: await signJWT({ ok: true }) }), ['user_lists_dash'])
  const { data: user } = useSession()

  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  let data = _UserList?.data?.data
    ?.filter((v, i) => {
      if (isSearch.length > 0) return Object.values(v).join('').toLowerCase().includes(isSearch.toLowerCase())
      const start = limit * (page - 1);
      const end = start + limit;
      return i >= start && i < end;
    })

  const handleUpdateStatus = async (e, email) => {
    const res = await postJson('/api/signal/user/update', {
      token: await signJWT({
        email: email,
        role: e.target.value
      })
    })

    if (res.ok) {
      await _UserList.refetch()
    }
  }

  const handleDeleteUser = async (e) => {
    cache.set('del_user_load', true)
    const res = await postJson('/api/signal/user/delete', {
      token: await signJWT({
        email: user.email,
        id: showDeleteUser[2],
      })
    })

    cache.set('del_user', [res.ok, res.message])
    if (res.ok) {
      setShowDeleteUser([false])
      await _UserList.refetch()
    }
    cache.set('del_user_load', false)
  }

  if (_UserList.isLoading) return <Loading />

  return (
    <>
      <Layouts title={'Users Management'}>
        <Alerts desc={'Hanya admin lain yang dapat mengubah info akun Anda. User yang berstatus ADMIN tidak dapat di hapus kecuali Anda mengubahnya. Gunakan data secara bijak karna dapat beresiko.'} />
        <div className='flex flex-col pb-5 rounded-xl bg-white border-back'>
          <div className='flex gap-4 justify-between w-full p-5'>
            <input onChange={(e => setSearch(e.target.value))} placeholder='Cari user...' />
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
              layout={['total', '-', 'limit', 'pager']}
              total={_UserList?.data?.data?.length}
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
            <Table.Column fullText resizable width={250}>
              <Table.HeaderCell>USERNAME</Table.HeaderCell>
              <Table.Cell dataKey="username">
                {x => (<h1 className='font-semibold'>
                  {x.username} {x.email == user.email && '(Anda)'}
                </h1>)}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={270}>
              <Table.HeaderCell>EMAIL</Table.HeaderCell>
              <Table.Cell dataKey="email" />
            </Table.Column>

            <Table.Column align='center' fullText resizable width={100}>
              <Table.HeaderCell>ROLE</Table.HeaderCell>
              <Table.Cell dataKey="role">
                {x => (
                  <select disabled={x.email == user.email} onChange={(e) => handleUpdateStatus(e, x.email)} value={`${x.role}`}
                    className={`${statusColor(x.role)} ${x.email == user.email && 'opacity-50'} uppercase text-xs small !w-fit !border-back font-medium !px-2 !py-0.5`}>
                    <option value={`USER`}>USER</option>
                    <option value={`ADMIN`}>ADMIN</option>
                    <option value={`PANITIA`}>PANITIA</option>
                  </select>
                )}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={200}>
              <Table.HeaderCell>REGISTER</Table.HeaderCell>
              <Table.Cell dataKey="createdAt">
                {x => dayjs(x.createdAt).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={200}>
              <Table.HeaderCell>TERAKHIR UPDATE</Table.HeaderCell>
              <Table.Cell dataKey="updateAt">
                {x => dayjs(x.updateAt).format('HH:mm DD MMM YY')}
              </Table.Cell>
            </Table.Column>

            <Table.Column fullText resizable width={140} fixed='right' align='center'>
              <Table.HeaderCell>ACTION</Table.HeaderCell>
              <Table.Cell dataKey="updateAt">
                {x => (
                  <div className={`${(x.email == user.email || x.role == 'ADMIN') && 'opacity-50'} flex items-center gap-3`}>
                    <button disabled={(x.email == user.email || x.role == 'ADMIN')} onClick={() => {
                      cache.clear()
                      setShowDeleteUser([true, x.username, x.id])
                    }} className='p-1.5 rounded-md hover:bg-rose-50 border-back cursor-pointer'>
                      <LuTrash2 />
                    </button>
                  </div>
                )}
              </Table.Cell>
            </Table.Column>
          </Table>
        </div>

        <Modal open={showDeleteUser[0]} onClose={setShowDeleteUser}>
          <Modal.Header className='border-b pb-3'>
            <Modal.Title>
              <h2 className='font-semibold'>Yakin ingin menghapus User?</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            User <strong>{showDeleteUser[1]}</strong> akan di hapus secara permanen dan tidak dapat di kembalikan.
            Apakah anda yakin ingin melakukan ini?
            <div className='flex items-center justify-between mt-7 -mb-3'>
              <h2 className={`${cache.get('del_user')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('del_user')?.[1]}</h2>
              <button onClick={handleDeleteUser} disabled={cache.get('del_user_load')} className='button bg-red-500'>{cache.get('del_user_load') ? 'Tunggu...' : 'Hapus User'}</button>
            </div>
          </Modal.Body>
        </Modal>
      </Layouts >
    </>
  )
}

export default ManajemenUserPage