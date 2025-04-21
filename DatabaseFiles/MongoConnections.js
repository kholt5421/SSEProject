import express from "express";
//DO NOT UNDER ANY CIRCUMSTANCES REMOVE THE BRACKETS!!! BAD THINGS WILL HAPPEN!!!
import {MongoClient} from "mongodb";
import {fileURLToPath} from 'url';
import path from 'path';

//Create an express application to handle communications between the front end and back end
const app = express();
//Allow the app to pass json and urlencoded data into the mongo functions
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//Allow the app to interact with files in the main directory
const file = fileURLToPath(import.meta.url);
const directory = path.dirname(file);
app.use(express.static(path.join(directory, "..")));

app.get("/", (request, response) => {
  response.sendFile(path.join(directory, "index.html"));
});

const uri = "mongodb+srv://SSEconnection:RememberThis@cluster0.3jlg2.mongodb.net/";
const options = {
  ssl: true,
  sslValidate: false,
};
const client = new MongoClient(uri);

var dataBase = "SSE_MobileSecurityGame";
var dbCollection = "Testing"

//Create an account using data sent in via a request(response will be empty)
app.post("/createAccount", async(request, response) => {
  var data = request.body; //Get user data
  try{
    /*const expectedParams = 1;
    const actualParams = process.argv.length - 2;
    if(actualParams < expectedParams){
      throw new Error(
        `Invalid number of parameters. Expected ${expectedParams}, got ${actualParams}.`
      );
    }*/

    //Connect to MongoDB and check connection
    await client.connect();
    console.log("Connected to MongoDB sucessfully");
    //Connect to the proper database and collection
    const db = client.db(dataBase);
    const collection = db.collection(dbCollection);

    //Create the primary key
    var result = await collection.countDocuments(); //Get the count of how may users exist in database
    //Check to make sure the user Ids were retrieved
    if(result.acknowledged){
      throw new Error("Error: Failed to get new UserId.");
    }
    var newUserId = result + 1; //Create the new user_id by adding one to the count

    //Insert new data
    //Create a new document
    var document = {
      user_id: newUserId,
      username: data.Username,
      email: data.Email,
      password: data.Password,
      highestScore: 0,
      scores: []
    };
    //Insert the document data into the database
    result = await collection.insertOne(document);
    //Make sure it worked
    if (result.acknowledged) {
      console.log(`Data sucessfully inserted`);
    } else {
      throw new Error(`Failed to insert data`);
    }

  } catch (err) {
    console.error(`[Error] ${err}`);
  } finally {
    //Close Mongo
    await client.close();
  }
})

app.post("/login",async(request,response)=>{

})

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

/*
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
}*/
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