import {
  AppBar as BaseAppBar,
  styled,
  Typography
} from "@material-ui/core"

export const AppBar = styled(p =>
  <BaseAppBar position="sticky" {...p} />
)({
  top: 0
});

export const AppBarTitle = styled(({ children, ...p }) => {
  return <Typography variant="h6" {...p} children={children} />;
})(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    lineHeight: "1.05rem",
    fontSize: "1.00rem",
    wordBreak: "break-all",
  },
  [theme.breakpoints.between("sm", "md")]: {
    lineHeight: "1.15rem",
    fontSize: "1.10rem",
    wordBreak: "break-word",
  },
  marginLeft: theme.spacing(1),
  flexGrow: 1,
  fontWeight: "bold",
  textOverflow: "ellipsis",
  maxLines: 1,
  padding: theme.spacing(1),
  lineHeight: "1.05rem",
}));

