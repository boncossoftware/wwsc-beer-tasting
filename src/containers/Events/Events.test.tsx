import { render, screen, getActionRedutions} from 'testing/test-utils';
import Events from './Events';
import {
    ACTION_EVENTS_LOADING,
    ACTION_EVENTS_LOAD
} from 'store/reducers/events/load';
import { RootState, StoreError } from 'store';
import { act } from '@testing-library/react';
import {resetFirebaseMock} from 'testing/mock-firebase';

const createMockState = () => ({ 
    auth: {
        user: {email:'test', uid: 'test'}
    },
    events: { 
        loading: false,
        itemsLoading: {},
        itemsError: {},
        loaded: false,
        items: null,
        error: null,
    } 
} as any as RootState);


test('renders correctly', () => {
    render( <Events />);

    const container = document.getElementById('events');
    expect(container).toBeInTheDocument();
});


test('renders errors correctly', () => {
    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.error = error;
    
    const mockDispatch = jest.fn();
    render( <Events />, {
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
    mockState.events.loading = true;
    
    const mockDispatch = jest.fn();
    render( <Events />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});


test('renders handle reset', async () => {
    resetFirebaseMock();

    const mockState = createMockState();
    let dispatch;
    render( <Events />, {
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