import ErrorMessage from "@/components/error-message";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { users, RootState, StoreError } from "@/store";
import { TastingEvent } from "@/store/reducers/events/reducer";
import TasterList from "../../components/taster-list";
import {
    Container,
    CircularProgress,
    Section
} from './Tasters.styles';
import { User } from "@/store/reducers/users/reducer";
import { useEffect } from "react";

export type TastersParams = {
    id: string
}

const Tasters = () => {
    const dispatch = useDispatch();
    const { id } = useParams<TastersParams>();
    const tasters = useSelector<RootState, User[] | null>(
        s => s?.users?.items
    );
    const loading = useSelector<RootState, boolean | undefined>(
        s => s?.users?.loading
    );
    const error = useSelector<RootState, StoreError | null>(
        s => s?.users?.error
    );

    useEffect(() => {
        dispatch(users.load(id));
    }, [id, dispatch]);
    return (
        <Container id="tasters" disableGutters>
            {loading ?
                <CircularProgress />
                :
                <>
                    {error && <ErrorMessage error={error} />}
                    <Section>
                        <TasterList tasters={tasters} />
                    </Section>
                </>
            }
        </Container>
    );
}
export default Tasters;