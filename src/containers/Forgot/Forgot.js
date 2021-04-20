import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { auth } from '../../store';

const Forgot = () => {
    const dispatch = useDispatch();
    const sent = useSelector( s => s.auth.sendPasswordResetEmail.sent );
    const error = useSelector( s => s.auth.sendPasswordResetEmail.error );
    const resetting = useSelector( s => s.auth.sendPasswordResetEmail.resetting );

    const handleReset = (event) => {
        event.preventDefault();

        const form = document.getElementById('reset-form');
        const data = new FormData(form);

        dispatch( auth.sendPasswordResetEmail(
            data.get('email')
        ));
    }

    const handleBackToLogin = () => {
        dispatch( auth.resetSendPasswordResetEmail());
    }
    
    return (
        <form id="reset-form">
            {error && `${error.message}(${error.code})`}

            {!sent ? 
                <>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" disabled={resetting}/>
                    <input type="submit" value="Reset Password" disabled={resetting} onClick={handleReset} />
                </>
                :
                <>
                    <p>Password reset email sent. Check your email inbox (or junk).</p>  
                </>
            }
            <br/>
            <br/>
            <NavLink onClick={handleBackToLogin} to={`/login`}>Back to login</NavLink><br/>
        </form>
    );
}

export default Forgot;