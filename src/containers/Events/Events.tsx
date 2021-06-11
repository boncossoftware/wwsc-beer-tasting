import { MouseEventHandler, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { TastingEvent } from "store/reducers/events/reducer";
import { events, RootState, StoreError } from '../../store';
import AppBar from 'components/app-bar';
import {
    Container,
    InnerContainer,
    AddButton, 
    CircularProgress,
    EventList, 
    EventListItem, 
    EventListItemDetails,
    EventListSectionHeader
} from './Events.styles';
import ErrorMessage from "components/error-message";


const Events = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector<RootState, boolean>( s => s?.events?.loading );
    const items = useSelector<RootState, TastingEvent[]|null>( s => s?.events?.items );
    const error = useSelector<RootState, StoreError|null>( s => s?.events?.error );

    useEffect( () => {
        dispatch(events.load());
    }, [dispatch] );

    const handleAddEvent = () => {
        history.push('/event/add');
    }
    
    const handleClickEvent = (item: TastingEvent): MouseEventHandler => () => {
        history.push(`/event/${item.id}/`);
    }

    return <Container id="events"> 
        <AppBar 
            title="Events" 
            renderRightComponent={ () => <>
                <AddButton onClick={handleAddEvent} disabled={loading}/>
            </>}
        />
        <InnerContainer>
            <EventList>
            {loading ? 
                <CircularProgress />
                :
                <>
                    {error && <ErrorMessage error={error} />}
                    {items && items.map( (item, index) => {
                        const newMonth = items[index-1]?.date?.getMonth() != item.date?.getMonth();
                        return <div key={index}>
                            {newMonth && 
                                <EventListSectionHeader>
                                    {item.formattedMonth()}
                                </EventListSectionHeader>
                            }
                            <EventListItem onClick={ handleClickEvent(item) }>
                                <EventListItemDetails 
                                    name={item.name} 
                                    venue={item.venue} 
                                    date={item.formattedDate()}
                                />
                            </EventListItem>
                        </div>
                    })} 
                    {items?.length === 0 && <>No events.<br/></>}
                </>
            }
            </EventList>
        </InnerContainer>
    </Container>;
}
export default Events;