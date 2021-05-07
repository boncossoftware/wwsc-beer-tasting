import { render, screen } from '@testing-library/react';
import ErrorMessage from './error-message';

test('renders correctly', () => {
    render(
        <ErrorMessage>Error</ErrorMessage>
    );

    const errorMessage = screen.getByText(/error/gi);
    expect(errorMessage).toBeInTheDocument();
});
