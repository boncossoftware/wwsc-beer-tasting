import { DocumentSnapshot } from 'store/firebase';
import { Result } from "./reducer";

export const resultsFromDoc = (doc: DocumentSnapshot): Result => {
    return {
        id: doc.id,
        beerScoreResults: doc?.data()?.beerScoreResults,
        roundResults: doc?.data()?.roundResults,
        lastUpdated: doc?.data()?.lastUpdated?.toDate(),
    }
}

interface IDItem {
    id: string;
}
export const addOrUpdateItem = (
  item: IDItem,
  items: IDItem[] | undefined | null
): IDItem[] => {
  const newItems = [...(items ?? [])];
  const foundIndex = newItems.findIndex((i) => i.id === item.id);
  if (foundIndex === -1) {
    newItems.push(item);
  } else {
    newItems[foundIndex] = item;
  }
  return newItems;
};