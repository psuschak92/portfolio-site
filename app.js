const express = require('express');
const data = require('./data.json');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // console.log(data.projects);
    res.locals.projects = data.projects;
    res.render('index');
});

app.get('/about', (req, res) => {
    // const err = new Error('500 error alert!');
    // err.status = 500;
    // throw err;
    res.render('about');
});

app.get('/projects/:id', (req, res, next) => {
    const id = req.params.id;
    const project = data.projects[id];
    console.log('id -> ' + project);
    if (!project) {
        const err = new Error(`Oops, page not found. Looks like the route "${req.url}" does not exist.`);
        err.status = 404;
        next(err);
    }
    res.render('project', {project});
});

// 404 error endpoint
app.use((req, res, next) => {
    console.log('Handling 404 error');
    const err = new Error(`Oops, page not found. Looks like the route "${req.url}" does not exist.`);
    err.status = 404;
    next(err);
});

// 500 error endpoint
app.use((err, req, res, next) => {
    console.log('Handling a global error');
    console.log(err);

    res.locals.error = err;
    res.status(err.status);
    res.send(err.message);
});

app.listen(3000, () => {
    console.log('listening at http://localhost:3000');
});