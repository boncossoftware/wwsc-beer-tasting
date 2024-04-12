import { fireEvent, screen } from '@testing-library/react';
import { render } from 'testing/test-utils';
import AccountButton from './account-button';

test('renders correctly', () => {
    render(
        <AccountButton data-testid="account-button" />
    );

    const button = screen.getByTestId('account-button');
    expect(button).toBeInTheDocument();
});

test('handles onClickLogout correctly', () => {
    const onClickLogout = jest.fn();
    render(
        <AccountButton onClickLogout={onClickLogout} />
    );

    const accountButton = screen.getByRole('button');
    fireEvent.click(accountButton);

    const logoutButton = screen.getByText(/logout/gi);
    fireEvent.click(logoutButton);

    expect(onClickLogout.mock.calls.length).toBe(1);
});
