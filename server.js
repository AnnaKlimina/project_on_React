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
        users.deleteMany({id:{$lt:time -  5*3600000}}) 
      }, 3600000); //7200000
});
  } catch (err) {
    return;
  }
})();


/**
 * @api {get} /init Инициализация пользователя
 * @apiGroup Getting started with chatbot
 * @apiDescription инициализация пользователя в начале работы с чат-ботом. Пользователь получает свой ID
 * @apiName Init
 * @apiSuccess {Number} id ID пользователя
 */
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

/**
 * @api {get} /selfTest?id=:id Запуск теста
 * @apiParam {Number} id ID пользователя
 * @apiGroup Self-employment test
 * @apiDescription Запуск теста на самозанятость
 * @apiName selfTest
 * @apiSuccess {Number} number номер вопроса
 * @apiSuccess {String} text текст вопроса
 * @apiSuccess {Array} next массив из двух значений: первое соответствует варианту ответа "Да", второе "Нет". Если значение - число, то интерфейс должен обратитьзя за следующим вопросом. Если значение - объект с полями "answer"(текст ответа) и "result"(true/false - результат теста "может/не может стать СЗ"), то это результат теста.
 * @apiError {Boolean} errorID возвращает true, если возникла ошибка поиска ID пользователя в базе.
 */

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
    response.send(JSON.stringify({errorID: true}));
  }
});

/**
 * @api {get} /selfTest/next?id=:id&number=:number Переход к следующему вопросу
 * @apiParam {Number} id ID пользователя
 * @apiParam {Number} number Номер вопроса
 * @apiGroup Self-employment test
 * @apiDescription Переход к следующему вопросу теста на самозанятость
 * @apiName selfTestNext
 * @apiSuccess {Number} number номер вопроса
 * @apiSuccess {String} text текст вопроса
 * @apiSuccess {Array} next массив из двух значений: первое соответствует варианту ответа "Да", второе "Нет". Если значение - число, то интерфейс должен обратитьзя за следующим вопросом. Если значение - объект с полями "answer"(текст ответа) и "result"(true/false - результат теста "может/не может стать СЗ"), то это результат теста.
 * @apiError {Boolean} errorID возвращает true, если возникла ошибка поиска ID пользователя в базе.
 */
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
    response.send(JSON.stringify({errorID: true}));
  }
});

/**
 * @api {get} /selfTest/prev?id=:id Переход к предыдущему вопросу
 * @apiParam {Number} id ID пользователя
 * @apiParam {Number} number Номер вопроса
 * @apiGroup Self-employment test
 * @apiDescription Переход к предыдущему вопросу теста на самозанятость
 * @apiName selfTestPrev
 * @apiSuccess {Number} number номер вопроса
 * @apiSuccess {String} text текст вопроса
 * @apiSuccess {Array} next массив из двух значений: первое соответствует варианту ответа "Да", второе "Нет". Если значение - число, то интерфейс должен обратитьзя за следующим вопросом. Если значение - объект с полями "answer"(текст ответа) и "result"(true/false - результат теста "может/не может стать СЗ"), то это результат теста.
 * @apiError {Boolean} errorID возвращает true, если возникла ошибка поиска ID пользователя в базе.
 */
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
    response.send(JSON.stringify({errorID: true}));
  }
});


/**
 * @api {get} /documents?id=:id Запуск теста
 * @apiParam {Number} id ID пользователя
 * @apiGroup Document selection test
 * @apiDescription Запуск теста на подбор комплекта документов
 * @apiName documents
 * @apiSuccess {Number} number номер вопроса
 * @apiSuccess {String} text текст вопроса
 * @apiSuccess {Array} options Массив вариантов ответов. Элемент массива - массив из двух значений. Первое - текст варианта ответа (String), второе - номер следующего вопроса (Number).
 * @apiError {Boolean} errorID возвращает true, если возникла ошибка поиска ID пользователя в базе.
 */
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
    response.send(JSON.stringify({errorID: true}));
  }
});

