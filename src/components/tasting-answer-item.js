const TastingAnswerItem = ({roundIndex=0, selectedBeer, rating, hasAsterisk, showAsPoured, canEdit, onClick}) => {
    return <div onClick={onClick} > 
        {showAsPoured ? <> {roundIndex + 1}{roundIndex % 5 ? 'th' : 'st'} Poured </> : <> Round {roundIndex + 1} </>}
        - {selectedBeer || 'Choose Beer'} 
        { !showAsPoured && <> - Rating: {rating || 'not set'} </> } 
        { !showAsPoured && <>- Asterisk: { hasAsterisk ? 'yes' : 'no'} </> }
        { canEdit && <> {">"} </>}
        <br/>
        <hr/>
    </div>
}
export default TastingAnswerItem;