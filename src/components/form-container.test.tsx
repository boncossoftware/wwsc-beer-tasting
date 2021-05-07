import { render, screen } from '@testing-library/react';
import FormContainer, {CircularProgress} from './form-container'

test('renders correctly', () => {
    render(
        <FormContainer>Form</FormContainer>
    );

    const formContainer = screen.getByText(/form/gi);
    expect(formContainer).toBeInTheDocument();
});

test('renders correctly with circular progress', () => {
    render(
        <FormContainer><CircularProgress id='progress' /></FormContainer>
    );

    const progress = document.getElementById('progress');
    expect(progress).toBeInTheDocument();
});
