import { ChangeEvent } from "react";
import { Chip, FormControlLabel, makeStyles, Radio, RadioGroup } from "@material-ui/core";

export type RatingProps = {
  id?: string;
  rating: number | null;
  onChange?: (rating: number | null, event?: ChangeEvent<{}>) => void;
  type: "edit" | "display" | undefined;
};

const useStyles = makeStyles({
  chipLabel: {
   fontSize: '0.70rem'
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

const Rating = ({ rating, onChange, type = "display"}: RatingProps) => {
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
        aria-label="rating"
        name="rating1"
        value={rating?.toString()}
        onChange={handleRatingClick}
      >
        {Object.keys(ratingOptions).map((value) => (
          <FormControlLabel
            value={value}
            control={<Radio />}
            label={`${value}. ${ratingOptions[value].label}`}
          />
        ))}
      </RadioGroup>
    );
  } else {
    if (rating != null) {
      return (
        <Chip
          label={`${rating}. ${ratingOptions[rating].label}`}
          size="small"
          variant="outlined"
          classes={{ label: classes.chipLabel }}
        />
      );
    } else {
      return <span>no rating selected</span>;
    }
  }
};
export default Rating;
