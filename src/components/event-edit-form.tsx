import { ChangeEvent, useState } from "react";
import { TastingEvent } from "store/reducers/events/reducer";
import { 
    BartenderEmailField, 
    Container, 
    DateField, 
    NameField, 
    Section, 
    EditTastersList, 
    EditTasterItem,
    VenueField,
    AddTasterButton,
    AddMeAsTasterField,
    EditBeerList,
    EditBeerItem,
    AddBeerButton,
    AsterisksAllowedField,
    PriceField
} from './event-edit-form.styles';

export type EventEditFormChangeHandler = (e: TastingEvent) => void;
export type EventEditFormProps = {
    event: TastingEvent;
    onChange?: EventEditFormChangeHandler;
}

export const DEFAULT_EVENT = {
    id: 'Event',
    name: '',
    venue: '',
    price: '',
    bartender: '',
    ownerAddedAsTaster: false,
    date: null,
    tasters: [''],
    beers: [''],
    rounds: 0,
    asterisksAllowed: 2
} as TastingEvent;

const EventEditForm = ({event=DEFAULT_EVENT, onChange}: EventEditFormProps) => {
    const [autoFocus, setAutoFocus] = useState(false);

    const handleChange = (change: {[field: string]: any}) => {
        const changed = Object.assign({}, {...event, ...change});
        (onChange && onChange(changed));
    }

    const handleAddTaster = () => {
        setAutoFocus(true);
        const tasters = [...(event?.tasters || []), ''];
        handleChange({'tasters': tasters});
    }

    const handleChangeTaster = (
        index: number, 
        clickEvent: ChangeEvent<HTMLInputElement>
    ) => {
        const tasters = event?.tasters || [];
        tasters[index] = clickEvent?.target?.value || '';
        handleChange({tasters});
    }

    const handleRemoveTaster = (index: number) => {
        const tasters = (event?.tasters || [])
        tasters.splice(index, 1);
        handleChange({tasters});
    }

    const handleAddBeer = () => {
        setAutoFocus(true);
        const beers = [...(event?.beers || []), ''];
        handleChange({beers, rounds: beers.length});
    }

    const handleChangeBeer = (
        index: number, 
        clickEvent: ChangeEvent<HTMLInputElement>
    ) => {
        const beers = event?.beers || [];
        beers[index] = clickEvent?.target?.value || '';
        handleChange({beers});
    }

    const handleRemoveBeer = (index: number) => {
        const beers = (event?.beers || [])
        beers.splice(index, 1);
        handleChange({beers, rounds: beers.length});
    }
    
    return (
      <Container id={"event-edit-form"}>
        <Section title="Event">
          <NameField
            value={event?.name || DEFAULT_EVENT.name}
            onChange={handleChange}
          />
          <VenueField
            value={event?.venue || DEFAULT_EVENT.venue}
            onChange={handleChange}
          />
          <DateField value={event?.date} onChange={handleChange} />
          <PriceField
            value={event?.price || DEFAULT_EVENT.price}
            onChange={handleChange}
          />
        </Section>

        <Section title="Bartender">
          <BartenderEmailField
            value={event?.bartender || ""}
            onChange={handleChange}
          />
        </Section>

        <Section title="Tasters">
          <EditTastersList>
            {(event?.tasters || []).map((email, index) => (
              <EditTasterItem
                key={index}
                id={`taster-${index}`}
                email={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChangeTaster(index, e)
                }
                onRemove={() => handleRemoveTaster(index)}
                autoFocus={autoFocus}
              />
            ))}
          </EditTastersList>
          <AddTasterButton onClick={handleAddTaster} />
          <AddMeAsTasterField
            checked={event?.ownerAddedAsTaster || false}
            onChange={handleChange}
          />
        </Section>

        <Section title="Beers">
          <EditBeerList>
            {(event?.beers || []).map((name, index) => (
              <EditBeerItem
                key={index}
                name={name}
                id={`beer-${index}`}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChangeBeer(index, e)
                }
                onRemove={() => handleRemoveBeer(index)}
                autoFocus={autoFocus}
              />
            ))}
          </EditBeerList>
          <AddBeerButton onClick={handleAddBeer} />
        </Section>
        <Section title="Options">
          <AsterisksAllowedField
            value={event?.asterisksAllowed ?? ""}
            onChange={handleChange}
          />
        </Section>
      </Container>
    );
}
export default EventEditForm;