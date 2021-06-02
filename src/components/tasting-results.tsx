import { List, Typography } from "@material-ui/core";
import { Result, ResultSummary } from "store/reducers/results/reducer";
import { AchievementItem, LineItem, NoResultsMessage, RankingResult, Subheader } from './tasting-results.styles';

type TastingResultsProps = {
    results?: Result
}

const TastingResults = ({results}:TastingResultsProps) => {
    const available = Boolean(results?.lastUpdated);
    let lover : ResultSummary | undefined;
    let hater : ResultSummary | undefined;
    results?.roundResults?.forEach( r => {
        lover = r.totalTaste < (lover?.totalTaste||Number.MAX_SAFE_INTEGER) ? r : lover;
        hater = r.totalTaste > (hater?.totalTaste||-0) ? r : hater;
    });
    const resultsCount = results?.roundResults?.length||0;
    return (
        <List disablePadding>
            {available ? 
                <>
                    <Subheader>Ranking</Subheader>
                    {results?.roundResults?.slice(0, 3).map( (s,i) =>
                        <RankingResult 
                            key={i} 
                            rank={i + 1} 
                            name={s.userEmail} 
                            points={s.totalPoints} 
                        />
                    )}
                    {!results?.roundResults?.length && 
                        <LineItem>No ranking results</LineItem>
                    }
                    <Subheader>Best Taste</Subheader>
                    {results?.beerScoreResults?.slice(0,3).map( (s, i) => 
                        <RankingResult 
                            key={i} 
                            rank={i + 1} 
                            name={s.name} 
                            points={s.points} 
                        />
                    )}
                    {!results?.beerScoreResults?.length && 
                        <LineItem>No taste score results</LineItem>
                    }
                    {(resultsCount > 1) && <>
                        <AchievementItem
                            achievement="Beer Lover"
                            receiver={lover?.userEmail || '-'}
                        />
                        <AchievementItem
                            achievement="Beer Hater"
                            receiver={hater?.userEmail || '-'}
                        />
                    </>}
                </>
                :
                <NoResultsMessage />
            }
        </List>
    );
}
export default TastingResults;