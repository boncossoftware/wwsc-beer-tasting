import { 
    ACTION_AUTH_INITIALIZED 
} from './initialize';
import {
    ACTION_AUTH_LOGGING_IN,
    ACTION_AUTH_LOG_IN_LOGGED_IN,
    ACTION_AUTH_LOG_IN_ERROR
} from './login';
import {
    ACTION_AUTH_RESET_LOGIN
} from './reset-login';
import { 
    ACTION_AUTH_LOGOUT 
} from './logout';
import {
    ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL,
    ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_SENT,
    ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_ERROR
} from './send-password-reset-email';
import {
    ACTION_AUTH_RESET_SEND_PASSWORD_RESET_EMAIL
} from './reset-send-password-reset-email';
import {
    ACTION_AUTH_CONFIRMING_RESET_PASSWORD,
    ACTION_AUTH_CONFIRM_RESET_PASSWORD_CONFIRMED,
    ACTION_AUTH_CONFIRM_RESET_PASSWORD_ERROR
} from './confirm-password-reset';
import {
    ACTION_AUTH_RESET_CONFIRM_PASSWORD_RESET
} from './reset-confirm-password-reset';
import { 
    ACTION_AUTH_CREATE_ACCOUNT_CREATED, 
    ACTION_AUTH_CREATE_ACCOUNT_ERROR, 
    ACTION_AUTH_CREATING_ACCOUNT 
} from './create-account';
import { 
    ACTION_AUTH_RESET_CREATE_ACCOUNT 
} from './reset-create-account';
import { StoreError, UserInfo} from 'store/reducer';
import { AnyAction } from 'redux';

export type AuthState = {
    user: UserInfo | null,
    token: string|null,
    login: {
        loggingIn: boolean,
        loggedIn: boolean,
        error: StoreError|null
    },
    loginError: StoreError|null,
    initialized: boolean,
    sendPasswordResetEmail: {
        sending: boolean,
        sent: boolean,
        error: StoreError|null,
    },
    confirmPasswordReset: {
        confirming: boolean,
        confirmed: boolean,
        error: StoreError|null,
    },
    createAccount: {
        creating: boolean,
        created: boolean,
        error: StoreError|null,
    }
}

const initialState = {
    user: null,
    token: null,
    login: {
        loggingIn: false,
        loggedIn: false,
        error: null 
    },
    loginError: null,
    initialized: false,
    sendPasswordResetEmail: {
        sending: false,
        sent: false,
        error: null,
    },
    confirmPasswordReset: {
        confirming: false,
        confirmed: false,
        error: null,
    },
    createAccount: {
        creating: false,
        created: false,
        error: null,
    }
}

export default function authReducer(
    state: AuthState = initialState, 
    action: AnyAction
): AuthState {
    switch(action.type) {
        case ACTION_AUTH_INITIALIZED: {
            const user = action.payload;
            return {
                ...state,
                user: user,
                initialized: true,
            };
        }
        case ACTION_AUTH_LOGGING_IN: {
            return {
                ...state,
                login: {
                    ...state.login,
                    loggingIn: action.payload
                }
            }
        }
        case ACTION_AUTH_LOG_IN_LOGGED_IN: {
            const {user, token} = action.payload;
            return {
                ...state,
                user: user, 
                token: token,
                login: {
                    ...state.login,
                    loggedIn: true,
                    error: null,
                }
            }
        }
        case ACTION_AUTH_LOG_IN_ERROR: {
            return {
                ...state,
                user: null,
                token: null,
                login: {
                    ...state.login,
                    loggedIn: false,
                    error: action.payload,
                }
            }
        }
        case ACTION_AUTH_RESET_LOGIN: {
            return {
                ...state,
                login: {
                    ...state.login,
                    loggingIn: false,
                    loggedIn: false,
                    error: null 
                },
            }
        }
        case ACTION_AUTH_LOGOUT: {
            return {
                ...state,
                user: null,
                token: null,
            };
        }
        case ACTION_AUTH_SENDING_PASSWORD_RESET_EMAIL: {
            return {
                ...state,
                sendPasswordResetEmail: {
                    ...state.sendPasswordResetEmail,
                    sending: action.payload
                }
            }
        }
        case ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_ERROR: {
            return {
                ...state,
                sendPasswordResetEmail: {
                    ...state.sendPasswordResetEmail,
                    sent: false,
                    error: action.payload
                }
            }
        }
        case ACTION_AUTH_SEND_PASSWORD_RESET_EMAIL_SENT: {
            return {
                ...state,
                sendPasswordResetEmail: {
                    ...state.sendPasswordResetEmail,
                    sent: true,
                    error: null
                }
            }
        }
        case ACTION_AUTH_RESET_SEND_PASSWORD_RESET_EMAIL: {
            return {
                ...state,
                sendPasswordResetEmail: {
                    ...state.sendPasswordResetEmail,
                    sending: false,
                    sent: false,
                    error: null
                }
            }
        }
        case ACTION_AUTH_CONFIRMING_RESET_PASSWORD: {
            return {
                ...state,
                confirmPasswordReset: {
                    ...state.confirmPasswordReset,
                    confirming: action.payload
                }
            }
        }
        case ACTION_AUTH_CONFIRM_RESET_PASSWORD_CONFIRMED: {
            return {
                ...state,
                confirmPasswordReset: {
                    ...state.confirmPasswordReset,
                    confirmed: true,
                    error: null
                }
            }
        }
        case ACTION_AUTH_CONFIRM_RESET_PASSWORD_ERROR: {
            return {
                ...state,
                confirmPasswordReset: {
                    ...state.confirmPasswordReset,
                    confirmed: false,
                    error: action.payload
                }
            }
        }
        case ACTION_AUTH_RESET_CONFIRM_PASSWORD_RESET: {
            return {
                ...state,
                confirmPasswordReset: {
                    ...state.confirmPasswordReset,
                    confirming: false,
                    confirmed: false,
                    error: null
                }
            }
        }
        case ACTION_AUTH_CREATING_ACCOUNT: {
            return {
                ...state,
                createAccount: {
                    ...state.createAccount,
                    creating: action.payload
                }
            }
        }
        case ACTION_AUTH_CREATE_ACCOUNT_CREATED: {
            const {user, token} = action.payload;
            return {
                ...state,
                user: user,
                token: token,
                createAccount: {
                    ...state.createAccount,
                    created: true,
                    error: null,
                }
            }
        }
        case ACTION_AUTH_CREATE_ACCOUNT_ERROR: {
            return {
                ...state,
                createAccount: {
                    ...state.createAccount,
                    created: false,
                    error: action.payload,
                }
            }
        }
        case ACTION_AUTH_RESET_CREATE_ACCOUNT: {
            return {
                ...state,
                createAccount: {
                    ...state.createAccount,
                    creating: false,
                    created: false,
                    error: null,
                }
            }
        }
        default:
            return state;
    }
}