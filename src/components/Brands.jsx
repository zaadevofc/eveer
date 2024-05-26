import Link from 'next/link'
import React from 'react'

const Brands = ({ className, custom }) => {
  return (
    <>
      <Link href="/" className={`${className} flex items-center text-2xl`}>
        <h1 className="self-center font-extrabold whitespace-nowrap">
          {custom ?? 'Eveer'}
        </h1>
      </Link>
    </>
  )
}

export default Brands