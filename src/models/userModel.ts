import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby' }]
}

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby' }]
});

export const User = mongoose.model<IUser>('User', userSchema);