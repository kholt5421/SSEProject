import express from "express";
//DO NOT UNDER ANY CIRCUMSTANCES REMOVE THE BRACKETS!!! BAD THINGS WILL HAPPEN!!!
import {MongoClient} from "mongodb";
import {fileURLToPath} from 'url';
import path from 'path';

//Allow the program to pass multiple things into mongo post functions
const app = express();
app.use(express.urlencoded({ extended: true }));
//Allow the program to interact with files in the Home directory
const file = fileURLToPath(import.meta.url);
const directory = path.dirname(file);
app.use(express.static(path.join(directory, "..")));

app.get("/createAccount", (request, response) => {
  response.sendFile(path.join(directory, "Home", "create.html"));
});
app.get("/", (request, response) => {
  response.sendFile(path.join(directory, "..", "index.html"));
});

const uri = "mongodb+srv://SSEconnection:RememberThis@cluster0.3jlg2.mongodb.net/";
const options = {
  ssl: true,
  sslValidate: false,
};
const client = new MongoClient(uri);

var dataBase = "SSE_MobileSecurityGame";
var dbCollection = "Testing"

//Create an account using data
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
    //Start by retrieving the highest user_id
    //Create document
    var document = {};
    //Use document to retrieve data from MongoDB
    //var result = await collection.find(document).sort({user_id: 1}).toArray();
    var result = await collection.countDocuments();
    //Check to make sure the user Ids were retrieved
    if(result.acknowledged){
      throw new Error("Error: Failed to get new UserId.");
    }
    //Create the new user_id
    var newUserId = result + 1;
    //Insert new data
    //Create document
    document = {
      user_id: newUserId,
      username: data.Username,
      email: data.Email,
      password: data.Password,
      scores: []
    }
    //Insert the data
    result = await collection.insertOne(document);
    //Make sure it worked
    if (result.acknowledged) {
      console.log(`Data sucessfully inserted`);
      response.send("Sucess");
    } else {
      throw new Error(`Failed to insert data`);
    }

  } catch (err) {
    console.error(`[Error] ${err}`);
  } finally {
    //Return document and close Mongo
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