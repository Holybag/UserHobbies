import express = require('express');
import { Request, Response } from 'express';
//import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import { IUser, User } from '../models/userModel';
import { IHobby, Hobby } from '../models/hobbyModel';

//////// mongoose /////////
mongoose.connect('mongodb://localhost/userHobbies', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', function() {
    console.log('mongodb connection succeed');
});

class HobbiesController {
    public path = '/hobbies';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(this.path, this.getAllHobbies);
        this.router.get(this.path + '/:hobbyId', this.getHobby);
        this.router.post(this.path, this.addHobbyToUser);
        this.router.delete(this.path, this.deleteHobbyFromUserOrAllHobbies);
        this.router.put(this.path + '/:id', this.modifyHobby);
    }

    getAllHobbies = (req: Request, res: Response) => {
        Hobby.find({}, null, function(err:any, docs:any){
            if (err) {
                res.send({ result: false, message: err });
            } else {
                res.send(docs);
            }
        });
    }

    getHobby = (req: Request, res: Response) => {
        var id = req.params.hobbyId;

        Hobby.findById(id, null, function (err: any, doc: any) {
            if (err) {
                res.send({ result: false, message: err });
            } else {
                res.send(doc);
            }
        });
    }

    addHobbyToUser = (req: Request, res: Response) => {
        var userId = req.body.userId;    
        var passionLevel = req.body.passionLevel;
        var name = req.body.name;
        var year = req.body.year;

        if (!userId) {
            res.status(400).send({ result: false, message: 'userId is required in body' });
            return;
        } else if (!passionLevel) {
            res.status(400).send({ result: false, message: 'passionLevel is required in body' });
            return;
        } else if (!name) {
            res.status(400).send({ result: false, message: 'name is required in body' });
            return;
        } else if (!year) {
            res.status(400).send({ result: false, message: 'year is required in body' });
            return;
        }

        var hobby = new Hobby({
            passionLevel: passionLevel,
            name: name,
            year: parseInt(year)
        });

        hobby.save(function (errSave: any, savedHobby: any) {
            if (errSave) {
                res.status(400).send({ result: false, message: errSave });
            } else {
                var savedId = savedHobby._id;
                //console.log(savedId.toString());

                User.findById(userId, null, function (errFindById: any, docUser: any) {
                    if (errFindById) {
                        res.status(400).send({ result: false, message: errFindById });
                    } else {
                        var hobbies = docUser.hobbies;
                        hobbies.push(savedHobby._id);
                        User.updateOne({ _id: userId }, { hobbies: hobbies }, function (errUpdateOne: any, result: any) {
                            if (errUpdateOne) {
                                res.status(400).send({ result: false, message: errUpdateOne });
                            } else {
                                User.findById(userId).populate('hobbies').exec(function (errFindById2: any, populatedDoc: any) {
                                    if (errFindById2) {
                                        res.status(400).send({ result: false, message: errFindById2 });
                                    } else {
                                        //console.log(populatedDoc.populated('hobbies'));
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

    deleteHobbyFromUserOrAllHobbies = (req: Request, res: Response) => {
        var userId = req.body.userId;
        var hobbyId = req.body.hobbyId;

        if (userId) {
            if (!hobbyId) {
                res.status(400).send({ result: false, message: 'hobbyId is required in body' });
                return;
            }
            Hobby.deleteOne({ _id: hobbyId }, function (err: any) {
                if (err) {
                    res.status(400).send({ result: false, message: err });
                } else {
                    User.findById(userId, null, function (errFindById: any, docUser: any) {
                        if (errFindById) {
                            res.status(400).send({ result: false, message: errFindById });
                        } else {
                            var hobbyIds = docUser.hobbies;
                            var newHobbies = [];
                            for (const hId of hobbyIds) {
                                var hIdString = hId._id.toString();
                                if (hIdString !== hobbyId) {
                                    newHobbies.push(hId);
                                }
                            }
                            User.updateOne({ _id: userId }, { hobbies: newHobbies }, function (errUpdateOne: any, result: any) {
                                if (errUpdateOne) {
                                    res.status(400).send({ result: false, message: errUpdateOne });
                                } else {
                                    User.findById(userId).populate('hobbies').exec(function (errFindById2: any, populatedDoc: any) {
                                        if (errFindById2) {
                                            res.status(400).send({ result: false, message: errFindById2 });
                                        } else {
                                            //console.log(populatedDoc.populated('hobbies'));
                                            res.send(populatedDoc);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            Hobby.deleteMany({}, function (err: any) {
                if (err) {
                    res.status(400).send({ result: false, message: err })
                } else {
                    res.send({ result: true, message: 'All hobbies are deleted' })
                }
            })
        }
    }

    modifyHobby = (req: Request, res: Response) => {
        var id = req.params.id;
        var name = req.body.name;
        var passionLevel = req.body.passionLevel;
        var year = req.body.year;

        if (!id) {
            res.status(400).send({ result: false, message: 'id is required in query string' });
            return;
        } else if (!name) {
            res.status(400).send({ result: false, message: 'name is required in body' });
            return;
        } else if (!passionLevel) {
            res.status(400).send({ result: false, message: 'passionLevel is required in body' });
            return;
        } else if (!year) {
            res.status(400).send({ result: false, message: 'year is required in body' });
            return;
        }

        Hobby.updateOne({ _id: id }, { name: name, passionLevel: passionLevel, year: parseInt(year) }, function (err: any, result: any) {
            if (err) {
                res.status(400).send({ result: false, message: err });
            } else {
                res.send({ result: true, message: result.nModified });
            }
        });
    }
}

export default HobbiesController;