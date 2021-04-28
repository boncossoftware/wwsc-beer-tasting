import LogoDark from 'assets/img/logo2018_dark.jpg';
import Logo from 'assets/img/logo2018.jpg';
import { Text } from './made-by-boncos.styles';
import { Link, Typography } from '@material-ui/core';

interface MadeByBoncosProps {
    variant?: string,
    className?: string,
}

const MadeByBoncos = (props: MadeByBoncosProps) => (
    <Text {...props}>
        Made by <Link href="https://boncos.io"><img src={Logo} alt="logo" /></Link>
    </Text>
);
export default MadeByBoncos;