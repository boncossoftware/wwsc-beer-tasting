import { render, screen } from '@testing-library/react';
import { BeerRanking, Result, ResultSummary } from '@/store/reducers/results/reducer';
import TastingResults from './tasting-results';

const mockResults = {
    id: 'test',
    beerScoreResults: [{
        name: 'test beer',
        points: 1000
    }] as BeerRanking[],
    roundResults: [
        { userEmail: 'test@email.com', totalPoints: 2000 }
    ] as ResultSummary[],
    lastUpdated: new Date()
} as Result;

test('renders correctly no results', () => {
    render(
        <TastingResults />
    );

    const message = screen.getByText(/no results available./gi);
    expect(message).toBeInTheDocument();
});

test('renders correctly no updated results', () => {
    const noUpdatedResults = { ...mockResults, lastUpdated: null } as Result;
    render(
        <TastingResults results={noUpdatedResults} />
    );

    const message = screen.getByText(/no results available./gi);
    expect(message).toBeInTheDocument();
});


test('renders beer rankings correctly', () => {
    render(
        <TastingResults results={mockResults} />
    );

    const beer = screen.getByText(/test beer/gi);
    expect(beer).toBeInTheDocument();

    const points = screen.getByText(/1000 points/gi);
    expect(points).toBeInTheDocument();
});

test('renders contestant rankings correctly', () => {
    render(
        <TastingResults results={mockResults} />
    );

    const contestant = screen.getByText(/test@email.com/gi);
    expect(contestant).toBeInTheDocument();

    const points = screen.getByText(/2000 points/gi);
    expect(points).toBeInTheDocument();
});

test('renders contestant winner and losers correctly', () => {
    const results = {
        ...mockResults,
        roundResults: [
            { userEmail: 'loser@email.com', totalTaste: 2000 },
            { userEmail: 'test@email.com', totalTaste: 20 },
            { userEmail: 'winner@email.com', totalTaste: 0 },
        ] as ResultSummary[],
    }
    render(
        <TastingResults results={results} />
    );

    const winner = screen.getByText(/beer lover/gi).nextSibling;
    expect(winner?.textContent).toBe('winner@email.com');

    const loser = screen.getByText(/beer hater/gi).nextSibling;
    expect(loser?.textContent).toBe('loser@email.com');
});