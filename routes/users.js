var express = require('express');
//var mongoDb = require('mongodb');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/userModel');
var Hobby = require('../models/hobbyModel');

var router = express.Router();
//var mongoClient = mongoDb.MongoClient;


//////// mongoose /////////
mongoose.connect('mongodb://localhost/userHobbies', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.once('open', function() {
  console.log('mongodb connection succeed');
});

// const url = 'mongodb://yhkim:yhkim01!@localhost:27017';
// const dbName = 'userHobbies';
// var db = null;
// var usersCollection = null;
// mongoClient.connect(url, function(err, client) {
//   console.log('Connected successfully to mongodb server);')
//   db = client.db(dbName);
//   usersCollection = db.collection('Users');
// });

/* GET users listing. */
router.get('/', function(req, res, next) {
    
  User.find({}, null, function(err, docs){
    if (err) {
      res.send({ result: false, message: err })
    } else {
      // var users = docs;
      // for(const user of users){
      //   if (user.hobbies.length>1){
      //     var hobbies = user.hobbies;         
      //     var i;
      //     var newArr = [];
      //     for(const hobby of hobbies){                                    
      //       var id = hobby._id.toString();
      //       console.log(id);
      //       if (id !== "5e58340acd91d81d55af1004"){
      //         newArr.push(hobby._id);
      //       }
      //     }
      //     console.log(newArr);
      //   }
      // }
      res.send(docs);
    }    
  })
  // usersCollection.find({}).toArray(function(error, results){
  //   if (error) {
  //     res.send({ result: false, message: error });
  //   } else {
  //     res.send(results);
  //   }
  // });

});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;

  User.findById(id).populate('hobbies').exec(function(err, doc){    
    if (err) {
      res.send({ result: false, message: err })
    } else {
      console.log(doc.populated('hobbies'));
      res.send(doc);
    }
  });
})

/* POST users */
router.post('/', function(req, res, next){

  var name = req.body.name;
  var hobbies = req.body.hobbies;

  var user = new User({
    //id: new mongoose.Types.ObjectId,
    name: name,
  });

  user.save( function(error) {
    if (error) {
      res.send({ result: false, message: error });      
    } else {
      res.send({ result: true, message: "" });
    }    
  })
  
  // usersCollection.save({
  //   name: name,
  //   hobbies: hobbies
  // }, function(error, result){
  //   if (error) {
      
  //   } else {
  //     res.send(result);
  //   }
  // });

});

/* PUT users */
router.put('/:id', function(req, res, next){
  
  var id = req.params.id;
  var hobbies = req.body.hobbies;

  User.updateOne({ _id: id }, { hobbies: hobbies }, function(err, result){
    if (err) {
      res.send({ result: false, message: err });
    } else {
      res.send({ result: true, message: result.nModified });
    }
  })

  // userCollection.updateOne({
  //   _id: new mongoDb.ObjectID(id)
  // }, {
  //   $set: { hobbies: hobbies }
  // }, 
  // function(error, result){
  //   if (error) {
  //     res.send({ result: false, message: error })
  //   } else {
  //     res.send(result);
  //   }
  // });

});

/*  DELETE users  */
router.delete('/', function(req, res, next){

  User.deleteMany({}, function(err){
    if (err) {
      res.send({ result: false, message: err });
    } else {
      res.send({ result: true, message: '' });
    }
  });  

  // usersCollection.deleteMany({}, function(error, result){
  //   if (error) {
  //     res.send({ result: false, message: error });
  //   } else {
  //     res.send(result);
  //   }
  // });

});

router.delete('/:id', function(req, res, next){

  var id = req.params.id;
  User.deleteOne({ _id: id }, function(err) {
    if (err) {
      res.send({ result: false, message: err });
    } else {
      res.send({ result: true, message: '' });
    }
  });

});

module.exports = router;
