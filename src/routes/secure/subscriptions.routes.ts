import { Router } from 'express'

const router = Router()
import { validateToken } from '../../tokens/validateToken';

//controladores
import { 
    createSubscription, 
    deleteSubscription,
    getAllSubscriptions, 
    getSubscriptionById, 
    updateSubscription 
} from '../../controllers/subscriptions.controller';

router.route('/')
    .post(validateToken, createSubscription)
    .get(validateToken, getAllSubscriptions)

router.route('/:id')
    .delete(validateToken, deleteSubscription)
    .put(validateToken, updateSubscription)
    .get(validateToken, getSubscriptionById)

export { router as subscriptionsRoutes }