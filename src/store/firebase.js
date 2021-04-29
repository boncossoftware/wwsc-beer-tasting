import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

var _firebase;
if (!_firebase) {
    if (process.env.NODE_ENV === 'test') {
        _firebase = require('testing/mock-firebase').default;
    }
    else {
        _firebase = require('firebase/app').default;

        _firebase.initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
        });
        
        const db = _firebase.firestore();
        const fns = _firebase.functions();
        const ath = _firebase.auth();
        if (window.location.hostname === "localhost") {
        db.useEmulator("localhost", 8080);
        fns.useEmulator("localhost", 5001);
        ath.useEmulator("http://localhost:9099");
        }
    }
}

export default _firebase;
