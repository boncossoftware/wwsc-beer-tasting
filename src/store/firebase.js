
import _firebase from 'firebase/app';

_firebase.initializeApp({
    apiKey: "AIzaSyBU513psjNFlHImdwLP6oUDzzz7_V5NiT8",
    authDomain: "beer-tasting-e1530.firebaseapp.com",
    databaseURL: "https://beer-tasting-e1530.firebaseio.com",
    projectId: "beer-tasting-e1530",
    storageBucket: "beer-tasting-e1530.appspot.com",
    messagingSenderId: "59351899973",
    appId: "1:59351899973:web:7f0c8f45bab68966daa82c"
});

export const firebase = _firebase;
