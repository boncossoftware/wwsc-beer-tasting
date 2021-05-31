import { ChangeEvent, MouseEvent } from "react";
import BaseRating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';

export type RatingProps = {
    id?: string,
    rating: number, 
    onChange?: (rating: number|null, event: ChangeEvent<{}>) => void,
}

const Rating = ({rating, onChange, ...p}: RatingProps) => {
    
    const handleRatingClick = (event: ChangeEvent<{}>, newRating: number|null) => {
        if (rating === newRating) {
            //Clear the rating.
            (onChange && onChange(null, event));
        }
        else {
            (onChange && onChange(newRating, event));
        }
    }

    return (
        <BaseRating
            name="beer-rating"
            value={rating}
            precision={1}
            max={4}
            emptyIcon={
                <StarBorderIcon fontSize="inherit" />
            }
            onChange={handleRatingClick}
            size="medium"
            readOnly={!Boolean(onChange)}
            {...p}
        />
    )
}
export default Rating;