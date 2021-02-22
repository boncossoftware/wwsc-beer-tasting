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
        {event?.tasters && event.tasters.map( (taster, index) => <>
            <input 
                key={index}
                id={taster}
                name={taster}
                value={ taster } 
                onChange={  e => handleChangeTaster(index, e) }
            /> 
            <button onClick={ () => handleRemoveTaster(index) }>X</button>
            <br/>
        </>)}
        <button onClick={handleAddTaster}>Add taster</button>
        <br/>
    </div>
}
export default EventEditForm;