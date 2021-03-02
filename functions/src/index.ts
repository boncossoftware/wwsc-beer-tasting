import * as admin from 'firebase-admin';  
import * as functions from "firebase-functions";

admin.initializeApp();

const onCall = functions.https.onCall;

export const calculateResults = onCall( async (data, context) => {
    //Get all answers.
    
  const eventID = data;
  functions.logger.debug(`eventID = ${eventID}`);
  const results = {
    beerSelection: ['', '', ''],
    tasteScore: ['', '', ''],
    beerLover: '',
    beerHater: '',
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  }
  await admin.firestore().collection('results').doc(eventID).set(results);
  
  return results;
});
