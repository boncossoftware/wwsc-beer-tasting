import { render, screen, fireEvent, getActionRedutions} from '../../testing/test-utils';
import Forgot from './Forgot';
import {
    ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL,
    ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_ERROR,
    ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_SENT
} from '../../store/reducers/auth/send-password-reset-email';
import { RootState, StoreError } from 'store';

const createLoginMockState = () => ({ 
    auth: { 
        sendPasswordResetEmail: {
            resetting: false,
            sent: false,
            error: null,
        }
    } 
} as RootState);


test('renders correctly', () => {
    render( <Forgot />);

    const forgotContainer = document.getElementById('forgot');
    expect(forgotContainer).toBeInTheDocument();
});


test('renders errors correctly', () => {
    const mockState = createLoginMockState();
    const error = new StoreError('error', 1);
    mockState.auth.sendPasswordResetEmail.error = error;
    
    const mockDispatch = jest.fn();
    render( <Forgot />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const errorElement = screen.getByText(
        `${error.message}(${error.code})`
    );
    expect(errorElement).toBeInTheDocument();
});


test('renders loading correctly', () => {
    const mockState = createLoginMockState();
    mockState.auth.sendPasswordResetEmail.resetting = true;
    
    const mockDispatch = jest.fn();
    render( <Forgot />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});

test('renders handle login', async () => {
    const dispatch = jest.fn();
    render( <Forgot />, {
        wrapStore: (s:any) => ({ ...s, dispatch})
    });
    dispatch.mock.calls = []; //Reset any initial calls to dispatch.

    const email = document.getElementById('email') as HTMLInputElement;
    email.value = 'test@test.com';

    const reset = screen.getByText(/reset password/gi);
    fireEvent.click(reset);

    const resetAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(resetAction);
    expect(reductions).toStrictEqual([
        {type: ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL, payload: true},
        //We can't check the payload of user cred.
        {type: ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_SENT},
        {type: ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL, payload: false},
    ]);
    
    const mockFirebase = require('../../store/firebase').default;
    const resetCalls = mockFirebase.auth().sendPasswordResetEmail.mock.calls; 
    expect(resetCalls.length).toBe(1);

    expect(resetCalls[0][0]).toBe(email.value);
});