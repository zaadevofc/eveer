'use client'

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Alerts from '../../../components/dashboard/Alerts';
import Layouts from '../../../components/dashboard/Layouts';
import { checkLengthValue, postJson, cache, signJWT } from '../../../utils/tools';

const ChangePasswordPage = () => {
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)

  const { data: user, update: updateSession } = useSession()

  const handleChange = (e) => {
    let savePay = (x) => cache.set('pay_ch', x);
    let getPay = () => cache.get('pay_ch');
    const target = e.target;
    const name = target.name;
    const value = target.value;
    savePay({ ...getPay(), [name]: value })
    setDisabled(!checkLengthValue(getPay(), 3, 6))
  }

  const listInput = [
    [{ t: 'Email', p: '.....', v: user.email, d: 1 }, { t: 'Old Password', p: '.....' }],
    [{ t: 'New Password', p: '.....', }, { t: 'Confirm New Password', p: '.....' }],
  ]

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const handle = await postJson('/api/signal/user/change-password', {
      token: await signJWT({
        email: user.email,
        old_password: e.target['old password'].value,
        new_password: e.target['new password'].value,
        confirm_new_password: e.target['confirm new password'].value,
      })
    })

    if (handle.ok) {
      updateSession()
    }
    
    cache.set('up_ch', [handle.ok, handle.message])
    setLoading(false)
  }

  return (
    <>
      <Layouts title={'Ubah Password'}>
        <Alerts desc='Harap berhati - hati ketika mengganti password, pastikan untuk selalu mengingat password yang telah di ganti. Gunakan sandi yang rumit untuk menjaga keamanan akun' />
        <form onChange={handleChange} onSubmit={handleUpdate}>
          <div className='flex flex-col gap-5 rounded-xl bg-gray-50 border-back p-5'>
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
              <h2 className={`${cache.get('up_ch')?.[0] ? 'text-green-600' : 'text-red-600'}`}>{cache.get('up_ch')?.[1]}</h2>
              <fieldset disabled={isDisabled}>
                <button type='submit' disabled={isDisabled} className='button'>{isLoading ? 'Tunggu...' : 'Ubah Password'}</button>
              </fieldset>
            </div>
          </div>
        </form>
      </Layouts>
    </>
  )
}

export default ChangePasswordPage