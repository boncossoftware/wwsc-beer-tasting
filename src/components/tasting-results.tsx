import { List } from "@material-ui/core";
import { Result, ResultSummary } from "store/reducers/results/reducer";
import {
  AchievementItem,
  LineItem,
  NoResultsMessage,
  RankingResult,
  Subheader,
} from "./tasting-results.styles";
import { User } from "store/reducers/users/reducer";

type TastingResultsProps = {
  results?: Result;
  users?: User[] | null;
};

const TastingResults = ({ results, users }: TastingResultsProps) => {
  const available = Boolean(results?.lastUpdated);
  let lover: ResultSummary | undefined;
  let hater: ResultSummary | undefined;
  results?.roundResults?.forEach((r) => {
    lover =
      r.totalTaste < (lover?.totalTaste || Number.MAX_SAFE_INTEGER) ? r : lover;
    hater = r.totalTaste > (hater?.totalTaste || -0) ? r : hater;
  });

  const display = (email?: string | null) => {
    if (!email) return "-";
    const user = users?.find((u) => u.email === email);
    return user?.displayName ?? email;
  }

  const resultsCount = results?.roundResults?.length ?? 0;
  return (
    <List disablePadding>
      {available ? (
        <>
          <Subheader>Ranking</Subheader>
          {results?.roundResults?.map((s, i) => (
            <RankingResult
              key={i as any}
              rank={i + 1}
              name={display(s.userEmail)}
              points={s.totalPoints}
              isTied={s.isTied}
              tieBreakerReason={s.tieBreakerReason}
            />
          ))}
          {!results?.roundResults?.length && (
            <LineItem>No ranking results</LineItem>
          )}
          <Subheader>Best Taste</Subheader>
          {results?.beerScoreResults?.map((s, i) => (
            <RankingResult
              key={i as any}
              rank={i + 1}
              name={s.name}
              points={s.points}
            />
          ))}
          {!results?.beerScoreResults?.length && (
            <LineItem>No taste score results</LineItem>
          )}
          {resultsCount > 1 && (
            <>
              <AchievementItem
                achievement="Beer Lover"
                receiver={display(lover?.userEmail)}
              />
              <AchievementItem
                achievement="Beer Hater"
                receiver={display(hater?.userEmail)}
              />
            </>
          )}
        </>
      ) : (
        <NoResultsMessage />
      )}
    </List>
  );
};
export default TastingResults;
