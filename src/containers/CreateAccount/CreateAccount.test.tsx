import { render, screen, fireEvent, getActionRedutions} from 'testing/test-utils';
import CreateAccount from './CreateAccount';
import {
    ACTION_AUTH_CREATING_ACCOUNT,
    ACTION_AUTH_CREATE_ACCOUNT_CREATED
} from 'store/reducers/auth/create-account';
import { RootState, StoreError } from 'store';

const createLoginMockState = () => ({ 
    auth: { 
        createAccount: {
            creating: false,
            created: false,
            error: null,
        }
    } 
} as RootState);


test('renders correctly', () => {
    render( <CreateAccount />);

    const forgotContainer = document.getElementById('create-account');
    expect(forgotContainer).toBeInTheDocument();
});

test('renders errors correctly', () => {
    const mockState = createLoginMockState();
    const error = new StoreError('error', 1);
    mockState.auth.createAccount.error = error;
    
    const mockDispatch = jest.fn();
    render( <CreateAccount />, {
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
    mockState.auth.createAccount.creating = true;
    
    const mockDispatch = jest.fn();
    render( <CreateAccount />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});

test('renders handle create account', async () => {
    const dispatch = jest.fn();
    render( <CreateAccount />, {
        wrapStore: (s:any) => ({ ...s, dispatch})
    });
    dispatch.mock.calls = []; //Reset any initial calls to dispatch.

    const email = document.getElementById('email') as HTMLInputElement;
    email.value = 'test@test.com';

    const password = document.getElementById('password') as HTMLInputElement;
    password.value = 'password';

    const createAccount = screen.getByText(/create account/gi);
    fireEvent.click(createAccount);

    const resetAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(resetAction);
    expect(reductions).toStrictEqual([
        {type: ACTION_AUTH_CREATING_ACCOUNT, payload: true},
        //We can't check the payload of user cred.
        {type: ACTION_AUTH_CREATE_ACCOUNT_CREATED, payload: undefined},
        {type: ACTION_AUTH_CREATING_ACCOUNT, payload: false},
    ]);
    
    const mockFirebase = require('../../store/firebase').default;
    const resetCalls = mockFirebase.auth().createUserWithEmailAndPassword.mock.calls; 
    expect(resetCalls.length).toBe(1);

    expect(resetCalls[0][0]).toBe(email.value);
    expect(resetCalls[0][1]).toBe(password.value);
});