import { usePathname } from 'next/navigation'
import React from 'react'
import { LuChevronRight } from 'react-icons/lu'

const Breadcumb = () => {
  const path = usePathname()

  return (
    <>
      <div className='flex items-center gap-1 mt-1 text-gray-400'>
        {path.slice(1).split('/').map((x, i) => (
          <>
            <h2 className='text-sm capitalize'>{x.replace(/-/g, ' ')}</h2>
            {i !== path.split('/').length - 2 && <LuChevronRight />}
          </>
        ))}
      </div>
    </>
  )
}

export default Breadcumb