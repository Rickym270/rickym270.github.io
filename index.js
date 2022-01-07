var express = require("express");
var bodyParser = require("body-parser")
//const router = express.Router;
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var PORT = 8080;

app.get('/projects', (req, resp) => {
    resp.status(200).send({
        title: 'TestProject',
        language: 'python'
    })
});

app.post('/projects', (req, resp) => {
    console.log("POST request sent");
    console.log(resp);
    resp.send({
        message: `Project was created`
    })
});

app.listen(
    PORT,
    () => console.log(`API is alive on http://localhost:${PORT}`)
)
