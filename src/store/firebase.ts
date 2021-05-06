import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { StoreError } from './reducer';


export function initializeFirebaseApp() {
    const TEST_ENV = (process.env.NODE_ENV === 'test');
    if (TEST_ENV) {
        
    }
    else {
        firebase.initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
        });
        
        const db = firebase.firestore();
        const fns = firebase.functions();
        const ath = firebase.auth();
        if (window.location.hostname === "localhost") {
            db.useEmulator("localhost", 8080);
            fns.useEmulator("localhost", 5001);
            ath.useEmulator("http://localhost:9099");
        }
    }
}

export function getCurrentUserInfo(): {uid: string, email: string} {
    const user: (firebase.User | null) = firebase.auth()?.currentUser;
    if (!user) {
        throw new StoreError('No current user.');
    }
    const {uid, email} = user;
    if (!(uid && email)) {
        throw new StoreError('No current user.');
    }
    
    return {uid, email};
}