/**
 * @api {get} /documents/next?id=:id&number=:number&answer=:answer Переход к следующему вопросу
 * @apiParam {Number} id ID пользователя
 * @apiParam {Number} number номер следующего вопроса
 * @apiParam {Number} answer номер ответа, который выбрал пользователь в предыдущем вопросе
 * @apiGroup Document selection test
 * @apiDescription Переход к следующему вопросу теста на подбор комплекта документов
 * @apiName documentsNext
 * @apiSuccess {Number} number номер вопроса
 * @apiSuccess {String} text текст вопроса
 * @apiSuccess {Array} [options] Возвращается, если в тесте еще есть вопросы: массив вариантов ответов. Элемент массива - массив из двух значений. Первое - текст варианта ответа (String), второе - номер следующего вопроса (Number).
 * @apiSuccess {String} [link] Возвращается, если есть результат теста: ссылка на скачивание документа. Если параметр равен null, то текущая ветка договоров пока в разработке. 
 * @apiError {Boolean} errorID возвращает true, если возникла ошибка поиска ID пользователя в базе.
 */
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
    response.send(JSON.stringify({errorID: true}));
  }
});

/**
 * @api {get} /documents/prev?id=:id Переход к предыдущему вопросу
 * @apiParam {Number} id ID пользователя
 * @apiGroup Document selection test
 * @apiDescription Переход к предыдущему вопросу теста на подбор комплекта документов
 * @apiName documentsPrev
 * @apiSuccess {Number} number номер вопроса
 * @apiSuccess {String} text текст вопроса
 * @apiSuccess {Array} options Массив вариантов ответов. Элемент массива - массив из двух значений. Первое - текст варианта ответа (String), второе - номер следующего вопроса (Number).
 * @apiError {Boolean} errorID возвращает true, если возникла ошибка поиска ID пользователя в базе.
 */
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
    response.send(JSON.stringify({errorID: true}));
  }
});

/**
 * @api {get} /questions Получение категорий вопросов
 * @apiGroup Questions
 * @apiDescription Получение категорий вопросов о самозанятых
 * @apiName questions
 * @apiSuccess {String} text Текст вводного сообщения чат-бота
 * @apiSuccess {Array} options Массив вариантов категорий. Элемент массива - массив из двух значений. Первое - текст варианта (String), второе - номер (Number).
 */
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

/**
 * @api {get} /questions/next?category=:category&part=:part Получение вопросов конкретной категории
 * @apiParam {String} category Название категории
 * @apiParam {Number} part=0 Следующая часть вопросов (если доступных вопросов меньше 5, то по умолчанию part=0)
 * @apiGroup Questions
 * @apiDescription Получение вопросов о самозанятых
 * @apiName questionsNext
 * @apiSuccess {String} text Категория
 * @apiSuccess {Array} options Массив вариантов вопросов. Элемент массива - массив из двух значений. Первое - текст вопроса (String), второе - текст ответа на этот вопрос(String).
 * @apiSuccess {Number} part часть всего множества вопросов
 * @apiSuccess {Boolean} more Если true, то можно получить следующую часть вопросов по этому же запросу с соответствующими параметрами. 
 * @apiSuccess {Boolean} less Если true, то можно получить предыдущую часть вопросов из всего множества вопросов данной категории (по этому же запросу с соответствующими параметрами)
 */
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

/**
 * @api {get} /questions/prev?category=:category&part=:part Получение предыдущих вопросов 
 * @apiParam {String} category Название категории
 * @apiParam {Number} part=0 Следующая часть вопросов (если доступных вопросов меньше 5, то по умолчанию part=0)
 * @apiGroup Questions
 * @apiDescription Получение предыдущих вопросов о самозанятых. Запрос можно использовать, если вопросов по данной категории не меньше 5.
 * @apiName questionsPrev
 * @apiSuccess {String} text Категория
 * @apiSuccess {Array} options Массив вариантов вопросов. Элемент массива - массив из двух значений. Первое - текст вопроса (String), второе - текст ответа на этот вопрос(String).
 * @apiSuccess {Number} part часть всего множества вопросов
 * @apiSuccess {Boolean} more Если true, то можно получить следующую часть вопросов по этому же запросу с соответствующими параметрами. 
 * @apiSuccess {Boolean} less Если true, то можно получить предыдущую часть вопросов из всего множества вопросов данной категории (по этому же запросу с соответствующими параметрами)
 */
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

/**
 * @api {get} /aboutUs Информация "О нас"
 * @apiGroup "About Us" information
 * @apiDescription Получение информации "О нас" для оповещения пользователя
 * @apiName aboutUs
 * @apiSuccess {String} text Текст сообщения "О нас"
 */
app.get("/aboutUs", async function (request, response) {
  try {
    const aboutUs = await database.collection("aboutUs");
    let result = (await aboutUs.find({}).toArray())[0];
    response.send(JSON.stringify(result));
  } catch (err) {
    console.log(err);
  }
});
