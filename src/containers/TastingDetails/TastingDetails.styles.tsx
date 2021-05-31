import {
    Button,
    styled,
    Typography,
    Container as BaseContainer,
    Switch,
    FormControl,
    FormLabel as BaseFormLabel,
    FormHelperText
} from "@material-ui/core";
import {
    Alert
} from '@material-ui/lab';
import BeerList from "components/beer-list";
import FullPageCircularProgress from "components/full-page-circular-progress";
import Rating from "components/rating";
import SectionGrid from "components/section-grid";

export const Container = styled(({ ...p }) =>
    <div {...p} />
)(({ theme }) => ({

}));

export const InnerContainer = styled(({ ...p }) =>
    <BaseContainer {...p} />
)(({ theme }) => ({
    marginBottom: theme.mixins.toolbar.minHeight,
}));

export const CancelButton = styled((p) =>
    <Button {...p} color="inherit" >
        <Typography variant="button" color="inherit">Cancel</Typography>
    </Button>
)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));


export const UpdateButton = styled(({ isSaving, ...p }: any) =>
    <Button {...p} color="inherit" disabled={isSaving || false}>
        <Typography color="inherit">{isSaving ? 'Updating...' : 'Update'}</Typography>
    </Button>
)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    fontWeight: 'bold'
}));

export const CircularProgress = FullPageCircularProgress;

export const InformationMessage = styled(p =>
    <Alert
        elevation={6}
        variant="filled"
        severity="info"
        {...p}
    />
)(({ theme }) => ({
    marginBottom: theme.spacing(3)
}));

export const Section = SectionGrid;

export const BeerListCaption = styled(p =>
    <Typography variant="caption" {...p} />
)({

});

const FormLabel = styled( p =>
    <BaseFormLabel {...p} />
)(({theme}) => ({
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.text.primary
}));

export const BeerSelectionField = styled(({
    beers,
    beerPreselectedIndex,
    isBeerSelected,
    onClickBeer,
    ...p
}) =>
    <FormControl
        margin="normal"
        fullWidth
        {...p}
    >
        <FormLabel>
            Select Beer
        </FormLabel>
        <BeerList
            beers={beers}
            beerPreselectedIndex={beerPreselectedIndex}
            isBeerSelected={isBeerSelected}
            onClickBeer={onClickBeer}
        />
        <FormHelperText>
            Already selected beers are greyed out but can still be selected.
        </FormHelperText>
    </FormControl>
)(({ theme }) => ({
    marginTop: theme.spacing(4),
}));


export const RatingField = styled(({
    selectedRating,
    onChange,
    ...p
}) =>
    <FormControl
        margin="normal"
        fullWidth
        {...p}
    >
        <FormLabel>
            Rating
        </FormLabel>
        <Rating
            rating={selectedRating}
            onChange={onChange}
            size="large"
        />
    </FormControl>
)(({ theme }) => ({
    marginTop: theme.spacing(4),
    '& .MuiRating-root': {
        marginTop: theme.spacing(1),
        width: 'fit-content',
    }
}));

export const AsteriskedField = styled(({
    selected,
    onChange,
    asterisksLeft,
    disabled,
    ...p
}) =>
    <FormControl
        margin="normal"
        fullWidth
        {...p}
    >
        <FormLabel>
            Asterisk
        </FormLabel>
        <Switch
            checked={selected}
            onChange={onChange}
            name="asterisked"
            disabled={disabled}
        />
        <FormHelperText>{asterisksLeft} Left</FormHelperText>
    </FormControl>
)(({ theme }) => ({
    marginTop: theme.spacing(4),
}))

export const ChangesMadeField = styled(({
    changesMade,
    ...p
}) =>
    <FormControl
        margin="normal"
        fullWidth
        {...p}
    >
        <FormLabel>
            Changes Made
        </FormLabel>
        <Typography variant="subtitle1">
            {changesMade}
        </Typography>
    </FormControl>
)(({ theme }) => ({
    marginTop: theme.spacing(4),
    '& h6': {
        marginTop: theme.spacing(1),
    }
}))