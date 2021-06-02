import { render, screen} from 'testing/test-utils';
import Venue from './Venue';
import { RootState } from 'store';
import {resetFirebaseMock} from 'testing/mock-firebase';
import { StoreError } from '../../store';
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

    render( <Venue />);

    const container = document.getElementById('venue');
    expect(container).toBeInTheDocument();
});


test('renders errors correctly', () => {
    resetFirebaseMock();

    const mockState = createMockState();
    const error = new StoreError('error', 1);
    mockState.events.itemsError[TEST_ID] = error;
    
    const mockDispatch = jest.fn();
    render( <Venue />, {
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
    render( <Venue />, {
        initialState: mockState,
        wrapStore: (s:any) => ({
            ...s, 
            dispatch: mockDispatch
        })
    });

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
});