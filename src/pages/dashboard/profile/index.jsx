'use client'

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Layouts from '../../../components/dashboard/Layouts';
import { checkLengthValue, customObj, postJson, cache, signJWT } from '../../../utils/tools';

const ProfilePage = () => {
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)

  const { data: user, update: updateSession } = useSession()

  const handleChange = (e) => {
    let savePay = (x) => cache.set('pay_pp', x);
    let getPay = () => cache.get('pay_pp');
    const target = e.target;
    const name = target.name;
    const value = target.value;
    savePay({ ...customObj(user, ['name', 'username']), ...getPay(), [name]: value })
    setDisabled(!checkLengthValue(getPay(), 2, 6))
  }

  const listInput = [
    [{ t: 'Name', p: '.....', v: user.name || '' }, { t: 'Username', p: '.....', v: user.username }],
    [{ t: 'Email', p: '.....', v: user.email, d: 1 }, { t: 'Role', p: '.....', v: user.role, d: 1 }],
  ]

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const handle = await postJson('/api/signal/user/update', {
      token: await signJWT({
        name: e.target.name.value,
        username: e.target.username.value,
        email: e.target.email.value,
      })
    })

    if (handle.ok) {
      updateSession()
    }

    cache.set('up_pp', [handle.ok, handle.message])
    setLoading(false)
  }

  return (
    <>
      <Layouts title={'User Management'}>
        <form onChange={handleChange} onSubmit={handleUpdate}>
          <div className='flex flex-col gap-5 rounded-xl bg-gray-50 border-back p-5'>
            <div className='flex items-center gap-5 mb-5'>
              <img className='w-20 rounded-full h-fit border' src={user.picture} alt={user.username} />
              <div className='flex flex-col'>
                <h2 className='font-bold'>{user.name || user.username}</h2>
                <h2 className='text-[15px] text-gray-500'>{user.name ? `@${user.username}` : user.email}</h2>
                <h2 className='text-xs uppercase text-gray-700 font-medium border-back bg-blue-200 px-2 w-fit rounded-full mt-2'>{user.role}</h2>
              </div>
            </div>
            {listInput.map(x => (
              <div className='flex flex-col lg:flex-row gap-5'>
                {x.map(o => (
                  <div className='input-body'>
                    <label>{o.t}</label>
                    <input id={o.t.toLocaleLowerCase()} name={o.t.toLocaleLowerCase()} defaultValue={o.v} required disabled={!!o.d} placeholder={o.p} />
                  </div>
                ))}
              </div>
            ))}
            <div className='flex items-center justify-between mt-2'>
              <h2 className={`${cache.get('up_pp')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('up_pp')?.[1]}</h2>
              <fieldset disabled={isDisabled}>
                <button type='submit' disabled={isDisabled} className='button'>{isLoading ? 'Tunggu...' : 'Simpan Perubahan'}</button>
              </fieldset>
            </div>
          </div>
        </form>
      </Layouts>
    </>
  )
}

export default ProfilePage