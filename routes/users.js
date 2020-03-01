"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/userModel');
var Hobby = require('../models/hobbyModel');
var router = express.Router();
//////// mongoose /////////
mongoose.connect('mongodb://localhost/userHobbies', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', function () {
    console.log('mongodb connection succeed');
});
/**
 * @swagger
 * tags:
 *    name: users
 *    description: manage user information
 */
/**
 * @swagger
 *  paths:
 *    /users:
 *      get:
 *        summary: get user information list
 *        tags: [users]
 
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.get('/', function (req, res, next) {
    User.find({}, null, function (err, docs) {
        if (err) {
            res.status(400).send({ result: false, message: err });
        }
        else {
            res.send(docs);
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /users/{id}:
 *      get:
 *        summary: Return user information by ID
 *        tags: [users]
 *        parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: user id
 *
 *        responses:
 *          200:
 *            description: OK
 *
 *          400:
 *            description: response error
 */
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    User.findById(id).populate('hobbies').exec(function (err, doc) {
        if (err) {
            res.status(400).send({ result: false, message: err });
        }
        else {
            console.log(doc.populated('hobbies'));
            res.send(doc);
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /users/:
 *      post:
 *        summary: create user information
 *        tags: [users]
 *        parameters:
 *          - in: body
 *            name: name
 *            type: string
 *            description: user name
 *
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.post('/', function (req, res, next) {
    var name = req.body.name;
    //var hobbies = req.body.hobbies;
    if (!name) {
        res.status(400).send({ result: false, message: 'name is required' });
        return;
    }
    var user = new User({
        //id: new mongoose.Types.ObjectId,
        name: name,
    });
    user.save(function (error) {
        if (error) {
            res.status(400).send({ result: false, message: error });
        }
        else {
            res.send({ result: true, message: "user is added" });
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /users/{id}:
 *      put:
 *        summary: update user information by id
 *        tags: [users]
 *        parameters:
 *          - in: body
 *            name: name
 *            type: string
 *            description: user name
 *
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.put('/:id', function (req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    //var hobbies = req.body.hobbies;
    if (!id) {
        res.status(400).send({ result: false, message: 'id is required in query string' });
        return;
    }
    else if (!name) {
        res.status(400).send({ result: false, message: 'name is required in body' });
        return;
    }
    User.updateOne({ _id: id }, { name: name }, function (err, result) {
        if (err) {
            res.status(400).send({ result: false, message: err });
        }
        else {
            res.send({ result: true, message: result.nModified });
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /users/:
 *      delete:
 *        summary: delete users information
 *        tags: [users]
 *
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.delete('/', function (req, res, next) {
    User.deleteMany({}, function (err) {
        if (err) {
            res.status(400).send({ result: false, message: err });
        }
        else {
            res.send({ result: true, message: 'All users are deleted' });
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /users/{id}:
 *      delete:
 *        summary: delete user information by id
 *        tags: [users]
 *        parameters:
 *          - in: query
 *            name: id
 *            type: string
 *            description: user id
 *
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    User.deleteOne({ _id: id }, function (err) {
        if (err) {
            res.send({ result: false, message: err });
            return;
        }
        else {
            res.send({ result: true, message: 'One user is deleted' });
            return;
        }
    });
});
module.exports = router;
