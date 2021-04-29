import {
    TextField,
    Button,
    styled
} from '@material-ui/core';

export const Container = styled(p=>
    <form {...p} noValidate="novalidate"/>
)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

export const EmailField = styled(p=>
    <TextField 
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        {...p}
    />
)({

});

export const PasswordField = styled(p=>
    <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        {...p}
    />
)({

});

export const SubmitButton = styled(p=>
    <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        {...p}
    />
)( ({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));