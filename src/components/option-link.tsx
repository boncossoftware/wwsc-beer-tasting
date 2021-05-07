import { 
    Container as BaseContainer, 
    styled, 
    Link,
} from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const OptionLink = styled(p => 
    <Link component={NavLink} {...p} /> 
)({

});
export default OptionLink;

export const OptionsContainer = styled(p => 
    <BaseContainer {...p}/>
)( ({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing(3),
}));
