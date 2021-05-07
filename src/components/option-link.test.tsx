import { render, screen } from '../testing/test-utils';
import { Router } from 'react-router';
import OptionLink, {OptionsContainer} from './option-link';

test('renders correctly', () => {
    render(
        <OptionLink to="/test">Link</OptionLink>
    );

    const link = screen.getByText(/link/gi);
    expect(link).toBeInTheDocument();
});

test('renders correctly inside it\'s container', () => {
    render(
        <OptionsContainer id='container'>
            <OptionLink to="/test">Link</OptionLink>
        </OptionsContainer>
    );

    const container = document.getElementById('container');
    expect(container).toBeInTheDocument();
    const link = screen.getByText(/link/gi);
    expect(link).toBeInTheDocument();
});