import { 
    ACTION_AUTH_INITIALIZED 
} from './initialize';
import {
    ACTION_AUTH_AUTHENTICATED, 
    ACTION_AUTH_AUTHENTICATION_ERROR
} from './login';
import { 
    ACTION_AUTH_LOGOUT 
} from './logout';

const initialState = {
    user: null,
    token: null,
    loginError: null,
    initialized: false,
}

export default function authReducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_AUTH_INITIALIZED: {
            const user = action.payload;
            console.log(user);
            return {
                ...state,
                user: user,
                initialized: true,
            };
        }
        case ACTION_AUTH_AUTHENTICATED: {
            const {user, token} = action.payload;
            return {
                ...state,
                user: user,
                token: token,
                loginError: null,
            };
        }
        case ACTION_AUTH_AUTHENTICATION_ERROR: {
            return {
                ...state,
                loginError: action.payload,
            };
        }
        case ACTION_AUTH_LOGOUT: {
            return {
                ...state,
                user: null,
                token: null,
            };
        }
        default:
            return state;
    }
}