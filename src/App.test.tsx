import { render, screen } from './testing/test-utils';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    const progress = screen.getByRole('progressbar', {hidden: true}); //hidden true because of fade in.
    expect(progress).toBeInTheDocument();
});
