import { render, screen} from '@testing-library/react';
import TastingAnswerItem from './tasting-answer-item';

test('renders correctly', async () => {
    render( 
        <TastingAnswerItem 
            roundIndex={0}
            selectedBeer={'test'}
            rating={2}
            hasAsterisk={true} 
            showAsPoured={false}
        /> 
    );

    const round1 = screen.getByText(/1/gi);
    expect(round1).toBeInTheDocument();

    const beer = screen.getByText(/test/gi);
    expect(beer).toBeInTheDocument();

    const asterisk = screen.getByText("✱");
    expect(asterisk).toBeInTheDocument();
    
    const rating = screen.queryByText("HMMm (2)");
    expect(rating).toBeInTheDocument();
});

test('renders correctly as poured', async () => {
    render( 
        <TastingAnswerItem 
            roundIndex={0}
            selectedBeer={'test'}
            rating={2}
            hasAsterisk={true} 
            showAsPoured={true}
        /> 
    );

    const round1 = screen.getByText(/1/gi);
    expect(round1).toBeInTheDocument();

    const beer = screen.getByText(/test/gi);
    expect(beer).toBeInTheDocument();

    const asterisk = screen.queryByText("✱");
    expect(asterisk).toBeNull();
    
    const rating = screen.queryByText("HMMm (2)");
    expect(rating).toBeNull();
});


