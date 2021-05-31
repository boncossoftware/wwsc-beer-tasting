import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Rating from './rating';

test('renders correctly', () => {
    render(
        <Rating id="rating" rating={4} />
    );

    const progress = document.getElementById('rating');
    expect(progress).toBeInTheDocument();
});

test('handles changes correctly', async () => {
    const onChange = jest.fn();
    render(
        <Rating rating={0} onChange={onChange} />
    );

    const maxBeerRating = document.getElementById('beer-rating-4');
    expect(maxBeerRating).toBeInTheDocument();
    
    fireEvent.click(maxBeerRating!);
    
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe(4);

});