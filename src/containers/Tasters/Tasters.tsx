import ErrorMessage from "components/error-message";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState, StoreError, users } from "store";
import TasterList from "../../components/taster-list";
import {
    CircularProgress,
    Container,
    Section
} from './Tasters.styles';
import { useEffect } from "react";

export type TastersParams = {
    id: string
}

const Tasters = () => {
    const dispatch = useDispatch();
    const { id } = useParams<TastersParams>();
    const tasters = useSelector<RootState, string[] | undefined>(
        s => {
            const event = s?.events?.items?.find(i => i.id === id);
            const tasters = event?.tasters ?? [];
            const users = s?.users?.items?.filter(u => tasters.includes(u.id));
            return users?.map(u => u.displayName ?? u.email);
        }
    );
    const loading = useSelector<RootState, boolean | undefined>(
        s => s?.events?.itemsLoading[id] || s?.users?.loading
    );
    const error = useSelector<RootState, StoreError | undefined>(
        s => s?.events?.itemsError[id]
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