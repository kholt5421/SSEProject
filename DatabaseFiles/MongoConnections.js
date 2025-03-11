const fs = require("fs");
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://SSEconnection:RememberThis@cluster0.3jlg2.mongodb.net/";
const client = new MongoClient(uri);
const options = {
  ssl: true,
  sslValidate: true,
  sslCA: fs.readFileSync("/path/to/ca-certificate.crt"),
};

(async () => {
  try {
    const expectedParams = 1;
    const actualParams = process.argv.length - 2;

    if (actualParams < expectedParams) {
      throw new Error(
        `Invalid number of parameters. Expected ${expectedParams}, got ${actualParams}.`
      );
    }

    const filePath = process.argv[2];

    // Connect to MongoDB and check connection
    await client.connect();
    console.log("Connected to MongoDB successfully");

    const db = client.db("SSE_MobileSecurityGame");
    const collection = db.collection("Testing");

    // Read and process the file
    const base64Key = fs.readFileSync("keys/master-key.txt", "utf8").trim();
    const masterKey = Buffer.from(base64Key, "base64");
    const fileContent = fs.readFileSync(filePath, "utf-8").trim();

    console.log(`File content length: ${fileContent.length}`);

    if (fileContent.length === 0) {
      throw new Error("File content is empty");
    }

    // Create the document to insert
    const document = {
      content: fileContent,
      masterKey: masterKey.toString('base64'), // You can store it as base64 encoded
      insertedAt: new Date(),
    };

    // Insert the document into MongoDB
    const result = await collection.insertOne(document);

    if (result.acknowledged) {
      console.log(`Document inserted with _id: ${result.insertedId}`);
    } else {
      console.log("Failed to insert the document");
    }
  } catch (err) {
    console.error(`[Error] ${err}`);
  } finally {
    await client.close();
  }
})();