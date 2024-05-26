import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { LuPenSquare } from 'react-icons/lu'
import Layouts from '../../../components/Layouts'

const LoginPage = () => {
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)

  const isError = useSearchParams().get('error')
  const isReg = useSearchParams().get('reg') == '1'

  const handleChange = (e) => {
    let pay = {};
    const target = e.target;
    const name = target.name;
    const value = target.value;
    pay[name] = value;
    setDisabled(pay[name].length < 6)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const handle = await signIn('credentials', {
      access: 'login',
      email: e.target.email.value || '',
      password: e.target.password.value || ''
    })
  }

  return (
    <>
      <Layouts>
        <section>
          <div className="px-4 py-8 mx-auto lg:py-32 lg:px-6">
            <div className="max-w-sm mx-auto mb-8 lg:mb-20">
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-center">Masuk ke Eveer</h1>
              <form onSubmit={handleLogin} onChange={handleChange} className='flex flex-col gap-5 mt-8'>
                <h2 className={`${isError && 'text-red-600'} mx-auto`}>{isError && 'Masukan email/password yang benar!'}</h2>
                <h2 className={`${isReg && 'text-green-600 !block'} hidden mx-auto`}>{isReg && 'Registrasi berhasil silahkan login.'}</h2>
                <input required name='email' type="email" placeholder='Masukan email....' />
                <input required name='password' type="password" placeholder='Masukan password....' />
                <fieldset disabled={isDisabled}>
                  <button type='submit' disabled={isDisabled} className={`${isDisabled && 'opacity-50'} button !w-full`}>{isLoading ? 'Tunggu...' : 'Masuk'}</button>
                </fieldset>
              </form>
              <h2 className='text-sm text-center my-10 text-gray-500'>Belum punya Akun?</h2>
              <Link href='/auth/register'>
                <h2 className='flex items-center justify-center gap-3 !w-full button-border'>
                  <LuPenSquare />
                  Buat Akun Baru
                </h2>
              </Link>
            </div>
          </div>
        </section>
      </Layouts>
    </>
  )
}

export default LoginPage