import React from 'react'
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { render as rtlRender } from '@testing-library/react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
// Import your own reducer
import reducer from '../store/reducer';
import { BrowserRouter } from 'react-router-dom';

function render(ui: any, renderOptions: any={} ) {
    const initialState: any = renderOptions?.initialState || {};
    const composedEnhancers = composeWithDevTools(applyMiddleware(thunkMiddleware));

    const wrapStore: any = renderOptions?.wrapStore || ((s: any) => s);
    const store = wrapStore(
        createStore(
            reducer, 
            initialState, 
            composedEnhancers
        )
    );

    function Wrapper({ children }: {children: any}) {
        return (
            <BrowserRouter>
                <Provider store={store}>{children}</Provider>
            </BrowserRouter>
        );
    }

    return rtlRender(ui, {
        wrapper: Wrapper,
        ...renderOptions
    })
}

async function getActionRedutions(action: (d: any) => void) {
    let reductions: any[] = []; 
    const mockDispatch = (r: any) => {
        reductions.push(r);
    }
    await action( mockDispatch );
    return reductions;
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render, getActionRedutions}