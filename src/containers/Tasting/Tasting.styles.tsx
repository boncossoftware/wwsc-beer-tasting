import { 
    FormControl,
    FormControlLabel,
    styled,
    Switch
} from "@material-ui/core";
import FullPageCircularProgress from "../../components/full-page-circular-progress";



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