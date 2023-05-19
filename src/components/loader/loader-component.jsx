import './loader-component.css'

import loaderImg from '../../assets/loader/loaderImg.svg'

export const Loader = () => (
    <div data-test-id='loader' className='loader'>
        <div className='loader__container'>
            <img className='loader__svg' src={loaderImg} alt='loader'/>
        </div>
    </div>    
)
