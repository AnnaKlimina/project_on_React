const express = require("express");
const { MongoClient } = require("mongodb");
var fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.static("documents"));
app.use(fileUpload({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8080;

const uri = "mongodb+srv://anna:chatbot@chatbot.ne8nkkk.mongodb.net/chatbot?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let database;

(async () => {
  try {
    await client.connect();
    database = client.db("chatbot");
    await app.listen(port,(error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server is listening on port ${port}`);
      setInterval( ()=>{//setInterval
        const time = + new Date();
        const users = database.collection("users");
        users.deleteMany({id:{$lt:time - 3600000}}) 
      }, 3600000); //7200000
});
  } catch (err) {
    return;
  }
})();



app.get("/init", async function (request, response) {
  try {
    let insertUser = {
      id: Number(request.query.id),
      testSE: '',
      testDoc: '',
      documents: '',
      questions: {
        category: '',
        part: 0
      },
    };

    const users = database.collection("users");

    users.insertOne(insertUser, function (err, result) {
      if (err) {
        return console.log(err);
      }
    });

    let result = {id: Number(request.query.id)};

    response.send(JSON.stringify(result));

  } catch (err) {
    console.log(err);
  }
});

app.get("/selfTest", async function(request, response){
  try{
    let id = Number(request.query.id);

    const users = database.collection("users");

    await users.updateOne(
      { id: id },
      { $set: { testSE: "0" } }
    );

    const testSE = database.collection("testSE");
    
    let question = (await testSE.find({ number: 0 }).toArray())[0];
    response.send(JSON.stringify(question));
  } catch(err){
    console.log(err)
  }
});

app.get("/selfTest/next", async function(request, response){
  try{
    let id = Number(request.query.id);
    let number = request.query.number;

    const users = database.collection("users");
    let userTestSE = ((await users.find({ id: id }).toArray())[0]).testSE + String(number);
    await users.updateOne(
      { id: id },
      { $set: { testSE: userTestSE } }
    );

    const testSE = database.collection("testSE");
    let question = (await testSE.find({ number: Number(number) }).toArray())[0];
    response.send(JSON.stringify(question));

  } catch(err){
    console.log(err)
  }
});


app.get("/selfTest/prev", async function(request, response){
  try{
    let id = Number(request.query.id);
    
    const users = database.collection("users");
    let userTestSE = ((await users.find({ id: id }).toArray())[0]).testSE;
    if(userTestSE.length < 2){
      response.send(JSON.stringify({text: ""}));
    } else {
      let number = userTestSE[userTestSE.length - 2];
      await users.updateOne(
      { id: id },
      { $set: { testSE: userTestSE.slice(0, - 1) } }
      );

      const testSE = database.collection("testSE");
      let question = (await testSE.find({ number: Number(number) }).toArray())[0];
      response.send(JSON.stringify(question));
    }
  } catch(err){
    console.log(err);
  }
});

app.get("/documents", async function(request,response){
  try{
    let id = Number(request.query.id);

    const users = database.collection("users");

    await users.updateOne(
      { id: id },
      { $set: { testDoc: "0", documents: ""} }
    );

    const testDoc = database.collection("testDoc");
    
    let question = (await testDoc.find({ number: 0 }).toArray())[0];
    response.send(JSON.stringify(question));

  } catch(err){
    console.log(err)
  }
});

app.get("/documents/next", async function(request,response){
  try{
    let id = Number(request.query.id);
    let number = request.query.number;
    let answer = request.query.answer;

    if(number == 0){
      const users = database.collection("users");
      let user = (await users.find({ id: id }).toArray())[0];
      let userDocument = user.documents + String(answer);
      await users.updateOne(
        { id: id },
        { $set: {documents: userDocument} }
      );

      const documents = database.collection("documents");
      // let link = ((await documents.find({ code: userDocument }).toArray())[0]).link; - потом вернуть
      let doc = await documents.find({ code: userDocument }).toArray();
      if(doc.length === 0){
          response.send(JSON.stringify({text:'', link: null}));
      } else {
      let link = doc[0].link;
      response.send(JSON.stringify({text:'', link: link}));
      }

    } else {

    const users = database.collection("users");
    let user = (await users.find({ id: id }).toArray())[0];
    let userTestDoc = user.testDoc + String(number);
    let userDocument = user.documents + String(answer);
    await users.updateOne(
      { id: id },
      { $set: { testDoc: userTestDoc, documents: userDocument} }
    );

    const testDoc = database.collection("testDoc");
    let question = (await testDoc.find({ number: Number(number) }).toArray())[0];
      response.send(JSON.stringify(question));
    }

  } catch(err){
    console.log(err);
  }
});

app.get("/documents/prev", async function(request, response){
  try{
    let id = Number(request.query.id);

    const users = database.collection("users");
    let user = (await users.find({ id: id }).toArray())[0];
    let userTestDoc = user.testDoc;
    let userDocument = user.documents;
    if(userTestDoc.length < 2){
      response.send(JSON.stringify({text: ""}));
    } else {
      let number = userTestDoc[userTestDoc.length-2];
      await users.updateOne(
      { id: id },
      { $set: { testDoc: userTestDoc.slice(0, -1), documents: userDocument.slice(0, -1) } }
      );
      const testDoc = database.collection("testDoc");
      let question = (await testDoc.find({ number: Number(number) }).toArray())[0];
      response.send(JSON.stringify(question));
  }
 } catch(err){
    console.log(err);
  }
});

app.get("/questions", async function(request, response){
  try{

    const questions = await database.collection("questions");
    let categories = await questions.find({}).toArray();
    let result = {
      text: "Что Вас интересует?",
      options: categories.map((obj, index)=>[obj.category, index]),
    };
    response.send(JSON.stringify(result));

  } catch(err){
    console.log(err);
  }
});

app.get("/questions/next", async function(request,response){
  try {
    let category = request.query.category;
    let part = Number(request.query.part);

    const questions = await database.collection("questions");
      let question = (await questions.find({category: category}).toArray())[0];
      let options = question.options;
      let result;

      let end = Math.min(part*4 + 4, options.length);
      if(end === options.length){
        result = {
        text: category,
        options: options.slice(4*part, end),
        part: part,
        more: false,
        less: !!part,
      };
      } else {
        result = {
        text: category,
        options: options.slice(4*part, end),
        part: part+1,
        more: true,
        less: !!part,
      };
      }
      response.send(JSON.stringify(result));
  } catch(err){
    console.log(err);
  }
});

app.get("/questions/prev", async function(request,response){
  try {
    let category = request.query.category;
    let part = Number(request.query.part)-1;

    const questions = await database.collection("questions");
      let question = (await questions.find({category: category}).toArray())[0];
      let options = question.options;
      let result;

      let start = Math.max(part*4 - 4, 0);
      if(start === 0){
        result = {
        text: category,
        options: options.slice(0, 4),
        part: part,
        more: true,
        less: false,
      };
      } else {
        result = {
        text: category,
        options: options.slice(4*part-4, 4*part),
        part: part-1,
        more: true,
        less: true,
      };
      }
      response.send(JSON.stringify(result));
  } catch(err){
    console.log(err);
  }
});


app.get("/closeDB", async function (request, response) {
  try {
    await client.close();
    console.log("end");
  } catch (err) {
    console.log(err);
  }
});
