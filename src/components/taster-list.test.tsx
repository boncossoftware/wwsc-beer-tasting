import { fireEvent, render, screen } from '@testing-library/react';
import TasterList from './taster-list';

test('renders correctly when empty', () => {
    render(
        <TasterList />
    );

    const empty = screen.getByText("No tasters added");
    expect(empty).toBeInTheDocument();
});

test('renders tasters correctly', () => {
    const tasters = ['test-taster1', 'test-taster2'];
    render(
        <TasterList tasters={tasters} />
    );

    const taster1 = screen.getByText(tasters[0]);
    expect(taster1).toBeInTheDocument();

    const taster2 = screen.getByText(tasters[1]);
    expect(taster2).toBeInTheDocument();
});

test('handles onclick taster correctly', () => {
    const tasters = ['test-taster1'];
    const onClickTaster = jest.fn();
    render(
        <TasterList tasters={tasters} onClickTaster={onClickTaster} />
    );
    const taster1 = screen.getByText(tasters[0]);
    fireEvent.click(taster1);

    expect(onClickTaster.mock.calls[0][0]).toBe(tasters[0]);
});

test('handles isTasterDisabled correctly', () => {
    const tasters = ['test-taster1', 'test-taster2'];
    const isTasterDisabled = (taster: string | null) => {
        return (taster === tasters[0]);
    };

    render(
        <TasterList 
            tasters={tasters} 
            isTasterDisabled={isTasterDisabled}
            itemsSelectable
        />
    );
    const items = screen.getAllByRole('button');

    const item1 = items[0] as HTMLDivElement;
    expect(item1.getAttribute('aria-disabled')).toBe("true");

    const item2 = items[1] as HTMLDivElement;
    expect(item2.getAttribute('aria-disabled')).toBe("false");
    
});

test('handles isTasterSelected is correctly', () => {
    const tasters = ['test-taster1', 'test-taster2'];
    const isTasterSelected = (taster: string | null): boolean => {
        return (taster === tasters[0]);
    };

    render(
        <TasterList 
            tasters={tasters} 
            isTasterSelected={isTasterSelected}
            itemsSelectable
        />
    );
    
    const items = screen.getAllByRole('button');

    const taster1Checkbox = items[0].getElementsByTagName('input')[0];
    expect(taster1Checkbox.checked).toBe(true);

    const taster2Checkbox = items[1].getElementsByTagName('input')[0];
    expect(taster2Checkbox.checked).toBe(false);

});