import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import AuthenticationForm from '../../components/authentication-form';
import { auth } from '../../store';


const CreateAccount = () => {
    const dispatch = useDispatch();
    const user = useSelector( s => s.auth.user );
    const error = useSelector( s => s.auth.createAccount.error );
    const loading = useSelector( s => s.auth.createAccount.creating );

    useEffect( () => {
        dispatch( auth.resetCreateAccount() );
    }, [user]);

    const handleCreateAccount = (email, password) => {
        dispatch( auth.createAccount(email, password) );
    }

    const handleBackToLogin = () => {
        dispatch( auth.resetCreateAccount());
    }
    
    return (
        <div id="create-account">
            {user && <Redirect to="/" />}
            {loading && "loading..."}
            {error && `${error.message}(${error.code})`}
            <AuthenticationForm
                id="create-account-form"
                submitButtonTitle="Create Account"
                onSubmit={handleCreateAccount}
            />
            <br/>
            <br/>
            <NavLink onClick={handleBackToLogin} to={`/login`}>Back to login</NavLink><br/>
        </div>
    );
}

export default CreateAccount;