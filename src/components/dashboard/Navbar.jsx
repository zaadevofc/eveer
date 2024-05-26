import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import { LuAlignLeft } from 'react-icons/lu'
import { SystemContext } from '../../provider'

const Navbar = () => {
  const { setAside } = useContext(SystemContext)
  const { data: user } = useSession()

  return (
    <>
      <div className='flex items-center justify-between border-b py-3 px-5'>
        <button onClick={() => setAside(true)} className='hidden max-[440px]:flex'>
          <h1>
            <LuAlignLeft className='stroke-[3] text-xl' />
          </h1>
        </button>
        <img className='w-8 h-fit ml-auto border rounded-full' src={user.picture} alt="" />
      </div>
    </>
  )
}

export default Navbar