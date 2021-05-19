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
)({

});