import { render, screen } from '@testing-library/react';
import CircularProgress from './full-page-circular-progress';

test('renders correctly', () => {
    render(
        <CircularProgress id="progress" />
    );

    const progress = document.getElementById('progress');
    expect(progress).toBeInTheDocument();
});
