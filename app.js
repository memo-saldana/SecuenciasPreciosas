require('dotenv').config()
var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    database = require('./db/dbSetup')(mongoose),
    indexRoutes = require('./routes/index');
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))


// Routers
app.use('/', indexRoutes)

// Listener
app.listen(PORT, () => {
  console.log(`${ process.env.PROJECT_NAME } API on port ${ PORT }`)
})