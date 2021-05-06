import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { auth, RootState, StoreError } from '../../store';
import './Forgot.styles';

const Forgot = () => {
    const dispatch = useDispatch();
    const sent = useSelector<RootState, boolean>( s => s.auth.sendPasswordResetEmail.sent );
    const error = useSelector<RootState, StoreError|null>( s => s.auth.sendPasswordResetEmail.error );
    const resetting = useSelector<RootState, boolean>( s => s.auth.sendPasswordResetEmail.resetting );

    const handleReset = (event: MouseEvent) => {
        event.preventDefault();

        const form = document.getElementById('reset-form') as HTMLFormElement|undefined;
        const data = new FormData(form);

        const email: FormDataEntryValue | null = data.get('email');
        if (email !== null) {
            dispatch( auth.sendPasswordResetEmail(email as string) );
        }
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