import _firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

_firebase.initializeApp({
    apiKey: "AIzaSyBU513psjNFlHImdwLP6oUDzzz7_V5NiT8",
    authDomain: "beer-tasting-e1530.firebaseapp.com",
    databaseURL: "https://beer-tasting-e1530.firebaseio.com",
    projectId: "beer-tasting-e1530",
    storageBucket: "beer-tasting-e1530.appspot.com",
    messagingSenderId: "59351899973",
    appId: "1:59351899973:web:7f0c8f45bab68966daa82c"
});

const db = _firebase.firestore();
const fns = _firebase.functions();
const ath = _firebase.auth();
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", 8080);
  fns.useEmulator("localhost", 5001);
  ath.useEmulator("http://localhost:9099");
}

export const firebase = _firebase;
