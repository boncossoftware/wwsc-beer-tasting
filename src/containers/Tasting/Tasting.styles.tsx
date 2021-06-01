import { 
    Container as BaseContainer,
    Button,
    FormControl,
    FormControlLabel,
    styled,
    Switch,
} from "@material-ui/core";
import FullPageCircularProgress from "components/full-page-circular-progress";
import SectionGrid from "components/section-grid";

export const Container = BaseContainer;

export const CircularProgress = FullPageCircularProgress;

export const AllowEditField = styled(({onChange, value, ...p})=> 
    <FormControl
        fullWidth
        {...p}
    >
    <FormControlLabel
        control={ 
            <Switch 
                color="primary" 
                onChange={onChange} 
                checked={Boolean(value)}
            />
        }
        label="Allow Editing"
        labelPlacement="start"
    />
    </FormControl>
)(({theme})=>({
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    '& .MuiFormControlLabel-root': {
        marginLeft: 0,
    },

    [theme.breakpoints.down('xs')]: {
        '& .MuiTypography-root': {
            width: '100%',
        }
    }
}));

export const Section = SectionGrid;

export const ResultsCircularProgress = styled( ({...p}) =>
    <FullPageCircularProgress {...p} />
)(({theme}) => ({
    marginLeft: 'calc(50% - 20px)',
    marginTop: `calc(25vh - ${theme.mixins.toolbar.minHeight}px - 20px)`,
    marginBottom: `calc(25vh - ${theme.mixins.toolbar.minHeight}px - 20px)`
}));

export const CalculateResultsButton = styled( ({...p}) =>
    <Button variant="outlined" color="primary" {...p}/>
)(({theme}) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(10),
}));


