import { render, screen } from 'testing/test-utils';
import AddEvent from './AddEvent';
import {
    ACTION_EVENTS_LOADING,
    ACTION_EVENTS_LOAD
} from 'store/reducers/events/load';
import { RootState, StoreError } from 'store';
import { act, fireEvent } from '@testing-library/react';
import {resetFirebaseMock} from 'testing/mock-firebase';

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
} as RootState);


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
    let dispatch;
    render( <AddEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => {
            dispatch = jest.fn(s.dispatch)
            s.dispatch = dispatch;
            return s;
        }
    });
    
    const name = document.getElementById('name') as HTMLInputElement;
    name.value = 'Event';
    
    const venue = document.getElementById('venue') as HTMLInputElement;
    venue.value = 'Place';

    const date = document.getElementById('date') as HTMLInputElement;
    date.value = '12-05-2021  12:00 pm';

    const price = document.getElementById('price') as HTMLInputElement;
    price.value = 'Afl. 75';

    const addButton = screen.getByText("Add");
    console.log(addButton);
    await act( async () => fireEvent.click(addButton) );

    screen.debug();

    return
    const mockFirebase = require('../../store/firebase').default;
    const collectionCall = mockFirebase.firestore().collection.mock.calls; 
    //Once the the load and once for onSnapshot (in subscribe).
    expect(collectionCall.length).toBe(2); 
    expect(collectionCall[0][0]).toBe('events');

    const resetAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(resetAction, mockState);
    expect(reductions).toStrictEqual([
        {type: ACTION_EVENTS_LOADING, payload: true},
        {type: ACTION_EVENTS_LOAD, payload:[]},
        {type: ACTION_EVENTS_LOADING, payload: false},
    ]);
});