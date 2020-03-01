var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server=require('../app');
var should = chai.should();

chai.use(chaiHttp);

var userId;
var hobbyId;

describe('UserHobbies', function(){
    describe ('DELETE ALL Users', function(){
        it('Should remove all first', (done)=>{
            console.log('Delete all users in db.');
            chai.request(server)
                .delete("/users/")
                .send({})
                .end((err, res)=>{
                    res.should.have.status(200);
                    console.log('Response Body:', res.body)                    
                    done();
                });            
        })
    })
    
    describe('User CRUD OPERATIONS', function(){
        
        it('Should add User1 in DB', (done)=>{
            
            chai.request(server)
            .post('/users/')
            .send({name: 'Mike'})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                done();
            });            
            
        })

        it('Should add User2 in DB', (done)=>{
            
            chai.request(server)
            .post('/users/')
            .send({name: 'John'})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                done();
            });            
            
        })

        it('Should add User2 in DB', (done)=>{
            
            chai.request(server)
            .post('/users/')
            .send({name: 'Hans'})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                done();
            });            
            
        })

        
        it('Should Fecth all the Users', (done)=>{
            chai.request(server)
                .get("/users/")
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);                    
                    console.log ("Body length:", result.body.length);
                    userId = result.body[0]._id;
                    done()
                })
        })

        it('Should Update Paticular User only', (done)=>{            
            chai.request(server)
                .put("/users/"+userId)
                .send({ name: 'Jack' })
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Updated Paticular User using /PUT/users/:userId", result.body);
                    
                    done()
                })
        })

        it('Should check data updated in db', (done)=>{
            
            chai.request(server)
                .get('/users/'+userId)
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Fetched Paticular User using /GET/users/:userId");
                    console.log ("Result: ", result.body);
                    
                    done();
                })
        })

        it('Should delete Paticular User only', (done)=>{
            
            chai.request(server)
                .delete('/users/'+userId)
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Delete Paticular User using /DELETE/users/:userId");
                    console.log ("Result: ", result.body);
                    
                    done();
                })
        })

        it('Should check left the Users', (done)=>{
            chai.request(server)
                .get("/users/")
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);                    
                    console.log ("Body length:", result.body.length);
                    done()
                })
        })

        it('Should delete all User', (done)=>{
            
            chai.request(server)
                .delete('/users/')
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Delete all User using /DELETE/users/");
                    console.log ("Result: ", result.body);                    
                    done();
                })
        })

        it('Should check left Users', (done)=>{
            chai.request(server)
                .get("/users/")
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);                    
                    console.log ("Body length:", result.body.length);
                    done()
                })
        })

    })

    describe ('DELETE ALL Hobbies', function(){
        it('Should remove all first', (done)=>{
            console.log('Delete all hobbies in db.');
            chai.request(server)
                .delete("/hobbies/")
                .send({})
                .end((err, res)=>{
                    res.should.have.status(200);
                    console.log('Response Body:', res.body)                    
                    done();
                });            
        })
    })

    describe('Hobbies CRUD OPERATIONS', function(){
        
        it('Should add User in DB for Hobby', (done)=>{
            
            chai.request(server)
            .post('/users/')
            .send({name: 'Mike'})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                done();
            });            
            
        })

        it('Should check the Users', (done)=>{
            chai.request(server)
                .get("/users/")
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);                    
                    console.log ("Body length:", result.body.length);
                    userId = result.body[0]._id;
                    done()
                })
        })

        it('Should add Hobby1 in DB', (done)=>{
            
            chai.request(server)
            .post('/hobbies/')
            .send({passionLevel: 'High', name: 'Reading', year: 5, userId: userId})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                hobbyId = res.body.hobbies[0]._id;
                console.log('hobbyId:', hobbyId);
                done();
            });            
            
        })

        it('Should add Hobby2 in DB', (done)=>{
            
            chai.request(server)
            .post('/hobbies/')
            .send({passionLevel: 'Low', name: 'Ski', year: 1, userId: userId})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                done();
            });            
            
        })

        it('Should add Hobby3 in DB', (done)=>{
            
            chai.request(server)
            .post('/hobbies/')
            .send({passionLevel: 'Medium', name: 'Swimming', year: 7, userId: userId})
            .end((err, res) => {
                res.should.have.status(200);
                console.log('Response Body:', res.body);
                done();
            });            
            
        })
        
        it('Should Fecth all Hobbies', (done)=>{
            chai.request(server)
                .get("/hobbies/")
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);                    
                    console.log ("Body length:", result.body.length);                    
                    done()
                })
        })

        it('Should Update Paticular Hobby only', (done)=>{            
            chai.request(server)
                .put("/hobbies/"+hobbyId)
                .send({passionLevel: 'Medium', name: 'Reading', year: 2})
                .end((err, result)=>{
                    result.should.have.status(200);
                    console.log ("Updated Paticular Hobby using /PUT/hobbies/:hobbyId", result.body);
                    
                    done()
                })
        })

        it('Should check data updated in db', (done)=>{
            
            chai.request(server)
                .get('/hobbies/'+hobbyId)
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Fetched Paticular Hobby using /GET/hobbies/:hobbyId");
                    console.log ("Result: ", result.body);
                    
                    done();
                })
        })

        it('Should delete Paticular Hobby only', (done)=>{
            
            chai.request(server)
                .delete('/hobbies/')
                .send({userId: userId, hobbyId: hobbyId})
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Delete Paticular HobbyId by userId and hobbyId using /DELETE/hobbies/");
                    console.log ("Result: ", result.body);
                    
                    done();
                })
        })

       it('Should delete all Hobbies', (done)=>{
            
            chai.request(server)
                .delete('/hobbies/')
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Delete all Hobbies using /DELETE/hobbies/");
                    console.log ("Result: ", result.body);                    
                    done();
                })
        })

        it('Should check left Hobbies', (done)=>{
            chai.request(server)
                .get("/hobbies/")
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);                    
                    console.log ("Body length:", result.body.length);
                    done()
                })
        })

    })
})