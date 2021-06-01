import { fireEvent, render, screen } from '@testing-library/react';
import BeerListItem from './beer-list-item';

test('renders correctly', () => {
    const beerName = "test-beer";
    render(
        <BeerListItem beer={beerName} />
    );

    const beer = screen.queryByText(beerName);
    expect(beer).toBeInTheDocument();
    
});


test('renders preselecte index correctly', () => {
    const preSelectedIndex = 0;
    render(
        <BeerListItem beer={"test-beer"} preSelectedIndex={preSelectedIndex} />
    );

    const preSelectedMessage = screen.queryByText(`Selected in round ${preSelectedIndex+1}`);
    expect(preSelectedMessage).toBeInTheDocument();
    
});


test('renders selected correctly', () => {
    render(
        <BeerListItem beer={"test-beer"} selected={true} />
    );

    const checkbox = document.getElementsByTagName('input')[0] as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);
});


test('renders onclick correctly', () => {
    const onClick = jest.fn();
    render(
        <BeerListItem beer={"test-beer"} onClick={onClick}/>
    );
    
    const item = screen.queryByRole('button');
    expect(item).toBeInTheDocument()
    fireEvent.click(item!);

    expect(onClick.mock.calls.length).toBe(1);
    
});
