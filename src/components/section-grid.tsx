import {
    styled,
    Grid,
    Typography,
    Divider, 
} from '@material-ui/core';

const SectionGrid = styled(({children, title, ...p}) => 
    <div  {...p}>
        {title && <>
            <Typography variant="h5">{title}</Typography>
            <Divider />
        </>}
        <Grid container direction="column">
            {children}
        </Grid>
    </div>
)(({theme}) => ({   
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8),
    minHeight: theme.spacing(10),

    '& h5': {
        //Fix the line dissapearing when not alligned properly.
        marginBottom: theme.spacing(1)
    },

    '& .MuiDivider-root': {
        //Fix the line dissapearing when not alligned properly.
        height: '1.1px' 
    }
}));

export default SectionGrid;