"use strict";
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var hobbiesRouter = require("./routes/hobbies");
// Swagger definition
var swaggerDefinition = {
    info: {
        title: 'User Hobbies',
        version: '1.0.0',
        description: 'Auto API'
    },
    host: 'localhost:3000',
    basePath: '/'
};
// Options for the swagger docs
var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./routes/hobbies.js', './routes/users.js']
};
// Initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
var app = express();
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hobbies', hobbiesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
