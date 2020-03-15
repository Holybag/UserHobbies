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

class UsersController {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes(){
    this.router.get(this.path, this.getAllUsers);
    this.router.get(this.path + '/:id', this.getUser);
    this.router.post(this.path, this.createUser);
    this.router.put(this.path + '/:id', this.modifyUser);
    this.router.delete(this.path + '/:id', this.deleteUser);
    this.router.delete(this.path, this.deleteAllUsers);
  }

  getAllUsers = (req: Request, res: Response) => {
    
    User.find({}, null, function(err:any, docs:any){
      if (err) {
        res.status(400).send({ result: false, message: err })
      } else {
        res.send(docs);
      }    
    });
  }

  getUser = (req: Request, res: Response) => {
    const id = req.params.id;
    
    User.count({_id: id}, function(err:any, count:any){
      if (count > 0){
        User.findById(id).populate('hobbies').exec(function(err2:any, doc2:any){    
          if (err2) {
            res.status(400).send({ result: false, message: err2 })
          } else {
            //console.log(doc2.populated('hobbies'));
            res.send(doc2);
          }
        });
      } else {
        res.send({ result: true, message: [] });
      }   
    })
  }

  createUser = (req: Request, res: Response) => {
    var name = req.body.name;  

    if (!name) {
      res.status(400).send({ result: false, message: 'name is required' });
      return;
    }

    var user = new User({
      //id: new mongoose.Types.ObjectId,
      name: name,
    });

    user.save(function (error: any) {
      if (error) {
        res.status(400).send({ result: false, message: error });
      } else {
        res.send({ result: true, message: "user is added" });
      }
    });
  }

  modifyUser = (req: Request, res: Response) => {
    var id = req.params.id;
    var name = req.body.name;    

    if (!id) {
      res.status(400).send({ result: false, message: 'id is required in query string' });
      return;
    } else if (!name) {
      res.status(400).send({ result: false, message: 'name is required in body' });
      return;
    }

    User.updateOne({ _id: id }, { name: name }, function (err: any, result: any) {
      if (err) {
        res.status(400).send({ result: false, message: err });
      } else {
        res.send({ result: true, message: result.nModified + ' user modified'});
      }
    });
  }

  deleteAllUsers = (req: Request, res: Response) => {
    User.deleteMany({}, function (err: any) {
      if (err) {
        res.status(400).send({ result: false, message: err });
      } else {
        res.send({ result: true, message: 'All users are deleted' });
      }
    });
  }
  deleteUser = (req: Request, res: Response) => {
    var id = req.params.id;

    User.deleteOne({ _id: id }, function (err: any) {
      if (err) {
        res.send({ result: false, message: err });
        return;
      } else {
        res.send({ result: true, message: 'One user is deleted' });
        return;
      }
    });
  }
}

export default UsersController;
