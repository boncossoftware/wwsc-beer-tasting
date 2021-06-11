import { render, screen } from '@testing-library/react';
import { StoreError } from 'store';
import ErrorMessage from './error-message';

test('renders correctly', () => {
    render(
        <ErrorMessage>Error</ErrorMessage>
    );

    const errorMessage = screen.getByText(/error/gi);
    expect(errorMessage).toBeInTheDocument();
});

test('renders correctly with error', () => {
    const error = new StoreError('Error', 100);
    render(
        <ErrorMessage error={error} />
    );

    const errorMessage = screen.getByText(/error\(100\)/gi);
    expect(errorMessage).toBeInTheDocument();
});

