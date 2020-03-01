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
db.once('open', function() {
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
router.get('/', function(req:any, res:any, next:any) {
    
  User.find({}, null, function(err:any, docs:any){
    if (err) {
      res.status(400).send({ result: false, message: err })
    } else {
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
router.get('/:id', function(req:any, res:any, next:any) {
  var id = req.params.id;

  User.findById(id).populate('hobbies').exec(function(err:any, doc:any){    
    if (err) {
      res.status(400).send({ result: false, message: err })
    } else {
      console.log(doc.populated('hobbies'));
      res.send(doc);
    }
  });
})

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
router.post('/', function(req:any, res:any, next:any){

  var name = req.body.name;
  //var hobbies = req.body.hobbies;

  var user = new User({
    //id: new mongoose.Types.ObjectId,
    name: name,
  });
  
  user.save( function(error:any) {
    if (error) {
      res.status(400).send({ result: false, message: error });      
    } else {
      res.send({ result: true, message: "" });
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
router.put('/:id', function(req:any, res:any, next:any){
  
  var id = req.params.id;
  var name = req.body.name;
  //var hobbies = req.body.hobbies;

  User.updateOne({ _id: id }, { name: name }, function(err:any, result:any){
    if (err) {
      res.status(400).send({ result: false, message: err });
    } else {
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
router.delete('/', function(req:any, res:any, next:any){

  User.deleteMany({}, function(err:any){
    if (err) {
      res.status(400).send({ result: false, message: err });
    } else {
      res.send({ result: true, message: '' });
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
router.delete('/:id', function(req:any, res:any, next:any){

  var id = req.params.id;
  User.deleteOne({ _id: id }, function(err:any) {
    if (err) {
      res.send({ result: false, message: err });
    } else {
      res.send({ result: true, message: '' });
    }
  });

});

export = router;