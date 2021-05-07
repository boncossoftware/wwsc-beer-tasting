import { Typography } from '@material-ui/core';
import { EmailField, SubmitButton } from 'components/authentication-form';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer, {CircularProgress} from 'components/form-container';
import { auth, RootState, StoreError } from '../../store';
import './Forgot.styles';
import { Form } from './Forgot.styles';
import Container from 'components/center-container';
import OptionLink, {OptionsContainer} from 'components/option-link';
import ErrorMessage from 'components/error-message';

const Forgot = () => {
    const dispatch = useDispatch();
    const sent = useSelector<RootState, boolean>( s => s.auth.sendPasswordResetEmail.sent );
    const error = useSelector<RootState, StoreError|null>( s => s.auth.sendPasswordResetEmail.error );
    const resetting = useSelector<RootState, boolean>( s => s.auth.sendPasswordResetEmail.resetting );

    const handleReset = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        const form = document.getElementById('reset-form') as HTMLFormElement|undefined;
        const data = new FormData(form);

        const email: FormDataEntryValue | null = data.get('email');
        dispatch( auth.sendPasswordResetEmail(email as string|null) );
    }

    const handleBackToLogin = () => {
        dispatch( auth.resetSendPasswordResetEmail());
    }
    
    return (
        <Container
            id="forgot" 
        >
            <FormContainer>
                {resetting ? 
                    <CircularProgress />
                    :
                    <>
                        { error && 
                            <ErrorMessage>
                                {`${error.message}(${error.code})`}
                            </ErrorMessage>
                        }
                        <Form id="reset-form">
                            {!sent ? 
                                <>
                                    <EmailField/>
                                    <SubmitButton
                                        onClick={handleReset}
                                    >
                                        Reset Password
                                    </SubmitButton>
                                </>
                                :
                                <>
                                    <Typography>Password reset email sent. Check your email inbox (or junk).</Typography>  
                                </>
                            }
                        </Form>
                        <OptionsContainer>
                            <OptionLink 
                                onClick={handleBackToLogin} 
                                to={`/login`}
                            >
                                Back to login
                            </OptionLink>
                        </OptionsContainer>
                    </>
                }
            </FormContainer>
        </Container>
    );
}

export default Forgot;