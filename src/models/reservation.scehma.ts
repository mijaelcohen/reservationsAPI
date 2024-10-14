import { Schema, model, Types } from 'mongoose';

interface IReservation {
    date: Date,
    madeBy: String,
    store: String
    table: String
    diners: Array<String>
}

const ReservationsSchema = new Schema<IReservation>({
    date: { type: Date,  required: true },
    madeBy: {type: Types.ObjectId, ref: 'User',  required: true },
    store: {type: Types.ObjectId, ref: 'Store',  required: true },
    table: {type: Types.ObjectId, 
        required: true, 
        refPath: 'store.tables._id' },
    diners: [{type: Types.ObjectId, ref: 'User', required: true }],
});

const Reservations = model<IReservation>('Reservations', ReservationsSchema)

export { Reservations, IReservation }