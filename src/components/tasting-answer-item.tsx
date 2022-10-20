
import { MouseEventHandler } from "react";
import { 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Typography 
} from "@material-ui/core";
import { 
    Asterisks, 
    DisclosureIndicator,
    Rating
} from './tasting-answer-item.styles';
import { styled } from "@material-ui/styles";

export type TastingAnswerItemProps = {
    roundIndex: number, 
    selectedBeer: string|null, 
    rating: number|null, 
    hasAsterisk: boolean, 
    showAsPoured: boolean, 
    canEdit?: boolean, 
    onClick?: MouseEventHandler
}

const BaseTastingAnswerItem = ({
    roundIndex, 
    selectedBeer, 
    rating, 
    hasAsterisk, 
    showAsPoured, 
    canEdit=false, 
    onClick,
    ...p
}: TastingAnswerItemProps) => {
    return (
      <div {...p}>
        <ListItem
          onClick={canEdit ? onClick : undefined}
          divider
          button
          disabled={!canEdit}
        >
          <ListItemIcon className="round">
            <Typography
              variant="h6"
              className={roundIndex < 9 ? "left-padding" : ""}
              color={selectedBeer && rating ? "secondary" : "textPrimary"}
            >
              {roundIndex + 1}
            </Typography>
          </ListItemIcon>
          <ListItemText
            primary={
              <>
                {selectedBeer || "Choose Beer"}
                {!showAsPoured && hasAsterisk && <Asterisks />}
              </>
            }
            secondary={
              !showAsPoured && (
                <>
                  <Typography
                    variant="caption"
                    color={rating ? "primary" : "textSecondary"}
                  >
                    Rating: <Rating rating={rating} />
                  </Typography>
                </>
              )
            }
          />
          {canEdit && <DisclosureIndicator />}
        </ListItem>
      </div>
    );
}
const TastingAnswerItem = styled(BaseTastingAnswerItem)(({ theme }) => ({
  "& .round": {
    minWidth: 35,
    "& .left-padding": {
      marginLeft: 10,
    },
    "& .MuiTypography-h6": {
        fontSize: "1.2rem"
    }
  },
}));

export default TastingAnswerItem;