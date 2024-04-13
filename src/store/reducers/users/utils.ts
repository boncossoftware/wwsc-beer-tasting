import { DocumentSnapshot } from "store/firebase";
import "firebase/firestore";
import { User } from "./reducer";

export const userFromDoc = (doc: DocumentSnapshot | null): User => {
  return {
    id: doc?.id ?? "no-id?",
    email: doc?.id ?? "no-email?",
    displayName: doc?.data()?.displayName,
  };
};
