import {
    TextField,
    Button,
    IconButton,
    styled,
    Grid,
    Typography,
    Container as BaseContainer,
    Divider,
    List,
    ListItem,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    FormControl
} from '@material-ui/core';
import {
    Close as RemoveIcon,
} from '@material-ui/icons';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export type InputChangeEventHandler = (id: string, value: any) => void;

const wrapOnChange = (p: any) => {
    return (p.onChange ? 
        //Fake an onChange as a change event.
        { 
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                p.onChange(event?.target?.id, event?.target?.value)
            }
        }    
        :
        {}
    )
};

export const Container = styled(p=>
    <BaseContainer {...p} noValidate="novalidate" component="form" maxWidth='md'/>
)(({theme}) => ({
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
}));

export const Section = styled(({children, title, ...p}) => 
    <div  {...p}>
        {title && <Typography variant="h5">{title}</Typography>}
        <Divider />
        <Grid container direction="column">
            {children}
        </Grid>
    </div>
)(({theme}) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(6),
    minHeight: theme.spacing(10),

    '& .MuiDivider-root': {
        //Fix the line dissapearing when not alligned properly.
        height: '1.1px' 
    }
}));

export const NameField = styled(p=>
    <Grid item>
        <TextField 
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            placeholder="My Special Event"
            autoComplete="off"
            {...p}
            {...wrapOnChange(p)}
        />
    </Grid>
)({

});

export const VenueField = styled(p=>
    <Grid item>
        <TextField 
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="venue"
            label="Venue"
            name="venue"
            placeholder="Drink Drunk Bar"
            autoComplete="off"
            {...p}
            {...wrapOnChange(p)}
        />
    </Grid>
)({

});

export const DateField = styled(p=>
    <Grid item>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker 
                margin="normal"
                variant="inline"
                inputVariant="outlined"
                forma
                ampm={true}
                minDate={new Date()}
                fullWidth
                label={"Date & Time"}
                disablePast
                required
                format="dd-MM-yyyy  h:mm aaa"
                {...p} 
                {...(p.onChange ? 
                    //Fake an onChange as a change event.
                    { onChange: (date) => p.onChange("date", date) }    
                    :
                    {}
                )}
            />
        </MuiPickersUtilsProvider>
    </Grid> 
)({

});

export const BartenderEmailField = styled(p=>
    <Grid item>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="bartender"
            label="Bartender's Email"
            name="bartender"
            placeholder="bartender@boncos.io"
            {...p}
            {...wrapOnChange(p)}
        />
    </Grid>
)({

});

export const EditTastersList = styled(p=>
    <List {...p} />
)({  
    paddingTop: 0
});

const RemoveButtonAdornment = styled(p=>
    <InputAdornment position="end" >
        <IconButton
            
            onClick={p?.onRemove}
        >
            <RemoveIcon />
        </IconButton>
    </InputAdornment>
)({});

export const EditTasterItem = styled(({className, ...p})=>
    <ListItem disableGutters dense className={className} >
        <TextField
            variant="outlined"
            margin="normal"
            id={p?.email}
            name={p?.email}
            value={p?.email} 
            fullWidth
            placeholder="Taster Email"
            autoComplete="off"
            InputProps={{
                endAdornment: (
                    <RemoveButtonAdornment onRemove={p?.onRemove} />
                )
            }}
            onChange={p?.onChange}
            {...p}
        />
    </ListItem>
)({
    paddingTop: 0
});

export const AddTasterButton = styled(p=> 
    <Button variant="outlined" {...p} color="primary">Add Taster</Button>
)({});

export const AddMeAsTasterField = styled(p=>
    <FormControl
        margin="normal"
    >
        <FormControlLabel
            control={
                <Checkbox 
                    checked={p?.checked} 
                    {...(p.onChange ? 
                        //Fake an onChange as a change event.
                        { 
                            onChange: e => {
                                p.onChange("ownerAddedAsTaster", e?.target?.checked) 
                            }
                        }    
                        :
                        {}
                    )}
                    name="ownerAddedAsTaster"
                />}
            label="Include me as taster"
        />
    </FormControl>
)({});

export const EditBeerList = styled(p=>
    <List {...p} />
)({  
    paddingTop: 0
});

export const EditBeerItem = styled(({className, ...p})=>
    <ListItem disableGutters dense className={className} >
        <TextField
            variant="outlined"
            margin="normal"
            id={p?.name}
            name={p?.name}
            value={p?.name} 
            fullWidth
            placeholder="Beer Name"
            InputProps={{
                endAdornment: (
                    <RemoveButtonAdornment onRemove={p?.onRemove} />
                )
            }}
            autoComplete="off"
            onChange={p?.onChange}
            {...p}
            
        />
    </ListItem>
)({
    paddingTop: 0
});

export const AddBeerButton = styled(p=> 
    <Button variant="outlined" {...p} color="primary">Add Beer</Button>
)({});

export const AsterisksAllowedField = styled(p=> 
    <Grid item>
        <TextField 
            variant="outlined"
            margin="normal"
            fullWidth
            id="asterisksAllowed"
            label="Asterisks' Allowed"
            name="asterisksAllowed"
            placeholder="2"
            {...p}
            {...wrapOnChange(p)}
        />
    </Grid>
)({});

