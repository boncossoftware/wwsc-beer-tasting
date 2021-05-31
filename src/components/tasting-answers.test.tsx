import { render, screen} from '@testing-library/react';
import { TastingAnswer } from 'store/reducers/answers/reducer';
import TastingAnswers from './tasting-answers';

export const mockAnswers: TastingAnswer = {
    id: '1', 
    beers: ['test'], 
    asterisks:[true], 
    changes:[0], 
    ratings:[2], 
    rounds: 1
} as TastingAnswer;

test('renders correctly', async () => {
    render( <TastingAnswers answers={mockAnswers} /> );

    const round1 = screen.getByText(/round 1/gi);
    expect(round1).toBeInTheDocument();

    const beer = screen.getByText(/test/gi);
    expect(beer).toBeInTheDocument();

    const asterisk = screen.getByText("✱");
    if (mockAnswers.asterisks![0] === true) {
        expect(asterisk).toBeInTheDocument();
    }
    else {
        expect(asterisk).toBeUndefined();
    }
    
    const ratings = document.getElementsByClassName("MuiRating-iconFilled");
    expect(ratings.length).toBe(mockAnswers.ratings![0]);
});