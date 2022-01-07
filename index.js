import express from 'express';
var app = express();
var PORT = 8080;

app.get('/projects', (req, resp) => {
    resp.status(200).send({
        title: 'TestProject',
        language: 'python'
    })
});

app.post('/projects/:id', (req, resp) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        resp.status(418).send({message: "Title is required"})
    }
    resp.send({
        message: `Project with ID of ${id} was created`
    })
});

app.listen(
    PORT,
    () => console.log(`API is alive on http://localhost:${PORT}`)
)
