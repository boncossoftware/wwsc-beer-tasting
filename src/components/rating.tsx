import { MouseEvent } from "react";

export type RatingProps = {
    rating: number, 
    onChange?: (rating: number|null, event: MouseEvent) => void
}

const Rating = ({rating, onChange}: RatingProps) => {
    const handleRatingClick = (newRating: number) => (event: MouseEvent) => {
        if (rating === newRating) {
            //Clear the rating.
            (onChange && onChange(null, event));
        }
        else {
            (onChange && onChange(newRating, event));
        }
    }
    return (
        <span>
            <span onClick={handleRatingClick(1)}>{(rating < 1) ? '☆' : '★'}</span>
            <span onClick={handleRatingClick(2)}>{(rating < 2) ? '☆' : '★'}</span>
            <span onClick={handleRatingClick(3)}>{(rating < 3) ? '☆' : '★'}</span>
            <span onClick={handleRatingClick(4)}>{(rating < 4) ? '☆' : '★'}</span>
        </span>
    )
}
export default Rating;