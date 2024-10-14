import { Schema, model } from 'mongoose';

interface IUser {
    name: String,
    preferences: Array<String>,
}

const UserSchema = new Schema<IUser>({
    name: { type: String },
    preferences: [{type: Schema.Types.ObjectId, ref: 'UserPreferences'}],
    // Dont need more than this for this exercise
});

const Users = model<IUser>('User', UserSchema);

export { Users, IUser }