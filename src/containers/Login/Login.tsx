import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { auth, RootState } from '../../store';
import AuthenticationForm, {
    AuthenticationFormOnSubmitCallback
} from '../../components/authentication-form';
import {
    Container,
    Title,
    Subtitle,
    FormContainer,
    CircularProgress,
    OptionsContainer,
    OptionLink,
    ErrorMessage,
    MadeByBoncos
} from './Login.styles';
import { StoreError, UserInfo } from 'store/reducer';

const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector<RootState, UserInfo|null>( s => s.auth.user );
    const error = useSelector<RootState, StoreError|null>( s => s.auth.login.error );
    const loading = useSelector<RootState, boolean>( s => s.auth.login.loggingIn );

    useEffect( () => {
        dispatch( auth.resetLogin() );
    }, [user]);


    const handleLogin: AuthenticationFormOnSubmitCallback = (
        (email, password) => {
            dispatch( auth.login(email as string, password as string) );
        }
    );

    const handleMoveToOtherPage = () => {
        dispatch( auth.resetLogin() );
    }
    
    return (
        <Container 
            id="login" 
            
        >
            {user && <Redirect to="/" />}

            <Title>The Beer Tasting App</Title>
            <Subtitle>
                Log in...the beer is nice and cold!🍻
            </Subtitle>
            
            <FormContainer>
                {loading ? 
                    <CircularProgress />
                    :
                    <>
                        { error && 
                            <ErrorMessage>
                                {`${error.message}(${error.code})`}
                            </ErrorMessage>
                        }
                        <AuthenticationForm 
                            id="login-form"
                            submitButtonTitle="Login"
                            onSubmit={handleLogin}
                        />
                        <OptionsContainer>
                            <OptionLink 
                                onClick={handleMoveToOtherPage} 
                                to={`/forgot`}
                            >
                                Forgot Password?
                            </OptionLink>
                            <OptionLink 
                                onClick={handleMoveToOtherPage} 
                                to={`/create-account`}
                            >
                                Create Account
                            </OptionLink>
                        </OptionsContainer>
                    </>
                }
            </FormContainer>
            <MadeByBoncos />
        </Container>
    );
}

export default Login;