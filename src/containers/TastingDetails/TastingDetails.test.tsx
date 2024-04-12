import { render, screen, getActionRedutions } from '@/testing/test-utils';
import TastingDetails from './TastingDetails';
import { RootState } from '@/store';
import { act } from '@testing-library/react';
import { resetFirebaseMock } from '@/testing/mock-firebase';
import { StoreError } from '../../store';
import {
    ACTION_EVENT_ANSWERS_ITEM_LOADING,
    ACTION_EVENT_ANSWERS_LOAD_ITEM
} from '@/store/reducers/answers/load-item';
import { DEFAULT_EVENT } from '../../components/event-edit-form';
import {
    ACTION_EVENTS_ITEM_LOAD,
    ACTION_EVENTS_ITEM_LOADING
} from '@/store/reducers/events/load-item';

const TEST_ID = 'test-id';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => ({ id: TEST_ID, round: '1' }),
}));

const mockAnswers = {
    id: TEST_ID,
    beers: [null],
    ratings: [null],
    asterisks: [false],
    changes: 0
};

const createMockState = () => ({
    auth: {
        user: { email: 'test', uid: 'test' }
    },
    events: {
        items: [{ ...DEFAULT_EVENT, id: TEST_ID }],
        itemsLoading: { [TEST_ID]: false },
        itemsError: { [TEST_ID]: false }
    },
    answers: {
        items: [mockAnswers],
        itemsLoading: { [TEST_ID]: false },
        itemsError: { [TEST_ID]: false },
        update: {
            updating: false,
            updated: null,
            error: null,
        }
    },

} as any as RootState);


test('renders correctly', () => {
    resetFirebaseMock();

    render(<TastingDetails />);

    const container = document.getElementById('tasting-details');
    expect(container).toBeInTheDocument();
});


test('renders answers errors correctly', async () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.answers.update.error = error;

    const mockDispatch = jest.fn();
    render(<TastingDetails />, {
        initialState: mockState,
        wrapStore: (s: any) => ({
            ...s,
            dispatch: mockDispatch
        })
    });
    const errorElement = screen.getByText(
        `${error.message}(${error.code})`
    );
    expect(errorElement).toBeInTheDocument();
});


test('renders event errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.itemsError[TEST_ID] = error;

    const mockDispatch = jest.fn();
    render(<TastingDetails />, {
        initialState: mockState,
        wrapStore: (s: any) => ({
            ...s,
            dispatch: mockDispatch
        })
    });

    const errorElement = screen.getByText(
        `${error.message}(${error.code})`
    );
    expect(errorElement).toBeInTheDocument();
});


test('renders event loading correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    mockState.events.itemsLoading[TEST_ID] = true;
    mockState.events!.items = [];

    const mockDispatch = jest.fn();
    render(<TastingDetails />, {
        initialState: mockState,
        wrapStore: (s: any) => ({
            ...s,
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});

test('renders answers loading correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    mockState.answers.itemsLoading[mockState.auth.user!.email] = true;

    const mockDispatch = jest.fn();
    render(<TastingDetails />, {
        initialState: mockState,
        wrapStore: (s: any) => ({
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
    render(<TastingDetails />, {
        initialState: mockState,
        wrapStore: (s: any) => {
            dispatch = jest.fn(s.dispatch)
            s.dispatch = dispatch;
            return s;
        }
    });
    //Await for the useEffect to get called.
    await act(() => new Promise(res => setTimeout(res, 10)));

    const mockFirebase = require('../../store/firebase').default;
    const collectionCall = mockFirebase.firestore().collection.mock.calls;
    const docCall = mockFirebase.firestore().doc.mock.calls;

    //Once the the load.
    expect(collectionCall.length).toBe(6); //Once for get and once for subscribe
    expect(collectionCall[0][0]).toBe('events');
    expect(collectionCall[1][0]).toBe('events');
    expect(collectionCall[2][0]).toBe('answers');

    expect(docCall.length).toBe(5);
    expect(docCall[0][0]).toBe(TEST_ID);
    expect(docCall[1][0]).toBe(TEST_ID);
    expect(docCall[2][0]).toBe(mockState.auth.user?.email);

    const eventsLoadItemAction = dispatch!.mock.calls[0][0];
    let reductions = await getActionRedutions(eventsLoadItemAction, mockState);
    expect(reductions[0]).toStrictEqual({
        type: ACTION_EVENTS_ITEM_LOADING,
        payload: { id: TEST_ID, loading: true }
    });
    expect(reductions[1].type).toEqual(ACTION_EVENTS_ITEM_LOAD);
    expect(reductions[1].payload).toBeTruthy();
    expect(reductions[1].payload.id).toEqual(TEST_ID);
    expect(reductions[2]).toStrictEqual({
        type: ACTION_EVENTS_ITEM_LOADING,
        payload: { id: TEST_ID, loading: false }
    });

    const answersLoadItemAction = dispatch!.mock.calls[1][0];
    reductions = await getActionRedutions(answersLoadItemAction, mockState);
    expect(reductions[0]).toStrictEqual({
        type: ACTION_EVENT_ANSWERS_ITEM_LOADING,
        payload: { id: mockState.auth.user?.email, loading: true }
    });
    expect(reductions[1].type).toEqual(ACTION_EVENT_ANSWERS_LOAD_ITEM);
    expect(reductions[1].payload).toBeTruthy();
    expect(reductions[1].payload.id).toEqual(mockState.auth.user?.email);
    expect(reductions[2]).toStrictEqual({
        type: ACTION_EVENT_ANSWERS_ITEM_LOADING,
        payload: { id: mockState.auth.user?.email, loading: false }
    });

});
