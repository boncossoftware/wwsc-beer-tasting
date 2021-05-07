import { render, screen, fireEvent, getActionRedutions} from '../../testing/test-utils';
import Login from './Login';
import {
    ACTION_AUTH_LOGGING_IN,
    ACTION_AUTH_LOG_IN_LOGGED_IN,
    ACTION_AUTH_LOG_IN_ERROR
} from '../../store/reducers/auth/login';
import { RootState, StoreError } from 'store';

const createLoginMockState = () => ({ 
    auth: { 
        user: null,
        login: {
            loggingIn: false,
            loggedIn: false,
            error: null 
        },
    } 
} as RootState);

test('renders correctly', () => {
    render( <Login />);

    const loginContainer = document.getElementById('login');
    expect(loginContainer).toBeInTheDocument();
});


test('renders errors correctly', () => {
    const mockState = createLoginMockState();
    const error = new StoreError('error', 1);
    mockState.auth.login.error = error;
    
    const mockDispatch = jest.fn();
    render( <Login />, {
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
    mockState.auth.login.loggingIn = true;
    
    const mockDispatch = jest.fn();
    render( <Login />, {
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
    render( <Login />, {
        wrapStore: (s:any) => ({ ...s, dispatch})
    });
    dispatch.mock.calls = []; //Reset any initial calls to dispatch.

    const email = document.getElementById('email') as HTMLInputElement;
    email.value = 'test@test.com';
    
    const password = document.getElementById('password') as HTMLInputElement;
    password.value = 'password';

    const login = screen.getByText(/login/gi);
    fireEvent.click(login);

    const loginAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(loginAction);
    expect(reductions).toStrictEqual([
        {type: ACTION_AUTH_LOGGING_IN, payload: true},
        //We can't check the payload of user cred.
        {type: ACTION_AUTH_LOG_IN_LOGGED_IN, payload: undefined},
        {type: ACTION_AUTH_LOGGING_IN, payload: false},
    ]);
    
    const mockFirebase = require('../../store/firebase').default;
    const loginCalls = mockFirebase.auth().signInWithEmailAndPassword.mock.calls; 
    expect(loginCalls.length).toBe(1);

    expect(loginCalls[0][0]).toBe(email.value);
    expect(loginCalls[0][1]).toBe(password.value);
});