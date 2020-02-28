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

/* GET hobbies listring  */
router.get('/', function(req, res, next){

    Hobby.find({}, null, function(err, docs){
        if (err) {
            res.send({ result: false, message: err });
        } else {
            res.send(docs);
        }
    });

});

router.get('/:id', function(req, res, next){
    
    var id = req.params.id;

    Hobby.findById(id, null, function(err, doc){
        if (err) {
            res.send({ result: false, message: err });
        } else {
            res.send(doc);
        }
    });
});

/*  POST hobby */
router.post('/:userId', function(req, res, next){

    var userId = req.params.userId;    
    var passionLevel = req.body.passionLevel;
    var name = req.body.name;
    var year = req.body.year;

    var hobby = new Hobby({        
        passionLevel: passionLevel,
        name: name,
        year: parseInt(year)
    });

    hobby.save( function(errSave, savedHobby) {
        if (errSave) {
            res.send({ result: false, message: errSave });
        } else {
            var savedId = savedHobby._id;
            console.log(savedId.toString());

            User.findById(userId, null, function(errFindById, docUser){
                if (errFindById) {
                    res.send({ result: false, message: errFindById });
                } else {
                    var hobbies = docUser.hobbies;
                    hobbies.push(savedHobby._id);
                    User.updateOne({ _id: userId }, { hobbies: hobbies }, function(errUpdateOne, result){
                        if (errUpdateOne) {
                            res.send({ result: false, message: errUpdateOne });
                        } else {
                            User.findById(userId).populate('hobbies').exec(function(errFindById2, populatedDoc){
                                if (errFindById2) {
                                    res.send({ result: false, message: errFindById2 });
                                } else {
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

/* Delete Hobby */
router.delete('/:userId', function(req, res, next){
    var userId = req.params.userId;
    var hobbyId = req.body.hobbyId;

    Hobby.deleteOne({ _id: hobbyId }, function(err){
        if (err) {
            res.send({ result: false, message: err });
        } else {
            User.findById(userId, null, function(errFindById, docUser){
                if (errFindById) {
                    res.send({ result: false, message: errFindById });
                } else {
                    var hobbyIds = docUser.hobbies; 
                    var newHobbies = [];
                    for(const hId of hobbyIds){
                        var hIdString = hId._id.toString();                   
                        if (hIdString !== hobbyId){
                            newHobbies.push(hId);
                        }
                    }                    
                    User.updateOne({ _id: userId }, { hobbies: newHobbies }, function(errUpdateOne, result){
                        if (errUpdateOne) {
                            res.send({ result: false, message: errUpdateOne });
                        } else {
                            User.findById(userId).populate('hobbies').exec(function(errFindById2, populatedDoc){
                                if (errFindById2) {
                                    res.send({ result: false, message: errFindById2 });
                                } else {
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
})

router.delete('/', function(req, res, next){
    Hobby.deleteMany({}, function(err){
        if (err) {
            res.send({ result: false, message: err });
        } else {
            res.send({ result: true, message: '' });
        }
    })
})


module.exports = router;