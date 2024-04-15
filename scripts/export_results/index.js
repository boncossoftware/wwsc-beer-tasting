import * as admin from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("../../.keys/service-account.json"));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  databaseURL: "https://beer-tasting-e1530.firebaseio.com",
});

const run = async () => {
  const db = getFirestore();
  const results = await db
    .collection("results")
    .doc("ZHj34gWbE8msqCbsHUz0")
    .get();

  const rounds = [...Array(10).keys()];
  let lines = [];

  //Add the header.
  lines.push(
    [
      "Contestant",
      ...rounds.map(
        (_, i) =>
          `#${i + 1} Beer, #${i + 1} Correct, #${i + 1} Asterisk, #${i + 1
          } Taste, #${i + 1} Score`
      ),
    ].join(", ")
  );

  results.data().roundResults?.forEach((result) => {
    const columns = [result.userEmail];

    const rounds = result.roundResults.sort((r1, r2) => r1.index - r2.index);
    columns.push(
      ...rounds.map(
        (round) =>
          `${round.selectedBeer}, ${round.correct ? "YES" : "NO"}, ${round.asterisked ? "YES" : "NO"
          }, ${round.tasteScore + 1 === 5 ? "4" : round.tasteScore + 1}, ${round.points
          }`
      )
    );
    lines.push(columns.join(", "));
  });

  const csvData = lines.join("\n\r");
  fs.writeFileSync("./export.csv", csvData);
};
run();
