import {  Types } from 'mongoose';
import { IUser, Users } from '../models/user.schema';

class UserService {
    constructor(){}

    get (query: Object) {
        return Users.find({
            ...query
        });
    };
    
    create (user: IUser) {
        const newStore = new Users({
            _id: new Types.ObjectId(),
            ...user
        });
        return newStore.save();
    };

    delete (id: string) {
        return Users.deleteOne({_id: id})
    }

}

const userService = new UserService() 
export default userService;