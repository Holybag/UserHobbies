var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby' }]
});

export = mongoose.model('User', userSchema, 'users');