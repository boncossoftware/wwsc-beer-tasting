import { DocumentSnapshot, Timestamp } from "@/store/firebase";
import "firebase/firestore";
import { TastingEvent } from "./reducer";
import { format } from "date-fns";

export type TastingEventWithFormatting = TastingEvent & {
  _formattedDate?: string;
  formattedDate: () => string;
  _formattedMonth?: string;
  formattedMonth: () => string;
};

export const eventFromDoc = (
  doc: DocumentSnapshot | null
): TastingEventWithFormatting => {
  return {
    id: doc?.id ?? "no-id?",
    owner: doc?.data()?.owner,
    name: doc?.data()?.name,
    venue: doc?.data()?.venue,
    date: doc?.data()?.date?.toDate(),
    price: doc?.data()?.price,
    related: doc?.data()?.related,
    bartender: doc?.data()?.bartender,
    tasters: doc?.data()?.tasters,
    beers: doc?.data()?.beers,
    asterisksAllowed: doc?.data()?.asterisksAllowed,
    editingAllowed: doc?.data()?.editingAllowed,
    rounds: doc?.data()?.rounds,

    formattedDate: function () {
      if (!this._formattedDate) {
        this._formattedDate = this.date
          ? format(this.date, "ccc dd, hh:mm aaaa")
          : "-";
      }
      return (this as any)._formattedDate;
    },
    formattedMonth: function () {
      if (!this._formattedMonth) {
        if (!this.date) {
          this._formattedMonth = "-";
        } else {
          const isSameYear =
            this.date.getFullYear() === new Date().getFullYear();
          const yearFormat = isSameYear ? "" : ", yyyy";
          this._formattedMonth = format(this.date, `MMMM${yearFormat}`);
        }
      }
      return (this as any)._formattedMonth;
    },
  };
};

export const eventToDocData = (event: TastingEvent) => {
  return {
    name: event?.name ?? null,
    owner: event?.owner ?? null,
    venue: event?.venue ?? null,
    date: event?.date ? Timestamp.fromDate(event.date) : null,
    price: event?.price ?? null,
    related: event?.related ?? null,
    bartender: event?.bartender ?? null,
    tasters: event?.tasters ?? null,
    beers: event?.beers ?? null,
    asterisksAllowed: event?.asterisksAllowed ?? null,
    editingAllowed: Boolean(event?.editingAllowed),
    rounds: event?.rounds ?? null,
  };
};

export const propsForEvent = (
  userEmail: string,
  event: TastingEvent
): TastingEvent => {
  const tasters = Array.from(
    new Set([...(event?.tasters || [])].filter((t) => t !== event?.bartender))
  );
  const related = Array.from(
    new Set(
      [
        ...(event?.bartender ? [event?.bartender] : []),
        ...(event?.tasters || []),
      ].filter((r) => r !== userEmail)
    )
  );
  related.push(userEmail);

  const {
    editingAllowed = false, //Default (can be overritten)
    rounds = 0,
    asterisksAllowed = 2, //Default (can be overritten)
    ...otherFields
  } = event;

  return {
    editingAllowed,
    rounds,
    asterisksAllowed,
    ...otherFields,
    owner: userEmail, //Set the user as the owner.
    related,
    tasters,
  };
};
