import React from 'react'
import Layouts from './Layouts'

const InfoScreen = ({ text }) => {
  return (
    <>
      <Layouts>
        <div className="max-w-3xl w-full px-8 py-6 mb-5 mx-auto border-back bg-white rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-light text-center mx-auto text-gray-600">
              {text}
            </span>
          </div>
        </div>
      </Layouts>
    </>
  )
}

export default InfoScreen