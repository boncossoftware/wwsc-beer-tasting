import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { auth } from '../../store';
import AuthenticationForm from '../../components/authentication-form';


const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector( s => s.auth.user );
    const error = useSelector( s => s.auth.login.error );
    const loading = useSelector( s => s.auth.login.loggingIn );

    useEffect( () => {
        dispatch( auth.resetLogin() );
    }, [user]);

    const handleLogin = (email, password) => {
        dispatch( auth.login(email, password) );
    }

    const handleMoveToOtherPage = () => {
        dispatch( auth.resetLogin() );
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
            <NavLink onClick={handleMoveToOtherPage} to={`/forgot`}>Forgot Password?</NavLink><br/>
            <NavLink onClick={handleMoveToOtherPage} to={`/create-account`}>Create Account</NavLink><br/>
        </div>
    );
}

export default Login;