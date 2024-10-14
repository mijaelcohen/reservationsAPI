import {  Types } from 'mongoose';
import { Reservations, IReservation } from '../models/reservation.scehma';
import { Request } from 'express';
import moment from 'moment';
import StoreService from './stores.service';

export interface ReservationsQuery {
    _id?: string
    madeBy?: string
    store?: string
}

class ReservationsService {

    constructor(){}

    get (query: ReservationsQuery) {
        const { _id } = query;
        if(_id){
            Reservations.findById(_id)
        }
        return Reservations.find({...query});
    };

    async create (reservation: IReservation) {
        const ocupied = await this.usersHasReservationForDate(reservation)
        if(ocupied){
            throw new Error('User has a reservation too close to that date')
        }
        const { store, diners, date } = reservation;

        const storeHasRoom = await StoreService.storeHasTableForDate(store as string, diners.length+1, date);

        if(!storeHasRoom){
            throw new Error('Store has no available tables for that date')
        }
        const newReservation = new Reservations({
            _id: new Types.ObjectId(),
            ...reservation
        });
        return newReservation.save();
    };

    async usersHasReservationForDate (reservation: IReservation) {
        const { madeBy, diners , date } = reservation
        const previusReservations = await Reservations.find({
            madeBy: {
                $in: [madeBy, ...diners]
            },
            diners: {
                $in: [madeBy, ...diners]
            },
            date: {
                $gte: date,
                $lte: moment(date).add(2, 'hours').toDate()
            }
        });
        
        return previusReservations.length > 0;

    }
    
    delete (id: string) {
        return Reservations.deleteOne({_id: id})
    }
}

const reservationService = new ReservationsService() 
export default reservationService;