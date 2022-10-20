import {DocumentSnapshot} from "store/firebase";
import { TastingAnswer } from "./reducer"

export const answerFromDoc = (doc: DocumentSnapshot): TastingAnswer => {
  return {
    id: doc.id,
    beers: doc.data()?.beers,
    asterisks: doc.data()?.asterisks,
    ratings: doc.data()?.ratings,
    changes: doc.data()?.changes,
    rounds: doc.data()?.rounds,
  };
};

export const answerToDocData = (answer: TastingAnswer) => {
    return {
        ...(answer.beers ? {beers: answer.beers} : {}),
        ...(answer.asterisks ? {asterisks: answer.asterisks} : {}),
        ...(answer.ratings ? {ratings: answer.ratings} : {}),
        ...(answer.changes ? {changes: answer.changes} : {}),
        ...(answer.rounds ? {rounds: answer.rounds} : {}),
    }   
}

const emptyList = (i = 0) => {
  let list = Array(i);
  for (i; i > 0; i--) list[i - 1] = null;
  return list;
};

export const newAnswersData = (rounds: number) => {
  return {
    beers: [...emptyList(rounds)],
    asterisks: [...emptyList(rounds)],
    ratings: [...emptyList(rounds)],
    changes: [...emptyList(rounds)],
    rounds,
  };
};