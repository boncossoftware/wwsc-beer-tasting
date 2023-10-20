import { 
    Container as BaseContainer,
    FormControl,
    FormControlLabel,
    styled,
    Switch,
    Divider,
} from "@material-ui/core";
import FullPageCircularProgress from "components/full-page-circular-progress";
import SectionGrid from "components/section-grid";

export const Container = BaseContainer;

export const CircularProgress = FullPageCircularProgress;

export const AllowEditField = styled(({ onChange, value, ...p }) => (
  <>
    <FormControl fullWidth {...p}>
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
    <Divider />
  </>
))(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),

  "& .MuiFormControlLabel-root": {
    marginLeft: 0,
  },

  [theme.breakpoints.down("xs")]: {
    "& .MuiTypography-root": {
      width: "100%",
    },
  },
}));

export const Section = SectionGrid;
