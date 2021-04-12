import { parse } from 'qs';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { auth } from '../../store';
import { RESET_PASSWORD_CONFIRM_MODE_RESET_PASSWORD } from '../../store/reducers/auth';


const Login = () => {
    const location = useLocation()
    const dispatch = useDispatch();
    const confirmed = useSelector( s => s.auth.confirmPasswordReset.confirmed );
    const error = useSelector( s => s.auth.confirmPasswordReset.error );
    const confirming = useSelector( s => s.auth.confirmPasswordReset.confirming );

    const {email, mode, oobCode=''} = parse(location.search);
    const resetMode = (mode !== RESET_PASSWORD_CONFIRM_MODE_RESET_PASSWORD);

    const handleSaveNewPassword = (event) => {
        event.preventDefault();

        const form = document.getElementById('reset-password-form');
        const data = new FormData(form);

        dispatch( auth.confirmPasswordReset(
            oobCode, 
            data.get('password'),  
        ));
    }
    
    return (
        <form id="reset-password-form">
            {!resetMode && <Redirect to="/" />}

            {error && `${error.message}(${error.code})`}

            {!confirmed ? 
                <>
                    <input type="hidden" id="email" name="email" value={email}/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" disabled={confirming}/>
                    <input type="submit" value="Save New Password" disabled={confirming} onClick={handleSaveNewPassword} />
                </>
                :
                <>
                    <p>Your password has been reset! Try login in with your new password.</p>  
                </>
            }
            <br/>
            <br/>
            <NavLink to={`/login`}>Back to Login</NavLink><br/>
        </form>
    );
}

export default Login;