
import { MouseEventHandler } from "react";
import { 
    ListItem, 
    ListItemText, 
    ListSubheader, 
    Typography 
} from "@material-ui/core";
import { 
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
    return <div {...p}>
        <ListSubheader>
            {showAsPoured ? <> {roundIndex + 1}{roundIndex % 5 ? 'th' : 'st'} Poured </> : <> Round {roundIndex + 1} </>}
        </ListSubheader>
        <ListItem 
            onClick={ (canEdit ? onClick : undefined) } 
            divider
            button
            disabled={!canEdit}
        >
            <ListItemText
                primary={<>
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