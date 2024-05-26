import React from 'react'
import Brands from './Brands'

const Loading = () => {
  return (
    <>
      <div className='flex flex-col bg-white min-h-dvh justify-center items-center'>
        <Brands className='!text-4xl animate-pulse' />
      </div>
    </>
  )
}

export default Loading