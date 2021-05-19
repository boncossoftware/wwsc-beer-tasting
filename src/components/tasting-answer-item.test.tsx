import Rating from "./rating"

const TastingAnswerItem = ({roundIndex=0, selectedBeer, rating, hasAsterisk, showAsPoured, canEdit, onClick}) => {
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