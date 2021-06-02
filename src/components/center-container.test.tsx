import { screen } from '@testing-library/react';
import { render } from 'testing/test-utils';
import Container from './center-container';

test('renders correctly', () => {
    render(
        <Container id="container">
            Content
        </Container>
    );

    const container = document.getElementById('container');
    expect(container).toBeInTheDocument();  

    const content = screen.getByText(/content/gi);
    expect(content).toBeInTheDocument();  
});
