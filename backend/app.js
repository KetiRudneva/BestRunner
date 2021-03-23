require('dotenv').config();
const express = require("express");
const app = express();
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const cors = require('cors');
const bodyParser = require("body-parser");
const ObjectId = require('mongodb').ObjectId;

const {
  DB_USER,
  DB_PASSWORD,
} = process.env;

const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.byt7s.mongodb.net`;
const mongoClient = new MongoClient(url, {
    useNewUrlParser: true,
    poolSize: 2,
    promiseLibrary: global.Promise,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const urlencodedParser = bodyParser.json({extended: false});

let usersCollection = null;
let workoutsCollection = null;

mongoClient.connect(function (err, client) {
    const db = client.db("sport-app");
    usersCollection = db.collection("users");
    workoutsCollection = db.collection("records")
    console.log('db connected')
})

app.post("/auth", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400)
    }
    const userData = request.body;
    const name = userData.username;
    const password = userData.password;

    console.log('Авторизация');
    console.log(userData);

    usersCollection.find({username: name}).toArray((err, result) => {
        if (result.length === 0) {
            response.json({result: "not registered"}); // отправляем ответ обратно
        } else {
            response.json({result: "ok", user: result}); // отправляем ответ обратно
        }
    })
});

app.post("/reg", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400)
    }

    const userData = request.body;
    const name = userData.username;
    const password = userData.password;

    console.log('Регистрация');
    console.log(name);

    usersCollection.find({username: name}).toArray((err, result) => {
        if (result.length === 0) {
            usersCollection.insertOne({username: name, password}, (err, result) => {
                console.log(result)
                response.json({result: "ok", user: result.ops})
                console.log('Новый пользователь зарегистрирован')
            })
        } else {
            response.json({result: "registered", user: null});
            console.log('Пользователь не зарегистрирован')
        }
    })
});

// comment: "comment"
// date: "2021-03-25T10:23:00.000Z"
// length: 123
// type: "bike"
// userId: "6054e2720291ef681f22c78f"

app.post("/add", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400)
    }

    const workout = request.body.item

    console.log('Добавление тренировки');
    console.log(workout);

    workoutsCollection.insertOne({...workout}, (err, result) => {
        console.log(result)
        response.json({insertedId: result.insertedId})
    })
});

app.post("/getWorkouts", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400)
    }

    const userId = request.body.user_id

    console.log('Получение списка тренировок пользователя');
    console.log('Id пользователя: ', userId);

    workoutsCollection.find({user_id: userId}).toArray((err, result) => {
        response.json({result: result});
    })
});

app.post("/update", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400)
    }

    const item = request.body.item

    console.log('Обновление тренировки');

    workoutsCollection.update(
        {_id : new ObjectId(item._id)},
        {length: item.length, comment: item.comment, type: item.type, user_id: item.user_id, date: item.date}, {upsert: false}, (err, result) => {
            response.json({result: "ok"})
        })
});

app.post("/delete", urlencodedParser, function (request, response) {
    if (!request.body) {
        return response.sendStatus(400)
    }

    const item = request.body.item

    console.log('Удаление тренировки');

    workoutsCollection.remove(
        {_id : new ObjectId(item._id)}, (err, result) => {
            response.json({result: "ok"})
        })
});


const port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log('Server started at ' + port + " port")
});
