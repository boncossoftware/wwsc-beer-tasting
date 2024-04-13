import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AuthenticationForm, {
    AuthenticationFormOnSubmitCallback
} from '../../components/authentication-form';
import Container from 'components/center-container';
import FormContainer, { CircularProgress } from 'components/form-container';
import OptionLink, { OptionsContainer } from 'components/option-link';
import ErrorMessage from 'components/error-message';
import { auth, RootState } from 'store';
import { StoreError, UserInfo } from 'store/reducer';


const CreateAccount = () => {
    const dispatch = useDispatch();
    const user = useSelector<RootState, UserInfo | null>(s => s.auth.user);
    const error = useSelector<RootState, StoreError | null>(s => s.auth.createAccount.error);
    const loading = useSelector<RootState, boolean>(s => s.auth.createAccount.creating);

    useEffect(() => {
        dispatch(auth.resetCreateAccount());
    }, [user, dispatch]);

    const handleCreateAccount: AuthenticationFormOnSubmitCallback =
        (email, password) => {
            dispatch(auth.createAccount((email ?? '') as string, (password ?? '') as string));
        }

    const handleBackToLogin = () => {
        dispatch(auth.resetCreateAccount());
    }

    return (
        <Container
            id="create-account"
        >
            {user && <Redirect to="/" />}
            <FormContainer>
                {loading ?
                    <CircularProgress />
                    :
                    <>
                        {error && <ErrorMessage error={error} />}
                        <AuthenticationForm
                            id="create-account-form"
                            submitButtonTitle="Create Account"
                            onSubmit={handleCreateAccount}
                        />
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

export default CreateAccount;