import {
  IconButton,
  styled,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Container as BaseContainer,
} from "@material-ui/core";
import {
  AddCircleOutline,
  PlaceOutlined,
  CalendarToday,
} from "@material-ui/icons";
import FullPageCircularProgress from "@/components/full-page-circular-progress";

export const Container = styled((p) => <div {...p} />)({});

export const InnerContainer = styled((p) => (
  <BaseContainer {...p} disableGutters />
))({});

export const AddButton = styled((p) => (
  <IconButton color="inherit" {...p}>
    <AddCircleOutline />
  </IconButton>
))({});

export const CircularProgress = FullPageCircularProgress;

export const EventList = styled((p) => <List {...p} />)({});

export const EventListSectionHeader = styled((p) => <ListSubheader {...p} />)({
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  textTransform: "uppercase"
});

export const EventListItem = styled((p) => (
  <ListItem divider={true} button {...p} />
))(() => ({}));

export type EventListItemDetailsProps = {
  name?: string;
  venue?: string;
  date?: string;
  [key: string]: any;
};

export const EventListItemDetails = styled((p: EventListItemDetailsProps) => (
  <>
    <ListItemText
      primary={p.name}
      secondary={
        <div className="details">
          <span className="venue">
            <PlaceOutlined fontSize="inherit" />
            {p.venue}
          </span>
          {p.date && (
            <span className="date">
              <CalendarToday fontSize="inherit" />
              {p.date}
            </span>
          )}
        </div>
      }
      {...p}
    />
  </>
))(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    marginBottom: -2,
    marginRight: 3,
  },
  "& .MuiListItemText-primary": {
    marginBottom: theme.spacing(0.5),
  },
  "& .details": {
    width: "100%",
    display: "flex",
    "& .venue": {
      color: theme.palette.secondary.main,
      flex: 1,
      opacity: 0.5,
    },
    "& .date": {
      color: theme.palette.primary.main,
      flex: "flex-basis",
      opacity: 0.7,
    },
  },
}));
