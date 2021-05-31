import { render, screen, getActionRedutions} from 'testing/test-utils';
import Tasting from './Tasting';
import { RootState } from 'store';
import { act } from '@testing-library/react';
import {resetFirebaseMock} from 'testing/mock-firebase';
import { StoreError } from '../../store';
import { 
    ACTION_EVENT_ANSWERS_ITEM_LOADING, 
    ACTION_EVENT_ANSWERS_LOAD_ITEM 
} from 'store/reducers/answers/load-item';
import { 
    ACTION_EVENT_RESULTS_ITEM_LOADING, 
    ACTION_EVENT_RESULTS_LOAD_ITEM 
} from 'store/reducers/results/load-item';

const TEST_ID = 'test-id';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () =>({ id: TEST_ID }),
}));

const createMockState = () => ({ 
    auth: {
        user: {email:'test', uid: 'test'}
    },
    answers: { 
        itemsLoading: {[TEST_ID]: false },
        itemsError: {[TEST_ID]: false }
    },
    results: { 
        itemsLoading: {[TEST_ID]: false },
        itemsCalculating: {[TEST_ID]: false },
        itemsError: {[TEST_ID]: false },
        itemsCalculationError: {[TEST_ID]: false }
    } 
} as any as RootState);


test('renders correctly', () => {
    resetFirebaseMock();

    render( <Tasting baseURL="/" />);

    const container = document.getElementById('tasting');
    expect(container).toBeInTheDocument();
});


test('renders answers errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.answers.itemsError[TEST_ID] = error;
    
    const mockDispatch = jest.fn();
    render( <Tasting baseURL="/" />, {
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


test('renders results errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.results.itemsError[TEST_ID] = error;
    
    const mockDispatch = jest.fn();
    render( <Tasting baseURL="/" />, {
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


test('renders results calulation errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.results.itemsCalculationError[TEST_ID] = error;
    
    const mockDispatch = jest.fn();
    render( <Tasting baseURL="/" />, {
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


test('renders answers loading correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    mockState.answers.itemsLoading[TEST_ID] = true;
    
    const mockDispatch = jest.fn();
    render( <Tasting baseURL="/" />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});


test('renders results loading correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    mockState.results.itemsLoading[TEST_ID] = true;
    
    const mockDispatch = jest.fn();
    render( <Tasting baseURL="/" />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});


test('renders results calculating correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    mockState.results.itemsCalculating[TEST_ID] = true;
    
    const mockDispatch = jest.fn();
    render( <Tasting baseURL="/" />, {
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
    let dispatch: jest.Mock;
    render( <Tasting baseURL="/" />, {
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
    expect(collectionCall.length).toBe(3); 
    expect(collectionCall[0][0]).toBe('events');
    expect(collectionCall[1][0]).toBe('answers');
    expect(collectionCall[2][0]).toBe('results');
    
    expect(docCall.length).toBe(3); 
    expect(docCall[0][0]).toBe(TEST_ID);
    expect(docCall[1][0]).toBe(mockState.auth.user?.email);
    expect(docCall[2][0]).toBe(TEST_ID);

    const answersLoadItemAction = dispatch!.mock.calls[0][0];
    let reductions = await getActionRedutions(answersLoadItemAction, mockState);
    expect(reductions[0]).toStrictEqual({
        type: ACTION_EVENT_ANSWERS_ITEM_LOADING, 
        payload: {id: TEST_ID, loading: true}
    });
    expect(reductions[1].type).toEqual(ACTION_EVENT_ANSWERS_LOAD_ITEM);
    expect(reductions[1].payload).toBeTruthy();
    expect(reductions[1].payload.id).toEqual(TEST_ID);
    expect(reductions[2]).toStrictEqual({
        type: ACTION_EVENT_ANSWERS_ITEM_LOADING, 
        payload: {id: TEST_ID, loading: false}
    });
    
    const resultsLoadItemAction = dispatch!.mock.calls[1][0];
    reductions = await getActionRedutions(resultsLoadItemAction, mockState);
    expect(reductions[0]).toStrictEqual({
        type: ACTION_EVENT_RESULTS_ITEM_LOADING, 
        payload: {id: TEST_ID, loading: true}
    });
    expect(reductions[1].type).toEqual(ACTION_EVENT_RESULTS_LOAD_ITEM);
    expect(reductions[1].payload).toBeTruthy();
    expect(reductions[1].payload.id).toEqual(TEST_ID);
    expect(reductions[2]).toStrictEqual({
        type: ACTION_EVENT_RESULTS_ITEM_LOADING, 
        payload: {id: TEST_ID, loading: false}
    });
});