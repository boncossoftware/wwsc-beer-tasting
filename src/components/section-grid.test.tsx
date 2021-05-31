import { Grid } from '@material-ui/core';
import { render, screen } from '@testing-library/react';
import SectionGrid from './section-grid';

test('renders correctly', () => {
    render(
        <SectionGrid id="section" title="Title">
            <Grid item>Test</Grid>
        </SectionGrid>
    );

    const section = document.getElementById('section');
    expect(section).toBeInTheDocument();

    const title = screen.getByText(/title/gi);
    expect(title).toBeInTheDocument();
    
    const item = screen.getByText(/test/gi);
    expect(item).toBeInTheDocument();

});