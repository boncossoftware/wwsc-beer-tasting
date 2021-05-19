import { render, screen } from '@testing-library/react';
import CircularProgress from './full-page-circular-progress';

test('renders correctly', () => {
    render(
        <CircularProgress/>
    );

    const progress = document.getElementById('progress');
    expect(progress).toBeInTheDocument();
});
