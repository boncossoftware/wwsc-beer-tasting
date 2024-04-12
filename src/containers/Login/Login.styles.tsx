import {
    styled,
    Typography,
} from '@material-ui/core';
import BaseMadeByBoncos from '@/components/made-by-boncos';


export const FormInnerContainer = styled(({ ...p }) =>
    <div {...p} />
)({
    width: '100%'
});



export const Title = styled((p) =>
    <Typography variant="h4" {...p} />
)({

});

export const Subtitle = styled((p) =>
    <Typography variant="subtitle1" {...p} />)
    ({

    });

export const MadeByBoncos = styled(p =>
    <BaseMadeByBoncos {...p} />
)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    zIndex: 10001
}));