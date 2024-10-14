import { Request, Response, Router } from 'express';
import StoreService from '../services/stores.service';
import { availableStoreValidator, availableTableValidator } from '../middlewares/store.middlewares';

let router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const stores = await StoreService.get();
        res.send(stores)
    }catch(error){
        res.status(400).send(error)
    }
})

// Preference search is better than a User driven search, this way you can have anon users,
// Front end can decide in wich context to use this
router.get('/find-available', availableStoreValidator, async (req: Request, res: Response) => {
    const { preferences, diners, date } = req.query;
    try {
        const stores = await StoreService.getAvailableStoresTables(
            preferences as [],
            Number(diners),
            new Date(date as string));
        if (!stores || stores.length === 0) {
            res.status(404).json({ message: 'No stores with matching preferences and table capacity' });
        } else {
            res.status(200).json(stores);
        }
    }catch(error){
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
});


router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stores = await StoreService.get(id);
        res.send(stores)
    }catch(error){
        res.status(400).send()
    }
})

router.post('/', async (req: Request, res: Response) => {
    const store = req.body;
    try{
        await StoreService.create(store);
        res.send()
    }catch(error){
        res.status(400).send()
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await StoreService.delete(id);
        res.send()
    }catch(error){
        res.status(400).send()
    }
})

/*
router.put('/:id', (req: Request, res: Response) => {
    res.send()
})
*/
export default router