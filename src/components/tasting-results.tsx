import { List } from "@material-ui/core";
import { Result } from "store/reducers/results/reducer";
import { AchievementItem, LineItem, RankingResult, Subheader } from './tasting-results.styles';

type TastingResultsProps = {
    results?: Result
}

const TastingResults = ({results}:TastingResultsProps) => {
    const available = Boolean(results?.lastUpdated);
    const lover = results?.roundResults[0];
    const hater = results?.roundResults?.reverse()[0];
    const resultsCount = results?.roundResults?.length||0;
    if (available) {
        return <List disablePadding>
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
        </List>
    }
    else {
        return <>
            <span>No results available.<br/></span>
        </>
    }
}
export default TastingResults;