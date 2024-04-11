import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { TastingEvent } from 'store/reducers/events/reducer';
import EventEditForm, { DEFAULT_EVENT } from './event-edit-form';



test('renders correctly', () => {

    const mockEvent = { ...DEFAULT_EVENT };
    render(
        <EventEditForm event={mockEvent} />
    );

    const formContainer = document.getElementById('event-edit-form');
    expect(formContainer).toBeInTheDocument();
});

const testValueChange = async (key: string, value: any, changes: any[], options?: any) => {
    const {
        expectedReturnValue,
        getValueHandler,
        useClick
    } = options ?? {};
    const e = (v: any) => ({ target: { value: v, checked: !v } });
    const elem = document.getElementById(key) as HTMLInputElement;
    if (!useClick) {
        await act(async () => { fireEvent.change(elem, e(value)) });
    }
    else {
        await act(async () => { fireEvent.click(elem, e(value)) });
    }
    const index = Math.max(0, changes.length - 1);
    const returnValue: any = (getValueHandler ?
        getValueHandler(changes[index][0])
        :
        changes[index][0][key]
    );
    expect(returnValue).toStrictEqual(expectedReturnValue ?? value);
}

test('handles changes correctly', async () => {

    const mockEvent: any = { ...DEFAULT_EVENT };
    const changes: any[] = [];
    const Component = () => {
        const [event, setEvent] = useState(mockEvent);
        return <EventEditForm event={event} onChange={e => {
            changes.push([e])
            setEvent(e);
            Object.assign(mockEvent, event);
        }} />
    }
    render(<Component />);

    await testValueChange('name', 'Event', changes);
    await testValueChange('venue', 'Place', changes);
    await testValueChange('date', '10-05-2021   12:00 pm', changes, {
        expectedReturnValue: new Date('2021-05-10 12:00')
    });
    await testValueChange('price', 'Afl. 75', changes);

    await testValueChange('bartender', 'bartender@gmail.com', changes);

    //Tasters (default 1 available)
    await testValueChange('taster-0', 'taster1@gmail.com', changes, {
        getValueHandler: (e: TastingEvent) => (e?.tasters || [])[0]
    });

    //Add a second taster.
    const addTaster = screen.getByText(/add taster/ig);
    fireEvent.click(addTaster);
    await testValueChange('taster-1', 'taster2@gmail.com', changes, {
        getValueHandler: (e: TastingEvent) => (e?.tasters || [])[1]
    });

    //Beer (default 1 available)
    await testValueChange('beer-0', 'Beer 1', changes, {
        getValueHandler: (e: TastingEvent) => (e?.beers || [])[0]
    });

    //Add a second beer.
    const addBeer = screen.getByText(/add beer/ig);
    fireEvent.click(addBeer);
    await act(() => new Promise(r => setTimeout(r, 2000)));
    await testValueChange('beer-1', 'Beer 2', changes, {
        getValueHandler: (e: TastingEvent) => (e?.beers || [])[1]
    });

    await testValueChange('asterisksAllowed', 3, changes);

});