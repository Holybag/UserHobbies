import App from './app'

import * as bodyParser from 'body-parser'

import UsersController from './controllers/users'
import HobbiesController from './controllers/hobbies'

const app = new App({
    port: 5000,
    controllers: [
        new UsersController(),
        new HobbiesController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true })
    ]
});

app.listen();
