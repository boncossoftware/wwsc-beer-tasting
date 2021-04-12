import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { auth } from '../../store';


const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector( s => s.auth.user );
    const error = useSelector( s => s.auth.loginError );
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        (loading && setLoading(false)); //Clear if user or error of these change.
    }, [user, error, loading]);

    const handleLogin = (event) => {
        event.preventDefault();

        const form = document.getElementById('login-form');
        const data = new FormData(form);

        dispatch( auth.login(
            data.get('email'), 
            data.get('password'),  
        ));

        setLoading(true);
    }
    
    return (
        <form id="login-form">
            {user && <Redirect to="/" />}
            {loading && "loading..."}
            {error && `${error.message}(${error.code})`}

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email"/>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            <input type="submit" value="Login" onClick={handleLogin} />
            <br/>
            <br/>
            <NavLink to={`/forgot`}>Forgot Password?</NavLink><br/>
            <NavLink to={`/account`}>Create Account</NavLink><br/>
        </form>
    );
}

export default Login;