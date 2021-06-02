import { render, screen } from './testing/test-utils';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    const initialLoadingElement = screen.getByText('loading...');
    expect(initialLoadingElement).toBeInTheDocument();
});
