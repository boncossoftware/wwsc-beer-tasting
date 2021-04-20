import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { auth } from '../../store';
import AuthenticationForm from '../../components/authentication-form';


const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector( s => s.auth.user );
    const error = useSelector( s => s.auth.loginError );
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        (loading && setLoading(false)); //Clear if user or error of these change.
    }, [user, error, loading]);

    const handleLogin = (email, password) => {
        dispatch( auth.login(email, password) );
        setLoading(true);
    }
    
    return (
        <div id="login">
            {user && <Redirect to="/" />}
            {loading && "loading..."}
            {error && `${error.message}(${error.code})`}
            <AuthenticationForm 
                id="login-form"
                error={error}
                loading={loading}
                submitButtonTitle="Login"
                onSubmit={handleLogin}
            />
            <br/>
            <br/>
            <NavLink to={`/forgot`}>Forgot Password?</NavLink><br/>
            <NavLink to={`/create-account`}>Create Account</NavLink><br/>
        </div>
    );
}

export default Login;