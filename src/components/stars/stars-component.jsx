/* eslint-disable react/no-array-index-key */

import fullStar from '../../assets/main/fullStar.svg'
import emptyStar from '../../assets/main/emptyStar.svg'
import './stars-component.css'

export function setStars(rating, layout) {

    const filledStar = Math.round(rating);
    const resultRating = [];

    if (rating === null) {
        return <p className='book__norating'>ещё нет оценок</p>
    }

    if (layout === 'true'){
        for (let i = 1; i <= 5; i++) {
            if( i<=filledStar){
                resultRating.push(<img src={fullStar} alt='star' className='star'/>)
            } else{
                resultRating.push(<img src={emptyStar} alt='star' className='star'/>)
            }
            
        }
    }
    if (layout === 'false'){
        for (let i = 1; i <= 5; i++) {
            if( i<=filledStar){
                resultRating.push(<img src={fullStar} alt='star' className='star__list'/>)
            } else {
                resultRating.push(<img src={emptyStar} alt='star' className='star__list'/>)
            }
            
        }
    }
    if (layout === 'book'){
        for (let i = 1; i <= 5; i++) {
            if( i<=filledStar){
                resultRating.push(<img src={fullStar} alt='star' data-test-id='star-active' className='book__page__rating__star'/>)
            } else {
                resultRating.push(<img src={emptyStar} alt='star' className='book__page__rating__star'/>)
            }
    
        }
    }

    return (
        <div className='book__rating'>
            {resultRating.map((item, index)=>
               <div key={index}>{item}</div>
            )}
        </div>
    )

}