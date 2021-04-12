export const TasterListItem = ({taster, onClick, disabled=false, selected=false}) => (
    <div onClick={ onClick }>
        { disabled ? 
            <span style={{color: "gray"}}><i>{taster}</i></span>
            :
            <span>{taster}</span>                   
        }              
        {selected && <span style={{float:'right'}}>&#10003;</span>}
        <br/>
        <hr/>
    </div>
);

const TasterList = ({tasters=[], onClickTaster, isTasterDisabled, isTasterSelected}) => {
    
    const handleClickTaster = (taster, event) => {
        onClickTaster && handleClickTaster(taster, event);
    };

    const renderItems = () => {
        return tasters.map( (taster, index) => {
            const disabled = (isTasterDisabled && isTasterDisabled(taster)) || false;
            const selected = (isTasterSelected && isTasterSelected(taster)) || false;
            return (
                <TasterListItem 
                    key={index} 
                    taster={taster} 
                    onClick={ event => handleClickTaster(taster, event)}
                    selected={selected}
                    disabled={disabled}
                />
            );
        });
    }
    
    if (tasters.length === 0) {
        return <>No tasters added</>
    }
    else {
        return renderItems();
    }
}   
export default TasterList;
