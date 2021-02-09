// initialize project dependencies using node require 
const express = require('express');
const data = require('./data.json');
const path = require('path');
const app = express();

// set up middleware including template engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));

// set routes to render template views
app.get('/', (req, res) => {
    res.locals.projects = data.projects;
    res.render('index');
});

app.get('/about', (req, res) => {
    // const err = new Error();
    // err.status = 500;
    // throw err;
    res.render('about');
});

app.get('/project/:id', (req, res, next) => {
    const id = req.params.id;
    const project = data.projects[id];

    // throw 404 if id out of bounds
    if (!project) {
        const err = new Error();
        err.status = 404;
        next(err);
    }
    res.render('project', {project});
});

// 404 error handler
app.use((req, res, next) => {
    console.log('Handling 404 error');
    const err = new Error();
    err.status = 404;
    next(err);
});

// global error handler
app.use((err, req, res, next) => {
    console.log('Handling a global error');

    if(err.status === 404) {
        res.render('page-not-found', {err});
    } else {
        res.locals.error = err;
        res.status(err.status);
        res.render('error', {err});
    }
});

app.listen(3000, () => {
    console.log('listening at http://localhost:3000');
});