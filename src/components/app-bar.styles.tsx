import { 
    AppBar as BaseAppBar, 
    styled, 
    Typography 
} from "@material-ui/core"

export const AppBar = styled(p=>
    <BaseAppBar position="sticky" {...p} />
)({
    top: 0
});

function getTextWidth(text: string, font ?: string | undefined) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (context) {
    context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  }
  else {
    return 0;
  }
}

export const AppBarTitle = styled(({ children, ...p }) => {
  if (typeof children === "string" || children instanceof String) {
    const width = getTextWidth(children as string);
    console.log(width);
  }
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

