import express = require('express');

// import createError = require('http-errors');
// import path = require('path');
// import cookieParser = require('cookie-parser');
// import logger = require('morgan');
// import cors = require('cors');
import swaggerJSDoc = require('swagger-jsdoc');
import swaggerUi = require('swagger-ui-express');

// import indexRouter = require('./routes/index');
// import usersRouter = require('./routes/users');
// import hobbiesRouter = require('./routes/hobbies');

// Swagger definition
const swaggerDefinition = {
  info: {
    title: 'User Hobbies',
    version: '1.0.0',
    description: 'Auto API'
  },
  host: 'localhost:5000',
  basePath: '/'
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['./controllers/hobbies.ts', './controllers/users.ts']
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

class App {
  public app: express.Application;
  public port: number;
 
  constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
    this.template();
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
    middleWares.forEach(middleWare => {
        this.app.use(middleWare);
    })
  }

  private routes(controllers: { forEach: (arg0: (controller: any)=> void) => void; }){
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    })
  }

  private assets(){
    this.app.use(express.static('public'));
    this.app.use(express.static('views'));
  }

  private template(){
    this.app.set('view engine', 'pug');
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    })
  }

  public getExpressInstace(): express.Application {
    return this.app;
  }
}

export default App;