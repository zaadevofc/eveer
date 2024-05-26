import { useState } from 'react'
import { LuAlertTriangle, LuX } from 'react-icons/lu'

const Alerts = ({ icon, title, desc }) => {
  const [close, setClose] = useState(false)
  
  return (
    <>
      <div className={`${close && 'hidden'} h-fit flex flex-col gap-2 max-w-2xl w-full border rounded-xl p-4 bg-gray-50`}>
        <div className='flex justify-between h-fit'>
          <div className='flex gap-3 font-medium'>
            {icon ?? <LuAlertTriangle className={`fill-yellow-200 stroke-gray-700 text-xl`} />}
            <h2>{title ?? 'Peringatan!'}</h2>
          </div>
          <LuX onClick={() => setClose(true)} className='cursor-pointer hover:text-red-600 transition-all' />
        </div>
        <h2 className='text-gray-500 text-sm'>{desc ?? 'deskripsi'}</h2>
      </div>
    </>
  )
}

export default Alerts