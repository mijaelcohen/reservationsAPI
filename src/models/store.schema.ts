import { Schema, model, Types } from 'mongoose';

interface IStore {
    name: string
    preferences: Array<Schema.Types.ObjectId>
    tables: [{
        capacity: number
        name: string
        _id : Types.ObjectId
    }]
    reservations: Array<Schema.Types.ObjectId>
}

const StoreSchema = new Schema<IStore>({
    name: { type: String },
    preferences: [{type: Schema.Types.ObjectId, ref: 'UserPreferences'}],
    reservations: [{type: Schema.Types.ObjectId, ref: 'Reservations'}],
    tables: [{
        capacity: { type: Number },
        name: { type: String },
        _id : { type: Schema.Types.ObjectId },
    }]
    
    // Dont need more than this for this exercise
});

const Stores = model<IStore>('Store', StoreSchema);

export { Stores, IStore }