import { screen } from '@testing-library/react';
import { render } from 'testing/test-utils';
import AppBar from './app-bar';

test('renders correctly', () => {
    render(
        <AppBar 
            renderLeftComponent={ () => 
                <span>Left</span> 
            }
            title="Test"
            renderRightComponent={ () => 
                <span>Right</span> 
            }
        />
    );

    const left = screen.getByText("Left");
    expect(left).toBeInTheDocument();    

    const title = screen.getByText("Test");
    expect(title).toBeInTheDocument();

    const right = screen.getByText("Right");
    expect(right).toBeInTheDocument();  
});
