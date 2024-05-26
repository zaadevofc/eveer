import React from 'react'
import Aside from './Aside'
import Navbar from './Navbar'
import Breadcumb from './Breadcumb'


const Layouts = ({ children, title }) => {
  return (
    <>
      <main className='flex max-w-full w-full'>
        <Aside />
        <div className='flex flex-col w-full'>
          <Navbar />
          <div className='flex flex-col gap-6 p-4 sm:p-8'>
            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold text-gray-700'>{title ?? 'Dashboard'}</h2>
              <Breadcumb />
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  )
}

export default Layouts