var mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    passionLevel : String,
    name: String,
    year : Number
});

export = mongoose.model('Hobby', hobbySchema, 'hobbies');