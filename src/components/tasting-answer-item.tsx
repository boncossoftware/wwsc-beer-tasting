
import { MouseEventHandler } from "react";
import { 
    ListItem, 
    ListItemText, 
    Typography 
} from "@material-ui/core";
import { 
    ListSubheader,
    Asterisks, 
    DisclosureIndicator,
    Rating
} from './tasting-answer-item.styles';

export type TastingAnswerItemProps = {
    roundIndex: number, 
    selectedBeer: string|null, 
    rating: number|null, 
    hasAsterisk: boolean, 
    showAsPoured: boolean, 
    canEdit?: boolean, 
    onClick?: MouseEventHandler
}

const TastingAnswerItem = ({
    roundIndex, 
    selectedBeer, 
    rating, 
    hasAsterisk, 
    showAsPoured, 
    canEdit=false, 
    onClick,
    ...p
}: TastingAnswerItemProps) => {
    const round = showAsPoured ? <> {roundIndex + 1}{roundIndex % 5 ? 'th' : 'st'} Poured </> : <> Round {roundIndex + 1} </>;
    return <div {...p} id={`tasting-answer-item-${roundIndex + 1}`}>
        <ListItem 
            dense
            onClick={ (canEdit ? onClick : undefined) } 
            divider
            button
            disabled={!canEdit}
            disableGutters
        >   
            <ListItemText
                primary={<>
                    <b>{round}</b>
                    {selectedBeer || 'Choose Beer'}
                    { (!showAsPoured && hasAsterisk) && 
                        <Asterisks />
                    }
                </>}
                secondary={ !showAsPoured && <>
                        <Typography variant='caption'> 
                            Rating <Rating rating={rating} /> 
                        </Typography> 
                    </>
                } 
            />  
            { canEdit && <DisclosureIndicator />}
        </ListItem>
    </div>;
}
export default TastingAnswerItem;