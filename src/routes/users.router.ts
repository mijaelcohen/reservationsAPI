import { Request, Response, Router } from 'express';
import UserService from '../services/users.service';

let router: Router = Router();

const getUsers = async (req: Request, res: Response, query: Object) => {
    try {
        const users = await UserService.get({...query});
        res.send(users)
    }catch(error){
        res.status(500).send()
    }
}

router.get('/', async (req: Request, res: Response) => {
    getUsers(req, res, {})
})

router.get('/:id', (req: Request, res: Response) => {
    const _id = req.params.id
    getUsers(req, res, { _id })
})

router.post('/', async (req: Request, res: Response) => {
    const user = req.body;
    try{
        await UserService.create(user);
        res.send({})
    }catch(error){
        res.status(500).send()
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await UserService.delete(id);
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

router.put('/:id', (req: Request, res: Response) => {
    res.send()
})

export default router