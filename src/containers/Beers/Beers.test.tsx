import { render, screen, getActionRedutions} from 'testing/test-utils';
import Beers from './Beers';
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
import { DEFAULT_EVENT } from 'components/event-edit-form';

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
        itemsError: {[TEST_ID]: false },
        items: [{...DEFAULT_EVENT, id: TEST_ID}]
    } 
} as any as RootState);


test('renders correctly', () => {
    resetFirebaseMock();

    render( <Beers />);

    const container = document.getElementById('beers');
    expect(container).toBeInTheDocument();
});


test('renders errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.itemsError[TEST_ID] = error;
    
    const mockDispatch = jest.fn();
    render( <Beers />, {
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
    render( <Beers />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});
