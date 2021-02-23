import { format, parse } from "date-fns";
import { useState } from "react";

const DATE_FORMAT = 'HH:mm dd-MM-yyyy';

const fromDate = (date) => {
    let formatted;
    try {
        formatted = format(date, DATE_FORMAT)
    }
    catch( error ) {
        formatted = '';
    }
    return formatted;
}

const TextField = ({label, field, event={}, onChange, ...otherProps}) => {
    return <>
        <label htmlFor={field}>{label}</label> <br/>
        <input 
            id={field}
            name={field}
            value={ event[field] || ''} 
            {...otherProps}
            onChange={ e => onChange(field, e) }/> <br/>
    </>
}

const EventEditForm = ({event, onChange}) => {
    const [formatDate, setFormattedDate] = useState( fromDate(event?.date) );
    const [dateError, setDateError] = useState( false );

    const handleChange = (field, clickEvent) => {
        const value = clickEvent.target.value;
        const changed = Object.assign({}, {...event, [field]: value});
        (onChange && onChange(changed) );
    }

    const handleDateChange = (clickEvent) => {
        const value = clickEvent.target.value;
        setFormattedDate(value);
        const date = parse(value, DATE_FORMAT, new Date());   
        if (isNaN(date.getTime())) {
            setDateError(true);
        }
        else {
            handleChange('date', {target:{value: date}});
            setDateError(false);
        }
    }

    const handleAddTaster = () => {
        const tasters = [...(event?.tasters || []), ''];
        handleChange('tasters', { target: { value:  tasters}});
    }

    const handleChangeTaster = (index, clickEvent) => {
        const tasters = event?.tasters || [];
        tasters[index] = clickEvent?.target?.value || '';
        handleChange('tasters', { target: { value: tasters} });
    }

    const handleRemoveTaster = (index) => {
        const tasters = (event?.tasters || [])
        tasters.splice(index, 1);
        handleChange('tasters', { target: { value: tasters} });
    }

    const handleAddBeer = () => {
        const beers = [...(event?.beers || []), ''];
        handleChange('beers', { target: { value:  beers}});
    }

    const handleChangeBeer = (index, clickEvent) => {
        const beers = event?.beers || [];
        beers[index] = clickEvent?.target?.value || '';
        handleChange('beers', { target: { value: beers} });
    }

    const handleRemoveBeer = (index) => {
        const beers = (event?.beers || [])
        beers.splice(index, 1);
        handleChange('beers', { target: { value: beers} });
    }
    
    return <div>
        <TextField label="Name" field="name" event={event} placeholder="My Special Event" onChange={handleChange}/>
        <TextField label="Venue" field="venue" event={event} placeholder="Drink Drunk Bar" onChange={handleChange}/>
        <label htmlFor='date'>Date</label> <br/>
        <input id='date' name='date' value={formatDate} placeholder='HH:MM dd-mm-YYYY' onChange={ handleDateChange }/> <br/>
        {dateError && <><span>Date must be formatted HH:MM dd-mm-YYYY</span><br/></>}
        <TextField label="Price" field="price" event={event} onChange={handleChange} placeholder="Afl. 75" />
        <br/>
        <TextField label="Bartender's Email" field="bartender" event={event} onChange={handleChange} placeholder="bartender@gmail.com" />
        <br/>
        <label>Tasters</label><br/>
        {event?.tasters && event.tasters.map( (taster, index) => 
            <div key={index}>
                <input 
                    
                    id={taster}
                    name={taster}
                    value={ taster } 
                    onChange={  e => handleChangeTaster(index, e) }
                /> 
                <button onClick={ () => handleRemoveTaster(index) }>X</button>
                <br/>
            </div>
        )}
        <button onClick={handleAddTaster}>Add taster</button>
        <br/>
        <input type="checkbox" id="added_as_taster" name="added_as_taster" onChange={ e => {
            const ownerAddedAsTaster = e.target.value === 'on';
            handleChange('ownerAddedAsTaster', {target: {value: ownerAddedAsTaster}}) 
        }}/>
        <label htmlFor="added_as_taster">Include me as taster</label> <br/>
        <br/>
        <label>Beers</label><br/>
        {event?.beers && event?.beers.map( (beer, index) => 
            <div key={index}>
                <input 
                    id={beer}
                    name={beer}
                    value={ beer } 
                    onChange={  e => handleChangeBeer(index, e) }
                /> 
                <button onClick={ () => handleRemoveBeer(index) }>X</button>
                <br/>
            </div>
        )}
        <button onClick={handleAddBeer}>Add beer</button>
        <br/>
        <br/>
        <TextField label="Asterisks' Allowed" field="asterisksAllowed" event={event} onChange={handleChange} placeholder="2" />
    </div>
}
export default EventEditForm;