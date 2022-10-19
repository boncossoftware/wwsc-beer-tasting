import { DocumentSnapshot, Timestamp } from "store/firebase";
import "firebase/firestore";
import { TastingEvent } from "./reducer";
import { format } from "date-fns";

export const eventFromDoc = (doc: DocumentSnapshot): TastingEvent => {
  return {
    id: doc?.id,
    owner: doc?.data()?.owner,
    name: doc?.data()?.name,
    venue: doc?.data()?.venue,
    date: doc?.data()?.date?.toDate(),
    price: doc?.data()?.price,
    related: doc?.data()?.related,
    bartender: doc?.data()?.bartender,
    tasters: doc?.data()?.tasters,
    ownerAddedAsTaster: doc?.data()?.ownerAddedAsTaster,
    beers: doc?.data()?.beers,
    asterisksAllowed: doc?.data()?.asterisksAllowed,
    editingAllowed: doc?.data()?.editingAllowed,
    rounds: doc?.data()?.rounds,

    formattedDate: function () {
      if (!(this as any)._formattedDate) {
        (this as any)._formattedDate = this.date
          ? format(this.date, "ccc d, h:mm aaaa")
          : "-";
      }
      return (this as any)._formattedDate;
    },
    formattedMonth: function () {
      if (!(this as any)._formattedMonth) {
        (this as any)._formattedMonth = this.date
          ? format(
              this.date,
              "MMMM" +
                (this.date.getFullYear() === new Date().getFullYear()
                  ? ""
                  : ", YYYY")
            )
          : "-";
      }
      return (this as any)._formattedMonth;
    },
  } as TastingEvent;
};

export const eventToDocData = (event: TastingEvent) => {
  return {
    name: event?.name || null,
    owner: event?.owner || null,
    venue: event?.venue || null,
    date: event?.date ? Timestamp.fromDate(event.date) : null,
    price: event?.price || null,
    related: event?.related || null,
    bartender: event?.bartender || null,
    tasters: event?.tasters || null,
    ownerAddedAsTaster: Boolean(event?.ownerAddedAsTaster),
    beers: event?.beers || null,
    asterisksAllowed: event?.asterisksAllowed || null,
    editingAllowed: Boolean(event?.editingAllowed),
    rounds: event?.rounds || null,
  };
};

export const propsForEvent = (
  userEmail: string,
  event: TastingEvent
): TastingEvent => {
  const tasters = Array.from(
    new Set([...(event?.tasters || [])].filter((t) => t !== userEmail))
  );

  const related = Array.from(
    new Set(
      [
        ...(event?.bartender ? [event?.bartender] : []),
        ...(event?.related || []),
        ...(event?.tasters || []),
      ].filter((r) => r !== userEmail)
    )
  );
  related.push(userEmail);

  const {
    editingAllowed = false, //Default (can be overritten)
    rounds = 10,
    asterisksAllowed = 2, //Default (can be overritten)
    ...otherFields
  } = event;

  return {
    editingAllowed,
    rounds,
    asterisksAllowed, //Default (can be overritten)
    ...otherFields,
    owner: userEmail, //Set the user as the owner.
    related,
    tasters,
  };
};
