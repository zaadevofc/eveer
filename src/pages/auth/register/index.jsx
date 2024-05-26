import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LuLogIn } from 'react-icons/lu'
import Layouts from '../../../components/Layouts'
import { hashPassword, postJson, signJWT } from '../../../utils/tools'

const RegisterPage = () => {
  const [isError, setError] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)

  const router = useRouter()

  const handleChange = (e) => {
    let pay = {};
    const target = e.target;
    const name = target.name;
    const value = target.value;
    pay[name] = value;
    setDisabled(pay[name].length < 6)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const handle = await postJson('/api/signal/auth/register', {
      token: await signJWT({
        username: e.target.username.value,
        email: e.target.email.value,
        password: await hashPassword(e.target.password.value),
      })
    })
    
    if (handle.ok) {
      router.push('/auth/login?reg=1')
    }

    setError([handle.ok, handle.message])
    setLoading(false)
  }

  return (
    <>
      <Layouts>
        <section>
          <div className="px-4 py-8 mx-auto lg:py-32 lg:px-6">
            <div className="max-w-sm mx-auto mb-8 lg:mb-20">
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-center">Buat Akun Eveer</h1>
              <form onSubmit={handleRegister} onChange={handleChange} className='flex flex-col gap-5 mt-8'>
                <h2 className={`${isError[0] ? 'text-green-600' : 'text-red-600'} mx-auto`}>{isError[1]}</h2>
                <input required id='email' type="email" placeholder='Masukan email....' />
                <input required id='username' type="text" placeholder='Masukan username....' />
                <input required id='password' type="password" placeholder='Masukan password....' />
                <fieldset disabled={isDisabled}>
                  <button type='submit' disabled={isDisabled} className={`${isDisabled && 'opacity-50'} button !w-full`}>{isLoading ? 'Tunggu...' : 'Buat Akun'}</button>
                </fieldset>
              </form>
              <h2 className='text-sm text-center my-10 text-gray-500'>Sudah punya Akun?</h2>
              <Link href='/auth/login'>
                <h2 className='flex items-center justify-center gap-3 !w-full button-border'>
                  <LuLogIn />
                  Masuk ke Akun
                </h2>
              </Link>
            </div>
          </div>
        </section>
      </Layouts>
    </>
  )
}

export default RegisterPage