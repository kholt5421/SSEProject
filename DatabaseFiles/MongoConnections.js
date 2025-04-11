//import fs from "fs";
import {MongoClient} from "mongodb";

const uri = "mongodb+srv://SSEconnection:RememberThis@cluster0.3jlg2.mongodb.net/";
const options = {
  ssl: true,
  sslValidate: false,
};
const client = new MongoClient(uri);


var dataBase = "SSE_MobileSecurityGame";
var dbCollection = "Testing"

async function getUserId(){
    var newUserId = null;
    try{
      const expectedParams = 1;
      const actualParams = process.argv.length - 2;
      if(actualParams < expectedParams){
        throw new Error(
          `Invalid number of parameters. Expected ${expectedParams}, go ${actualParams}.`
        );
      }

      //Connect to MongoDB and check connection
      await client.connect();
      console.log("Connected to MongoDB sucessfully");

      const db = client.db(dataBase);
      const collection = db.collection(dbCollection);

      //Create documents
      const document = {};
      const sort = {user_id: -1} //Sort in descending order of user_id

      //Retrieve document from MongoDB
      const result = await collection.find(document).sort(sort).limit(1).toArray();

      if (result.acknowledged) {
        console.log(`User IDs found`);
        newUserId = values[0].user_id + 1;
      } else {
        console.log("Failed to get User IDs");
      }
    } catch (err) {
      console.error(`[Error] ${err}`);
    } finally {
      //Return document and close Mongo
      await client.close();
      return newUserId;
    }
}

function retrieve(data){
  async ()=> {
    var values = null;
    try{
      const expectedParams = 1;
      const actualParams = process.argv.length - 2;
      if(actualParams < expectedParams){
        throw new Error(
          `Invalid number of parameters. Expected ${expectedParams}, go ${actualParams}.`
        );
      }

      //Connect to MongoDB and check connection
      await client.connect();
      console.log("Connected to MongoDB sucessfully");

      const db = client.db(dataBase);
      const collection = db.collection(dbCollection);

      //Process data
      const document = {
        content: data,
      };

      //Retrieve document from MongoDB
      const result = await collection.find(document);
      values = result.toArray();


      if (result.acknowledged) {
        console.log(`Document data retrieved`);
      } else {
        console.log("Failed to retrieve the document data");
      }
    } catch (err) {
      console.error(`[Error] ${err}`);
    } finally {
      //Return document and close Mongo
      await client.close();
      return values;
    }
  }
}

async function insert(data){
  try{
    const expectedParams = 1;
    const actualParams = process.argv.length - 2;
    if(actualParams < expectedParams){
      throw new Error(
        `Invalid number of parameters. Expected ${expectedParams}, go ${actualParams}.`
      );
    }

    //Connect to MongoDB and check connection
    await client.connect();
    console.log("Connected to MongoDB sucessfully");

    const db = client.db(dataBase);
    const collection = db.collection(dbCollection);

    //Process data
    const document = {
      content: data,
      insertAt: new Date()
    };

    //Insert the document into MongoDB
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
}
async function update(data,filter){
  try{
    const expectedParams = 1;
    const actualParams = process.argv.length - 2;
    if(actualParams < expectedParams){
      throw new Error(
        `Invalid number of parameters. Expected ${expectedParams}, go ${actualParams}.`
      );
    }

    //Connect to MongoDB and check connection
    await client.connect();
    console.log("Connected to MongoDB sucessfully");

    const db = client.db(dataBase);
    const collection = db.collection(dbCollection);

    //Get data from mongo
    var result = await collection.updateOne(filter,data);

    if (result.acknowledged) {
      console.log(`Document was updated`);
    } else {
      console.log("Failed to update the document");
    }
  } catch (err) {
    console.error(`[Error] ${err}`);
  } finally {
    await client.close();
  }
}
/*
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
})();*/