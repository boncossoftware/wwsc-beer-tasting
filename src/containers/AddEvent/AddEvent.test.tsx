import ReactDOM from 'react-dom';
import { getActionRedutions, render, screen } from 'testing/test-utils';
import AddEvent from './AddEvent';
import { RootState, StoreError } from 'store';
import { act, fireEvent } from '@testing-library/react';
import {resetFirebaseMock} from 'testing/mock-firebase';
import { ACTION_EVENTS_ADD, ACTION_EVENTS_ADDING } from 'store/reducers/events/add';

const createMockState = () => ({ 
    auth: {
        user: {email:'test', uid: 'test'}
    },
    events: {
        add: {
            adding: false,
            added: null,
            error: null,
        },
    }
} as any as RootState);

test('renders correctly', () => {
    render( <AddEvent />);

    const forgotContainer = document.getElementById('add-event');
    expect(forgotContainer).toBeInTheDocument();
});

test('renders errors correctly', () => {
    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.add.error = error;
    
    const mockDispatch = jest.fn();
    render( <AddEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const errorElement = screen.getByText(
        `${error.message}(${error.code})`
    );
    expect(errorElement).toBeInTheDocument();
});

test('renders loading correctly', () => {
    const mockState = createMockState();
    mockState.events.add.adding = true;
    
    const mockDispatch = jest.fn();
    render( <AddEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const adding = screen.getByText(/adding.../ig);
    expect(adding).toBeInTheDocument();
});

test('renders handle add', async () => {
    resetFirebaseMock();

    const mockState = createMockState();
    let dispatch: any;
    render( <AddEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => {
            dispatch = jest.fn(s.dispatch)
            s.dispatch = dispatch;
            return s;
        }
    });
    
    const name = document.getElementById('name') as HTMLInputElement;
    await act( async () => { 
        fireEvent.change(name, {target:{ value: 'Event'}}) 
    });
    
    const venue = document.getElementById('venue') as HTMLInputElement;
    await act( async () => { 
        fireEvent.change(venue, {target:{ value: 'Place'}}) 
    });

    const date = document.getElementById('date') as HTMLInputElement;
    await act( async () => { 
        fireEvent.change(date, {target:{ value: '12-05-2021 12:00 pm'}}) 
    });

    const price = document.getElementById('price') as HTMLInputElement;
    await act( async () => { 
        fireEvent.change(price, {target:{ value: 'Afl. 75'}}) 
    });
    
    const addButton = screen.getByText("Add");
    await act( async () => { fireEvent.click(addButton) } );

    const mockFirebase = require('../../store/firebase').default;
    const collectionCall = mockFirebase.firestore().collection.mock.calls; 
    
    //Once during add.
    expect(collectionCall.length).toBe(1); 
    expect(collectionCall[0][0]).toBe('events');

    expect(dispatch).toBeTruthy();
    const addAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(addAction, mockState);
    expect(reductions[0]).toStrictEqual(
        {type: ACTION_EVENTS_ADDING, payload: true}
    );

    expect(reductions[1].type).toStrictEqual(ACTION_EVENTS_ADD);
    const payload = reductions[1].payload;
    expect(payload.name).toStrictEqual(name.value);
    expect(payload.venue).toStrictEqual(venue.value);
    expect(payload.date).toStrictEqual(new Date('2021-05-12 12:00'));
    expect(payload.price).toStrictEqual('Afl. 75');

    expect(reductions[2]).toStrictEqual(
        {type: ACTION_EVENTS_ADDING, payload: false}
    );
});

