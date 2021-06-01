import { fireEvent, render, screen } from '@testing-library/react';
import BeerList from './beer-list';

test('renders correctly when empty', () => {
    render(
        <BeerList />
    );

    const empty = screen.getByText("No beers added");
    expect(empty).toBeInTheDocument();
});

test('renders beers correctly', () => {
    const beers = ['test-beer1', 'test-beer2'];
    render(
        <BeerList beers={beers} />
    );

    const beer1 = screen.getByText(beers[0]);
    expect(beer1).toBeInTheDocument();

    const beer2 = screen.getByText(beers[1]);
    expect(beer2).toBeInTheDocument();
});

test('handles onclick beers correctly', () => {
    const beers = ['test-beer1'];
    const onClickBeer = jest.fn();
    render(
        <BeerList beers={beers} onClickBeer={onClickBeer} />
    );
    const beer1 = screen.getByText(beers[0]);
    fireEvent.click(beer1);

    expect(onClickBeer.mock.calls[0][0]).toBe(beers[0]);
});

test('handles beerPreselectedIndex correctly', () => {
    const beers = ['test-beer1', 'test-beer2'];
    const beerPreselectedIndex = (beer: string | null) => {
        return (beer === beers[0]) ? 0 : -1;
    };

    render(
        <BeerList 
            beers={beers} 
            beerPreselectedIndex={beerPreselectedIndex} 
        />
    );
    const preSelected = screen.getByText("Selected in round 1");
    expect(preSelected).toBeInTheDocument();
});

test('handles isBeerSelected correctly', () => {
    const beers = ['test-beer1', 'test-beer2'];
    const isBeerSelected = (beer: string | null): boolean => {
        return (beer === beers[0]);
    };

    render(
        <BeerList 
            beers={beers} 
            isBeerSelected={isBeerSelected}
        />
    );
    
    const items = screen.getAllByRole('button');

    const beer1Checkbox = items[0].getElementsByTagName('input')[0];
    expect(beer1Checkbox.checked).toBe(true);

    const beer2Checkbox = items[1].getElementsByTagName('input')[0];
    expect(beer2Checkbox.checked).toBe(false);

});