import React, { useEffect } from 'react'

const Carousel = ({ listImage }) => {
    return (
        <React.Fragment>
            <div id='carouselExampleIndicators' className='carousel slide'>
                <div className='carousel-indicators'>
                    {listImage.length > 0 && listImage.map((_, index, __) => (
                        <button key={index} type='button' data-bs-target='#carouselExampleIndicators' data-bs-slide-to={index} className={index === 0 ? 'active' : ''} aria-current={index === 0 ? 'true' : 'false'} aria-label={`Slide ${index + 1}`}></button>
                    ))}
                </div>
                <div className='carousel-inner'>
                    {listImage.length > 0 && listImage.map((val, index, _) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img src={`${process.env.NEXT_PUBLIC_RESTFUL_API}/carousel/gambar/${val.gambar}`} className='d-block w-100' alt='Carousel Item' />
                        </div>
                    ))}
                </div>
                <button className='carousel-control-prev' type='button' data-bs-target='#carouselExampleIndicators' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button className='carousel-control-next' type='button' data-bs-target='#carouselExampleIndicators' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>
        </React.Fragment >
    )
}

export default Carousel