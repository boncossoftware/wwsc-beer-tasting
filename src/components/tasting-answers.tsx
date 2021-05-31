import { List } from "@material-ui/core";
import { TastingAnswer } from "store/reducers/answers/reducer";
import TastingAnswerItem from "./tasting-answer-item";

export type TastingAnswersProps = {
    answers: TastingAnswer, 
    showForBartender?: boolean, 
    editingAllowed?: boolean, 
    onClickItemAtIndex?: (index: number) => void;
}

const TastingAnswers = ({
    answers, 
    showForBartender=false, 
    editingAllowed=false, 
    onClickItemAtIndex
}: TastingAnswersProps) => {
    const beersSelected = answers?.beers || [];
    const ratingsSelected = answers?.ratings || [];
    const asterisksSelected = answers?.asterisks || [];
    const showAsPoured = showForBartender || false;
    const rounds = answers?.rounds || 10;

    const renderItems = () => {
        let index, items=[];
        for (index = 0; index < rounds; index++) {
            const selectedBeer = beersSelected[index];
            const rating = ratingsSelected[index];
            const asterisk = asterisksSelected[index];
            const round = index;
            const onClick = () => (onClickItemAtIndex && onClickItemAtIndex(round));
            items.push( <TastingAnswerItem 
                    key={index} 
                    roundIndex={index} 
                    selectedBeer={selectedBeer} 
                    rating={rating} 
                    hasAsterisk={asterisk} 
                    showAsPoured={showAsPoured}
                    canEdit={editingAllowed}
                    onClick={ onClick }
                />
            );
        }
        return items;
    }

    return (
        <List>
            {renderItems()}
        </List>
    );
}
export default TastingAnswers;