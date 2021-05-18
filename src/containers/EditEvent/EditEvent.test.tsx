import ReactDOM from 'react-dom';
import { getActionRedutions, render, screen } from 'testing/test-utils';
import EditEvent from './EditEvent';
import { RootState, StoreError } from 'store';
import { act, fireEvent } from '@testing-library/react';
import {resetFirebaseMock} from 'testing/mock-firebase';
import { ACTION_EVENTS_UPDATE, ACTION_EVENTS_UPDATING } from 'store/reducers/events/update';
import { DEFAULT_EVENT } from '../../components/event-edit-form';

const TEST_ID = 'test-id';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () =>({ id: TEST_ID }),
}));


const createMockState = () => ({ 
    auth: {
        user: {email:'test', uid: 'test'}
    },
    events: {
        items: [{...DEFAULT_EVENT, id: TEST_ID}],
        itemsLoading: {[TEST_ID]: false},
        update: {
            updating: false,
            updated: null,
            error: null,
        },
    }
} as RootState);
/*
test('renders correctly', () => {
    render( <EditEvent />);

    const forgotContainer = document.getElementById('edit-event');
    expect(forgotContainer).toBeInTheDocument();
});

test('renders errors correctly', () => {
    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.update.error = error;
    
    const mockDispatch = jest.fn();
    render( <EditEvent />, {
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
    mockState.events.itemsLoading[TEST_ID] = true;
    
    const mockDispatch = jest.fn();
    render( <EditEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});


test('renders updating correctly', () => {
    const mockState = createMockState();
    mockState.events.update.updating = true;
    
    const mockDispatch = jest.fn();
    render( <EditEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const adding = screen.getByText(/updating.../ig);
    expect(adding).toBeInTheDocument();
});*/

test('renders handle update', async () => {
    const mockState = createMockState();
    let mockTastingEvent = mockState.events.items[0];
    resetFirebaseMock({
        getDocDataForID: (id) => {
            if (id === mockTastingEvent.id) {
                return mockTastingEvent;
            }
            return undefined;
        },
        updateDocDataForID: (id, data) => {
            if (mockTastingEvent.id === id) {
                mockTastingEvent = { ...mockTastingEvent, ...data };
            }
        }
    });

    //Add confirm to window.
    window.confirm = () => true;

    let dispatch: any;
    render( <EditEvent />, {
        initialState: mockState,
        wrapStore: (s:any) => {
            dispatch = jest.fn(s.dispatch)
            s.dispatch = dispatch;
            return s;
        }
    });
    //Await for the useEffect to get called.
    await act( () => new Promise(res => setTimeout(res, 10)));

    const mockFirebase = require('../../store/firebase').default;
    //Clear any load calls before the update call. 
    mockFirebase.firestore().collection.mock.calls = []; 
    dispatch.mock.calls = [];

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
    
    const updateButton = screen.getByText("Update");
    await act( async () => { fireEvent.click(updateButton) } );

    //Once during add.
    const collectionCall = mockFirebase.firestore().collection.mock.calls; 
    expect(collectionCall.length).toBe(3); //1 for events, 1 for results and 1 for answers.
    expect(collectionCall[0][0]).toBe('events');
    expect(collectionCall[1][0]).toBe('results');
    expect(collectionCall[2][0]).toBe('answers');

    expect(dispatch).toBeTruthy();
    const updateAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(updateAction, mockState);
    expect(reductions[0]).toStrictEqual(
        {type: ACTION_EVENTS_UPDATING, payload: true}
    );

    expect(reductions[1].type).toStrictEqual(ACTION_EVENTS_UPDATE);
    const payload = reductions[1].payload;
    expect(payload.name).toStrictEqual(name.value);
    expect(payload.venue).toStrictEqual(venue.value);
    expect(payload.date).toStrictEqual(new Date('2021-05-12 12:00'));
    expect(payload.price).toStrictEqual('Afl. 75');

    expect(reductions[2]).toStrictEqual(
        {type: ACTION_EVENTS_UPDATING, payload: false}
    );
});

