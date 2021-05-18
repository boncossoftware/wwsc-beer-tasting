import { render, screen, getActionRedutions} from 'testing/test-utils';
import EventDetails from './EventDetails';
import {
    ACTION_EVENTS_ITEM_LOADING,
    ACTION_EVENTS_ITEM_LOAD
} from 'store/reducers/events/load-item';
import { RootState } from 'store';
import { act } from '@testing-library/react';
import {resetFirebaseMock} from 'testing/mock-firebase';
import { StoreError } from '../../store';

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
        itemsLoading: {[TEST_ID]: false },
        itemsError: {[TEST_ID]: false }
    } 
} as RootState);


test('renders correctly', () => {
    resetFirebaseMock();

    render( <EventDetails />);

    const container = document.getElementById('event-details');
    expect(container).toBeInTheDocument();
});


test('renders errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.itemsError[TEST_ID] = error;
    
    const mockDispatch = jest.fn();
    render( <EventDetails />, {
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
    resetFirebaseMock();

    const mockState = createMockState();
    mockState.events.itemsLoading[TEST_ID] = true;
    
    const mockDispatch = jest.fn();
    render( <EventDetails />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});


test('renders handle load', async () => {
    resetFirebaseMock();

    const mockState = createMockState();
    let dispatch;
    render( <EventDetails />, {
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
    const collectionCall = mockFirebase.firestore().collection.mock.calls; 
    const docCall = mockFirebase.firestore().doc.mock.calls; 

    //Once the the load.
    expect(collectionCall.length).toBe(1); 
    expect(collectionCall[0][0]).toBe('events');

    expect(docCall.length).toBe(1); 
    expect(docCall[0][0]).toBe(TEST_ID);

    const loadItemAction = dispatch.mock.calls[0][0];
    const reductions = await getActionRedutions(loadItemAction, mockState);
    expect(reductions[0]).toStrictEqual({
        type: ACTION_EVENTS_ITEM_LOADING, 
        payload: {id: TEST_ID, loading: true}
    });
    expect(reductions[1].type).toEqual(ACTION_EVENTS_ITEM_LOAD);
    expect(reductions[1].payload).toBeTruthy();
    expect(reductions[1].payload.id).toEqual(TEST_ID);
    expect(reductions[2]).toStrictEqual({
        type: ACTION_EVENTS_ITEM_LOADING, 
        payload: {id: TEST_ID, loading: false}
    });
    
});

