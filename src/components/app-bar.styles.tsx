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

export const AppBarTitle = styled(p=>
    <Typography variant="h6" {...p} />
)({
    flexGrow: 1,
    fontWeight: 'bold'
});

