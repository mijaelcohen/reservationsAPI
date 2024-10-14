import { Types } from 'mongoose';
import { IStore, Stores } from '../models/store.schema';
import { IUser } from '../models/user.schema';
import { Reservations } from '../models/reservation.scehma';
import moment from 'moment';

class StoreService {
    constructor(){}

    get(id?: String) {
        if(id){
            return Stores.findById(id)
        }else{
            return Stores.find()
        }
        
    }
    
    create (store: IStore) {
        const newStore = new Stores({
            _id: new Types.ObjectId(),
            ...store
        });
        return newStore.save();
    };

    delete (id: string) {
        return Stores.deleteOne({_id: id})
    }

    async storeHasTableForDate(storeId: string, diners: number ,date: Date) : Promise<boolean>{

        const store = await Stores.findById(storeId);

        if(!store){
            throw new Error("Store not found");
        }

        const reservedTables = await Reservations.find({
            date: {
              $gte: date,
              $lt: moment(date).add(2, 'hours').toDate()
            },
            store: storeId
        }).select('table store');
        
        const reservedTableIds = reservedTables.map(reservation => reservation.table.toString());

        const availableTables = store.tables.filter(table =>{
            // Tables not reserved and with capacity
            return !reservedTableIds.includes(table._id.toString()) && 
            table.capacity >= diners
        });
        
        return availableTables.length > 0 ? true : false;


    }

    async getAvailableStoresTables(preferences: string[], diners: number, date: Date) {
        
        const stores = await Stores.find({
            ...(preferences.length > 0 && { preferences: { $in: preferences } }),  // Filter by preference
            'tables.capacity': { $gte: diners }  // Tables with capacity
        });
        
        if (!stores || stores.length === 0) {
            throw new Error("No stores with matching preferences and table capacity");
        }

        const reservedTables = await Reservations.find({
            //search reservations in that date (+2hs) and selected stores
            date: {
              $gte: date,
              $lt: moment(date).add(2, 'hours').toDate()
            },
            store: { $in: stores.map(store => store._id) }
          }).select('table store');
      
        const reservedTableIds = reservedTables.map(reservation => reservation.table.toString());
    
        const availableStores = stores.map(store => {
            const availableTables = store.tables.filter(table =>{
                // Tables not reserved and with capacity
                return !reservedTableIds.includes(table._id.toString()) && 
                table.capacity >= diners
            });
        
            return availableTables.length > 0 ? store : null;
        }).filter(store => store !== null);  // Filter out stores with no available tables
        
        return availableStores;
    }

}

const storeService = new StoreService() 
export default storeService