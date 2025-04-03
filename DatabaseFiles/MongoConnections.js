const fs = require("fs");
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://SSEconnection:RememberThis@cluster0.3jlg2.mongodb.net/";
const client = new MongoClient(uri);
const options = {
  ssl: true,
  sslValidate: false,
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
    const fileContent = fs.readFileSync(filePath, "utf-8").trim();
    const jsonData = JSON.parse(fileContent);

    console.log('File content parsed:', jsonData)
    console.log('File content length: ${JSON.stringify(jsonData).length}')

    const document = {
      content: jsonData,
      insertedAt: new Date()
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