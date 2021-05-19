import Rating from "./rating"
import { MouseEventHandler } from "react";

export type TastingAnswerItemProps = {
    roundIndex: number, 
    selectedBeer: string, 
    rating: number, 
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
    onClick
}: TastingAnswerItemProps) => {
    return <div onClick={ (canEdit ? onClick : undefined) } > 
        {showAsPoured ? <> {roundIndex + 1}{roundIndex % 5 ? 'th' : 'st'} Poured </> : <> Round {roundIndex + 1} </>}
        - {selectedBeer || 'Choose Beer'} 
        { !showAsPoured && <> - Rating: <Rating rating={rating} /> </> } 
        { !showAsPoured && <>- Asterisk: { hasAsterisk ? 'yes' : 'no'} </> }
        { canEdit && <> {">"} </>}
        <br/>
        <hr/>
    </div>
}
export default TastingAnswerItem;