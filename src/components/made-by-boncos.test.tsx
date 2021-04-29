import { render, screen, fireEvent} from '@testing-library/react';
import MadeByBoncos from './made-by-boncos';

test('renders correctly', () => {
    render( <MadeByBoncos/> );

    const madeBy = screen.getByText(/made by/gi);
    expect(madeBy).toBeInTheDocument();

    const logo = screen.getByAltText(/logo/gi);
    expect(logo).toBeInTheDocument();
});