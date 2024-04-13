import { fireEvent, render, screen } from '@testing-library/react';
import TasterListItem from './taster-list-item';

test('renders correctly', () => {
    const tasterName = "test-taster";
    render(
        <TasterListItem taster={tasterName} />
    );

    const beer = screen.queryByText(tasterName);
    expect(beer).toBeInTheDocument();

});


test('renders disabled correctly', () => {
    render(
        <TasterListItem taster={"test-taster"} disabled selectable />
    );

    const item = screen.getByRole('button');
    expect(item.getAttribute('aria-disabled')).toBe('true');
});


test('renders selected correctly', () => {
    render(
        <TasterListItem taster={"test-taster"} selected={true} selectable />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);
});


test('renders onclick correctly', () => {
    const onClick = jest.fn();
    render(
        <TasterListItem taster={"test-taster"} onClick={onClick} selectable />
    );

    const item = screen.queryByRole('button');
    expect(item).toBeInTheDocument()
    fireEvent.click(item!);

    expect(onClick.mock.calls.length).toBe(1);

});
