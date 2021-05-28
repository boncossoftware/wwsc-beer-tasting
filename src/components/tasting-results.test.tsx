import { render, screen } from '@testing-library/react';
import TastingResults from './tasting-results';

test('renders correctly', () => {
    render(
        <TastingResults results={[]} />
    );

    const section = document.getElementById('section');
    expect(section).toBeInTheDocument();

    const title = screen.getByText(/title/gi);
    expect(title).toBeInTheDocument();
    
    const item = screen.getByText(/test/gi);
    expect(item).toBeInTheDocument();

});