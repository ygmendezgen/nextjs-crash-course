// /api/new-meetup
import { MongoClient } from "mongodb";
async function handler(req, res) {
  // only post to this route
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://admin:admin@cluster0.btz8lty.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);

    console.log(result);
    // store in database
    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
