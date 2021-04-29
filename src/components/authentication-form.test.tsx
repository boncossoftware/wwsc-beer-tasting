import { render, screen, fireEvent} from '@testing-library/react';
import AuthenticationForm from './authentication-form';

test('renders correctly', () => {
    const submitHandler = jest.fn();
    const testId = "test-id";
    const submitButtonTitle = "Submit";
    render(
        <AuthenticationForm 
            id="test-id" 
            submitButtonTitle={submitButtonTitle} 
            onSubmit={submitHandler} 
        />
    );

    const form = document.getElementById(testId);
    expect(form).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email address/gi);
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText(/password/gi);
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByText(submitButtonTitle);
    expect(submitButton).toBeInTheDocument();
});


test('renders onSubmit called correctly with email and password', () => {
    const submitHandler = jest.fn();
    const submitButtonTitle = 'submit';
    render(<AuthenticationForm submitButtonTitle={submitButtonTitle} onSubmit={submitHandler} />);

    const emailInput = screen.getByLabelText(/email address/gi) as HTMLInputElement;
    emailInput.value = 'johndoe@boncos.io';

    const passwordInput = screen.getByLabelText(/password/gi) as HTMLInputElement;
    passwordInput.value = 'password';

    const submitButton = screen.getByText(submitButtonTitle);
    fireEvent.click(submitButton);

    const calls = submitHandler.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(emailInput.value);
    expect(calls[0][1]).toBe(passwordInput.value);
});
