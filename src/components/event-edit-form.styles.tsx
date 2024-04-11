import {
    TextField,
    Button,
    IconButton,
    styled,
    Grid,
    Container as BaseContainer,
    List,
    ListItem,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    FormControl,
    Typography
} from '@material-ui/core';
import {
    Close as RemoveIcon,
} from '@material-ui/icons';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SectionGrid from './section-grid';

export type InputChangeEventHandler = (id: string, value: any) => void;

const wrapOnChange = (p: any, parseValue?: ((v: any) => any)) => {
    const pV = parseValue || (v => v);
    return (p.onChange ?
        //Fake an onChange as a change event.
        {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                p.onChange({ [event?.target?.id]: pV(event?.target?.value) })
            }
        }
        :
        {}
    )
};

export const Container = styled(p =>
    <BaseContainer {...p} noValidate="novalidate" component="form" maxWidth='md' />
)(({ theme }) => ({
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
}));

export const Section = SectionGrid;

export const NameField = styled(p =>
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

export const VenueField = styled(p =>
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

export const DateField = styled(p =>
    <Grid item>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
                id="date"
                margin="normal"
                variant="inline"
                inputVariant="outlined"
                ampm={true}
                disablePast
                minDateMessage={'Date should be in the future'}
                fullWidth
                label={"Date & Time"}
                required
                mask={"__-__-____  __:__ _m"}
                format={"dd-MM-yyyy  hh:mm aaa"}
                {...p}
                {...(p.onChange ?
                    //Fake an onChange as a change event.
                    { onChange: (date) => p.onChange({ "date": date }) }
                    :
                    {}
                )}
            />
        </MuiPickersUtilsProvider>
    </Grid>
)({

});

export const PriceField = styled(p =>
    <Grid item>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            placeholder="Alf. 75"
            autoComplete="off"
            {...p}
            {...wrapOnChange(p)}
        />
    </Grid>
)({

});


export const BartenderEmailField = styled(p =>
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

export const EditTastersList = styled(p =>
    <List {...p} />
)({
    paddingTop: 0
});

const RemoveButtonAdornment = styled(p =>
    <InputAdornment position="end" >
        <IconButton

            onClick={p?.onRemove}
        >
            <RemoveIcon />
        </IconButton>
    </InputAdornment>
)({});

export const EditTasterItem = styled(({ className, onRemove, id, ...p }) =>
    <ListItem disableGutters dense className={className} >
        <TextField
            id={id}
            variant="outlined"
            margin="normal"
            name={p?.email}
            value={p?.email}
            fullWidth
            placeholder="Taster Email"
            autoComplete="off"
            InputProps={{
                endAdornment: (
                    <RemoveButtonAdornment onRemove={onRemove} />
                )
            }}
            {...p}
        />
    </ListItem>
)({
    paddingTop: 0
});

export const EditTasterItem2 = styled(({ className, onRemove, id, info, ...p }) =>
    <ListItem dense className={className} key={p?.key}>
        <Grid container direction='column'>
            <Grid item container direction='row' justifyContent='space-between' alignItems='center'>
                <Grid item>
                    <Typography variant='h6'>Taster</Typography>
                </Grid>
                <Grid item>
                    <IconButton onClick={onRemove}>
                        <RemoveIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item>
                <TextField
                    id={id}
                    variant="outlined"
                    margin="normal"
                    name={info?.email}
                    value={info?.email}
                    fullWidth
                    label="Email"
                    autoComplete="off"
                    autoFocus={true}
                    onChange={p?.onChangeEmail}
                />
            </Grid>
            <Grid item>
                <TextField
                    id={id}
                    variant="outlined"
                    margin="normal"
                    name={info?.displayName}
                    value={info?.displayName}
                    fullWidth
                    label="Display Name"
                    autoComplete="off"
                    onChange={p?.onChangeDisplayName}
                />
            </Grid>
        </Grid>

    </ListItem>
)(({ theme }) => ({
    marginTop: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
}));

export const AddTasterButton = styled(p =>
    <Button variant="outlined" {...p} color="primary">Add Taster</Button>
)({});

export const EditBeerList = styled(p =>
    <List {...p} />
)({
    paddingTop: 0
});

export const EditBeerItem = styled(({ className, onRemove, id, ...p }) =>
    <ListItem disableGutters dense className={className} >
        <TextField
            variant="outlined"
            margin="normal"
            id={id}
            name={p?.name}
            value={p?.name}
            fullWidth
            placeholder="Beer Name"
            InputProps={{
                endAdornment: (
                    <RemoveButtonAdornment onRemove={onRemove} />
                )
            }}
            autoComplete="off"
            {...p}
        />
    </ListItem>
)({
    paddingTop: 0
});

export const AddBeerButton = styled(p =>
    <Button variant="outlined" {...p} color="primary">Add Beer</Button>
)({});

export const RoundsField = styled(p =>
    <Grid item>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="rounds"
            label="Rounds"
            name="rounds"
            placeholder="10"
            autoComplete="off"
            {...p}
            {...wrapOnChange(p)}
        />
    </Grid>
)({

});

const parseToInt = (defaultValue: any) => (value: any) => {
    const parsed = parseInt(value);
    if (isNaN(parsed)) {
        return defaultValue;
    }
    return parsed;
};
export const AsterisksAllowedField = styled((p) => (
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
            {...wrapOnChange(p, parseToInt(0))}
        />
    </Grid>
))({});

