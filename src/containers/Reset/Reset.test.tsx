import { render, screen, fireEvent, getActionRedutions} from 'testing/test-utils';
import Reset from './Reset';
import {
    ACTION_AUTH_CONFIRMING_RESET_PASSWORD,
    ACTION_AUTH_CONFIRM_RESET_PASSWORD_CONFIRMED
} from 'store/reducers/auth/confirm-password-reset';
import { RootState, StoreError } from 'store';


const oobCode = 'test';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
      search: `oobCode=${oobCode}&email=test@email.com&mode=resetPassword`
    })
}));


const createLoginMockState = () => ({ 
    auth: { 
        confirmPasswordReset: {
            confirming: false,
            confirmed: false,
            error: null,
        },
    } 
} as RootState);


test('renders correctly', () => {
    render( <Reset />);

    const resetContainer = document.getElementById('reset');
    expect(resetContainer).toBeInTheDocument();
});

test('renders errors correctly', () => {
    const mockState = createLoginMockState();
    const error = new StoreError('error', 1);
    mockState.auth.confirmPasswordReset.error = error;
    
    const mockDispatch = jest.fn();
    render( <Reset />, {
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
    mockState.auth.confirmPasswordReset.confirming = true;
    
    const mockDispatch = jest.fn();
    render( <Reset />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});

test('renders handle save new password', async () => {
    const dispatch = jest.fn();
    render( <Reset />, {
        wrapStore: (s:any) => ({ ...s, dispatch})
    });
    dispatch.mock.calls = []; //Reset any initial calls to dispatch.

    const password = document.getElementById('password') as HTMLInputElement;
    password.value = 'password';

    const save = screen.getByText(/save new password/gi);
    fireEvent.click(save);

    const resetAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(resetAction);
    expect(reductions).toStrictEqual([
        {type: ACTION_AUTH_CONFIRMING_RESET_PASSWORD, payload: true},
        {type: ACTION_AUTH_CONFIRM_RESET_PASSWORD_CONFIRMED},
        {type: ACTION_AUTH_CONFIRMING_RESET_PASSWORD, payload: false},
    ]);
    
    const mockFirebase = require('../../store/firebase').default;
    const saveCalls = mockFirebase.auth().confirmPasswordReset.mock.calls; 
    expect(saveCalls.length).toBe(1);

    expect(saveCalls[0][0]).toBe(oobCode);
    expect(saveCalls[0][1]).toBe(password.value);
});