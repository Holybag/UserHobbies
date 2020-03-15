import * as mongoose from 'mongoose';

export interface IHobby extends mongoose.Document {
    id: mongoose.Schema.Types.ObjectId,
    passionLevel : String,
    name: String,
    year : Number
}

const hobbySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    passionLevel : String,
    name: String,
    year : Number
});

export const Hobby = mongoose.model<IHobby>('Hobby', hobbySchema);