
import ErrorMessage from "@/components/error-message";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState, StoreError } from "@/store";
import { TastingEvent } from "@/store/reducers/events/reducer";
import {
    Container,
    CircularProgress,
    Section,
    VenueInfoHeader,
    VenueInfoItem
} from './Venue.styles';

export type VenueParams = {
    id: string
}

const Venue = () => {
    const { id } = useParams<VenueParams>();
    const event = useSelector<RootState, TastingEvent | undefined>(
        s => s?.events?.items?.find(i => i.id === id)
    );
    const loading = useSelector<RootState, boolean>(
        s => s?.events?.itemsLoading[id]
    );
    const error = useSelector<RootState, StoreError | undefined>(
        s => s?.events?.itemsError[id]
    );

    const venue = event?.venue;
    const date = event?.date;
    const price = event?.price
    const formattedTime = date ? format(date, 'hh:mm aaa') : '-';
    const formattedDate = date ? format(date, 'dd MMM, yyyy') : 'No Date set';

    return (
        <Container data-testid="venue">
            {loading ?
                <CircularProgress />
                :
                <>
                    {error && <ErrorMessage error={error} />}
                    <Section>
                        <VenueInfoHeader venue={venue} />
                        <VenueInfoItem title="Time" value={formattedTime} />
                        <VenueInfoItem title="Date" value={formattedDate} />
                        <VenueInfoItem title="Price" value={price} />
                    </Section>
                </>
            }
        </Container>
    );
}
export default Venue;