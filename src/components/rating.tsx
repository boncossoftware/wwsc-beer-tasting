import { ChangeEvent } from "react";
import { Chip, FormControlLabel, makeStyles, Radio, RadioGroup, Typography } from "@material-ui/core";

export type RatingProps = {
  id?: string;
  rating: number | null;
  onChange?: (rating: number | null, event?: ChangeEvent<{}>) => void;
  type: "edit" | "display" | undefined;
};

const useStyles = makeStyles({
  rating: {
    fontSize: "0.70rem",
  },
});


const ratingOptions: {
  [index: string]: { label: string };
} = {
  '1': {
    label: "HMMMMM",
  },
  '2': {
    label: "HMMm",
  },
  '3': {
    label: "Ehhh",
  },
  '4': {
    label: "BLEHHH",
  },
};

const Rating = ({ id, rating, onChange, type = "display"}: RatingProps) => {
  const classes = useStyles();

  const handleRatingClick = (
    event: ChangeEvent<{}>,
    newRating: string | null
  ) => {
    if (rating === newRating) {
      //Clear the rating.
      onChange && onChange(null, event);
    } else {
      onChange && onChange(parseInt(newRating ?? '0'), event);
    }
  };
  
  if (type === 'edit') {
    return (
      <RadioGroup
        id={id}
        aria-label="rating"
        name="rating1"
        value={rating?.toString()}
        onChange={handleRatingClick}
      >
        {Object.keys(ratingOptions).map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={`${value}. ${ratingOptions[value].label}`}
            id={`beer-rating-${value}`}
          />
        ))}
      </RadioGroup>
    );
  } else {
    if (rating != null) {
      return (
        <Typography
          id={id}
          component="span"
          color="inherit"
          classes={{ root: classes.rating }}
        >{`${ratingOptions[rating].label} (${rating})`}</Typography>
      );
    } else {
      return <span>-</span>;
    }
  }
};
export default Rating;
