import { Request, Response, Router } from 'express';
import  ReservationService, { ReservationsQuery }  from '../services/reservations.service';
import { newReservationValidator } from '../middlewares/reservation.middleware';

let router: Router = Router();

const getReservations = async (res: Response, query: ReservationsQuery) => {
    try{
        const reservations = await ReservationService.get({...query});
        res.send(reservations)
    }catch(error){
        res.status(500).send(error)
    }
};

router.get('/', async (req: Request, res: Response) => {
    try{
        const reservations = await ReservationService.get({});
        res.send(reservations)
    }catch(error){
        res.status(500).send(error)
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    getReservations(res, {_id: id})
});

// Get reservations by user
router.get('/user/:userID', async (req: Request, res: Response) => {
    const madeBy = req.params.userID;
    getReservations(res, { madeBy });
    
})

// Get reservations by store
router.get('/store/:storeID', async (req: Request, res: Response) => {
    const store = req.params.storeID
    getReservations(res, { store });
    
});

router.post('/', newReservationValidator ,async (req: Request, res: Response) => {
    const reservation = req.body;
    try{
        reservation.date = new Date(reservation.date)
        await ReservationService.create(reservation);
        res.status(201).send();
    }catch(error:unknown){
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await ReservationService.delete(id)
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
});
/*
this can be a little to complex for this excercise
router.put('/:id', (req: Request, res: Response) => {

})
*/


export default router;