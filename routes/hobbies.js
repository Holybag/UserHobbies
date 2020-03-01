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
 *    name: hobbies
 *    description: manage hobbies information
 */
/**
 * @swagger
 *  paths:
 *    /hobbies:
 *      get:
 *        summary: get hobbies information list
 *        tags: [hobbies]
 
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.get('/', function (req, res, next) {
    Hobby.find({}, null, function (err, docs) {
        if (err) {
            res.send({ result: false, message: err });
        }
        else {
            res.send(docs);
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /hobbies/{userId}:
 *      get:
 *        summary: get specific user's hobbies information
 *        tags: [hobbies]
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
router.get('/:userId', function (req, res, next) {
    var id = req.params.userId;
    Hobby.findById(id, null, function (err, doc) {
        if (err) {
            res.send({ result: false, message: err });
        }
        else {
            res.send(doc);
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /hobbies/:
 *      post:
 *        summary: create user's hobby information
 *        tags: [hobbies]
 *        parameters:
 *          - in: body
 *            name: userId
 *            type: string
 *            description: user id
 *          - in: body
 *            name : passionLevel
 *            type: string
 *            description: hobby passion level
 *          - in: body
 *            name: name
 *            type: string
 *            description: hobby name
 *          - in: body
 *            name: year
 *            type: string
 *            description: how long having the hobby
 *
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.post('/', function (req, res, next) {
    var userId = req.body.userId;
    var passionLevel = req.body.passionLevel;
    var name = req.body.name;
    var year = req.body.year;
    if (!userId) {
        res.status(400).send({ result: false, message: 'userId is required in body' });
        return;
    }
    else if (!passionLevel) {
        res.status(400).send({ result: false, message: 'passionLevel is required in body' });
        return;
    }
    else if (!name) {
        res.status(400).send({ result: false, message: 'name is required in body' });
        return;
    }
    else if (!year) {
        res.status(400).send({ result: false, message: 'year is required in body' });
        return;
    }
    var hobby = new Hobby({
        passionLevel: passionLevel,
        name: name,
        year: parseInt(year)
    });
    hobby.save(function (errSave, savedHobby) {
        if (errSave) {
            res.status(400).send({ result: false, message: errSave });
        }
        else {
            var savedId = savedHobby._id;
            console.log(savedId.toString());
            User.findById(userId, null, function (errFindById, docUser) {
                if (errFindById) {
                    res.status(400).send({ result: false, message: errFindById });
                }
                else {
                    var hobbies = docUser.hobbies;
                    hobbies.push(savedHobby._id);
                    User.updateOne({ _id: userId }, { hobbies: hobbies }, function (errUpdateOne, result) {
                        if (errUpdateOne) {
                            res.status(400).send({ result: false, message: errUpdateOne });
                        }
                        else {
                            User.findById(userId).populate('hobbies').exec(function (errFindById2, populatedDoc) {
                                if (errFindById2) {
                                    res.status(400).send({ result: false, message: errFindById2 });
                                }
                                else {
                                    console.log(populatedDoc.populated('hobbies'));
                                    res.send(populatedDoc);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
/**
 * @swagger
 *  paths:
 *    /hobbies/:
 *      delete:
 *        summary: delete specific user's hobby information
 *        tags: [hobbies]
 *        parameters:
 *          - in: body
 *            name: userId
 *            type: string
 *            description: user id
 *          - in: body
 *            name : hobbyId
 *            type: string
 *            description: hobby id
 *
 *        responses:
 *          200:
 *            description: succeed
 *          400:
 *            description: response error
 */
router.delete('/', function (req, res, next) {
    var userId = req.body.userId;
    var hobbyId = req.body.hobbyId;
    if (userId) {
        if (!hobbyId) {
            res.status(400).send({ result: false, message: 'hobbyId is required in body' });
            return;
        }
        Hobby.deleteOne({ _id: hobbyId }, function (err) {
            if (err) {
                res.status(400).send({ result: false, message: err });
            }
            else {
                User.findById(userId, null, function (errFindById, docUser) {
                    if (errFindById) {
                        res.status(400).send({ result: false, message: errFindById });
                    }
                    else {
                        var hobbyIds = docUser.hobbies;
                        var newHobbies = [];
                        for (var _i = 0, hobbyIds_1 = hobbyIds; _i < hobbyIds_1.length; _i++) {
                            var hId = hobbyIds_1[_i];
                            var hIdString = hId._id.toString();
                            if (hIdString !== hobbyId) {
                                newHobbies.push(hId);
                            }
                        }
                        User.updateOne({ _id: userId }, { hobbies: newHobbies }, function (errUpdateOne, result) {
                            if (errUpdateOne) {
                                res.status(400).send({ result: false, message: errUpdateOne });
                            }
                            else {
                                User.findById(userId).populate('hobbies').exec(function (errFindById2, populatedDoc) {
                                    if (errFindById2) {
                                        res.status(400).send({ result: false, message: errFindById2 });
                                    }
                                    else {
                                        console.log(populatedDoc.populated('hobbies'));
                                        res.send(populatedDoc);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        Hobby.deleteMany({}, function (err) {
            if (err) {
                res.status(400).send({ result: false, message: err });
            }
            else {
                res.send({ result: true, message: 'All hobbies are deleted' });
            }
        });
    }
});
/**
 * @swagger
 *  paths:
 *    /hobbies/{id}:
 *      put:
 *        summary: update hobby information
 *        tags: [hobbies]
 *        parameters:
 *          - in: query
 *            name: id
 *            type: string
 *            description: hobby id
 *          - in: body
 *            name: name
 *            type: string
 *            description: hobby name
 *          - in: body
 *            name: passionLevel
 *            type: string
 *            description: hobby passion level
 *          - in: body
 *            name: year
 *            type: number
 *            description: how many years having the hobby
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
    var passionLevel = req.body.passionLevel;
    var year = req.body.year;
    if (!id) {
        res.status(400).send({ result: false, message: 'id is required in query string' });
        return;
    }
    else if (!name) {
        res.status(400).send({ result: false, message: 'name is required in body' });
        return;
    }
    else if (!passionLevel) {
        res.status(400).send({ result: false, message: 'passionLevel is required in body' });
        return;
    }
    else if (!year) {
        res.status(400).send({ result: false, message: 'year is required in body' });
        return;
    }
    Hobby.updateOne({ _id: id }, { name: name, passionLevel: passionLevel, year: parseInt(year) }, function (err, result) {
        if (err) {
            res.status(400).send({ result: false, message: err });
        }
        else {
            res.send({ result: true, message: result.nModified });
        }
    });
});
module.exports = router;
