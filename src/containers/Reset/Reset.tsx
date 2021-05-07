import { parse } from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { auth, RootState, StoreError } from 'store';
import { RESET_PASSWORD_CONFIRM_MODE_RESET_PASSWORD } from 'store/reducers/auth';
import FormContainer, { CircularProgress } from 'components/form-container';
import { Form } from './Reset.styles';
import Container from 'components/center-container';
import ErrorMessage from 'components/error-message';
import OptionLink, { OptionsContainer } from 'components/option-link';
import { SubmitButton, PasswordField } from 'components/authentication-form.styles';
import { Typography } from '@material-ui/core';


const Login = () => {
    const location = useLocation()
    const dispatch = useDispatch();
    const confirmed = useSelector<RootState, boolean>( s => s.auth.confirmPasswordReset.confirmed );
    const error = useSelector<RootState, StoreError|null>( s => s.auth.confirmPasswordReset.error );
    const confirming = useSelector<RootState, boolean>( s => s.auth.confirmPasswordReset.confirming );

    const {email, mode, oobCode=''} = parse(location.search);
    const resetMode = (mode !== RESET_PASSWORD_CONFIRM_MODE_RESET_PASSWORD);

    const handleSaveNewPassword = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        const form = document.getElementById('reset-password-form') as HTMLFormElement|undefined;
        const data = new FormData(form);

        dispatch( auth.confirmPasswordReset(
            oobCode as string|null, 
            data.get('password') as string|null,  
        ));
    }
    
    return (
        <Container
            id='reset'
        >
            {!resetMode && <Redirect to="/" />}
            <FormContainer>
                {confirming ? 
                    <CircularProgress />
                    :
                    <>
                        { error && 
                            <ErrorMessage>
                                {`${error.message}(${error.code})`}
                            </ErrorMessage>
                        }
            
                        <Form id="reset-password-form">
                            {!confirmed ? 
                                <>
                                    <input type="hidden" id="email" name="email" value={email as string|undefined}/>
                                    <PasswordField />
                                    <SubmitButton 
                                        onClick={handleSaveNewPassword}
                                    >
                                        Save New Password
                                    </SubmitButton>
                                </>
                                :
                                <Typography>Your password has been reset! Try login in with your new password.</Typography>  
                            }
                        </Form>
                        <OptionsContainer>
                            <OptionLink
                                to={`/login`}
                            >
                                Back to Login
                            </OptionLink>
                        </OptionsContainer>
                    </>
                }
            </FormContainer>
        </Container>
    );
}

export default Login;