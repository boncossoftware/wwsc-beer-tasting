import ErrorMessage from "components/error-message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState, StoreError, UserInfo } from "store/reducer";
import { TastingEvent } from "store/reducers/events/reducer";
import { Result } from "store/reducers/results/reducer";
import TastingResults from "../../components/tasting-results";
import {results } from "../../store";
import {
  Container,
  CalculateResultsButton,
  ResultsCircularProgress,
  Section,
  ResultsContainer,
} from "./Results.styles";

const Results = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const user = useSelector<RootState, UserInfo | null>((s) => s?.auth?.user);

  const resultsLoading = useSelector<RootState, boolean>(
    (s) => s?.results?.itemsLoading[id]
  );
  const resultsError = useSelector<RootState, StoreError | undefined>(
    (s) => s?.results?.itemsError[id]
  );
  const tastingResults = useSelector<RootState, Result | undefined>((s) =>
    s?.results?.items?.find((i) => i.id === id)
  );
  const resultsCalculating = useSelector<RootState, boolean>(
    (s) => s?.results?.itemsCalculating[id]
  );
  const resultsCalculationError = useSelector<
    RootState,
    StoreError | undefined
  >((s) => s?.results?.itemsCalculationError[id]);

  const tastingEvent = useSelector<RootState, TastingEvent>(
    (s) => s?.events?.items?.find((i) => i.id === id) || ({} as TastingEvent)
  );

  const owner = tastingEvent.owner;
  const canEdit = owner === user?.email;
  const resultsAvailable = Boolean(tastingResults?.lastUpdated);

  useEffect(() => {
    dispatch(results.loadItem(id));
  }, [dispatch, id]);

  const handleCalculateResults = () => {
    dispatch(results.calculate(id));
  };

  return (
    <Container id="results" disableGutters>
        <Section>
        {resultsLoading || resultsCalculating ? (
            <ResultsCircularProgress />
        ) : (
            <ResultsContainer>
            {(resultsError || resultsCalculationError) && (
                <ErrorMessage
                error={resultsError || resultsCalculationError}
                />
            )}
            <TastingResults results={tastingResults} />
            {canEdit && (
                <CalculateResultsButton onClick={handleCalculateResults}>
                {resultsAvailable ? "Rec" : "C"}alculate Results
                </CalculateResultsButton>
            )}
            </ResultsContainer>
        )}
        </Section>
    </Container>
  );
};
export default Results;
