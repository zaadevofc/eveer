import React from 'react'
import Navbar from './Navbar'
import Footers from './Footers'

const Layouts = ({ children, className }) => {
  return (
    <>
      <Navbar />
      <main className={`${className} flex flex-col max-w-screen-xl mx-auto min-h-dvh pt-20`}>
        {children}
      </main>
      <Footers />
    </>
  )
}

export default Layouts