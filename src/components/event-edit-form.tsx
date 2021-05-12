import { AddButton } from "containers/Events/Events.styles";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import { TastingEvent } from "store/reducers/events/reducer";
import { 
    BartenderEmailField, 
    Container, 
    DateField, 
    InputChangeEventHandler, 
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
    AsterisksAllowedField
} from './event-edit-form.styles';

export type EventEditFormChangeHandler = (e: TastingEvent) => void;
export type EventEditFormProps = {
    event: TastingEvent;
    onChange?: EventEditFormChangeHandler;
}

const EventEditForm = ({event, onChange}: EventEditFormProps) => {
    const [autoFocus, setAutoFocus] = useState(false);

    const handleChange: InputChangeEventHandler = (field, value) => {
        const changed = Object.assign({}, {...event, [field]: value});
        (onChange && onChange(changed));
    }

    const handleAddTaster = () => {
        setAutoFocus(true);
        const tasters = [...(event?.tasters || []), ''];
        handleChange('tasters', tasters);
    }

    const handleChangeTaster = (
        index: number, 
        clickEvent: ChangeEvent<HTMLInputElement>
    ) => {
        const tasters = event?.tasters || [];
        tasters[index] = clickEvent?.target?.value || '';
        handleChange('tasters', tasters);
    }

    const handleRemoveTaster = (index: number) => {
        const tasters = (event?.tasters || [])
        tasters.splice(index, 1);
        handleChange('tasters', tasters);
    }

    const handleAddBeer = () => {
        setAutoFocus(true);
        const beers = [...(event?.beers || []), ''];
        handleChange('beers', beers);
    }

    const handleChangeBeer = (
        index: number, 
        clickEvent: ChangeEvent<HTMLInputElement>
    ) => {
        const beers = event?.beers || [];
        beers[index] = clickEvent?.target?.value || '';
        handleChange('beers', beers);
    }

    const handleRemoveBeer = (index: number) => {
        const beers = (event?.beers || [])
        beers.splice(index, 1);
        handleChange('beers', beers);
    }
    
    return <Container>
        <Section title="Event">
            <NameField value={event?.name} onChange={handleChange} />
            <VenueField value={event?.venue} onChange={handleChange} />
            <DateField value={event?.date} onChange={handleChange} />
        </Section>
        
        <Section title="Bartender">
            <BartenderEmailField value={event?.bartender} onChange={handleChange} />
        </Section>

        <Section title="Tasters">
            <EditTastersList>
                {(event?.tasters||[]).map( (email, index) => 
                    <EditTasterItem
                        key={index}
                        email={email} 
                        onChange={ (e: ChangeEvent<HTMLInputElement>) => 
                            handleChangeTaster(index, e) 
                        }
                        onRemove={ () => handleRemoveTaster(index) }
                        autoFocus={autoFocus}
                    />
                )}
            </EditTastersList>
            <AddTasterButton onClick={handleAddTaster} />
            <AddMeAsTasterField onChange={handleChange} />
        </Section>

        <Section title="Beers">
            <EditBeerList>
            {(event?.beers||[]).map( (name, index) => 
                <EditBeerItem
                    key={index}
                    name={name}
                    onChange={ (e: ChangeEvent<HTMLInputElement>) => 
                        handleChangeBeer(index, e) 
                    }
                    onRemove={ () => handleRemoveBeer(index) }
                    autoFocus={autoFocus}
                />
            )}
            </EditBeerList>
            <AddBeerButton onClick={handleAddBeer} />
        </Section>
        <Section title="Options">
            <AsterisksAllowedField 
                value={event?.asterisksAllowed} 
                onChange={handleChange}
            />
        </Section>
    </Container>
}
export default EventEditForm;