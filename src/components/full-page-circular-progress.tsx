import { 
    styled, 
    CircularProgress as BaseCircularProgress
} from "@material-ui/core";

const FullPageCircularProgress = styled(({...p})=> 
    <BaseCircularProgress {...p} size={40} />    
)(({theme}) => ({
    marginLeft: 'calc(50% - 20px)',
    marginTop: `calc(50vh - ${theme.mixins.toolbar.minHeight}px - 20px)`
}));

export default FullPageCircularProgress