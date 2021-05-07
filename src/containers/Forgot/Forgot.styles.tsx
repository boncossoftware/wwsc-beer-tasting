import { 
    styled
} from "@material-ui/core";

export const Form = styled(p=>
    <form {...p} noValidate="novalidate"/>
)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});