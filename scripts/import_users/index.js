import * as admin from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("../../.keys/service-account.json"));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  databaseURL: "https://beer-tasting-e1530.firebaseio.com",
});

const run = async () => {
  const users = JSON.parse(fs.readFileSync("users.json"));
  const db = getFirestore();

  const batch = db.batch();
  users.forEach((user) => {
    const email = user.email?.toLowerCase();
    if (!email) { return; }
    const userRef = db.collection("users").doc(email);
    batch.set(userRef, { ...user, email });
  });

  await batch.commit();
  console.log("Users imported");
};
run();
