import { 
    styled,
    Container as BaseContainer
} from "@material-ui/core";

export const Container = styled(p => 
    <BaseContainer maxWidth='sm' {...p}/>
)(
    p => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: p.theme.spacing(5),
    })
);

export const Form = styled(p=>
    <form {...p} noValidate="novalidate"/>
)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});