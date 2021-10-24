import { ISubscriptions } from './../interfaces/modelsInterfaces';
import { Response, Request } from "express";
import { Subscription } from '../models/Subscriptions';
import { User } from '../models/User';

const createSubscription = async (req: Request, res: Response): Promise<Response> => {
    const { name, price, typeSubscription } = req.body as ISubscriptions

    if (!name || !price || !typeSubscription)
        return res.status(400).json({ msg: 'Check that the fields should not be empty' })

    try {
        /* Recuperamos el userId desde req.UserId y hacemos la busqueda para verificar que el usuario si este registrado en la base de datos */

        const userId: string = req.userId
        const userById = await User.findById(userId)

        if (!userById) return res.status(400).json({ msg: 'User not found' })

        /* Pasamos el userId al guardar la nueva suscripción */
        const newSubscription = new Subscription({ ...req.body, user: userId })

        const savedSubscription = await newSubscription.save()

        if (savedSubscription) {
            const subDb = await Subscription.findById(savedSubscription.id)
            return res.status(201).json(subDb)
        } else {
            return res.status(400).json({ msg: 'Subscription creation error' })
        }

    } catch (error) {
        return res.status(400).json({ msg: 'Error in the server, place verify in few moments' })
    }
}

const deleteSubscription = async (req: Request, res: Response): Promise<Response> => {
    const { id = '0' } = req.params

    try {
        const deleteSubscription = await Subscription.findByIdAndDelete(id)

        return deleteSubscription === null
            ? res.status(400).json({ msg: 'Subscription could not be removed' })
            : res.status(200).json({ msg: `${deleteSubscription.name} subscription has been removed` })

    } catch (error) {
        return res.status(400).json({ msg: 'Error in the server, place verify in few moments' })
    }
}

const updateSubscription = async (req: Request, res: Response): Promise<Response> => {
    const { id = '0' } = req.params
    const checkId: RegExpMatchArray | null = id.match(/^[0-9a-fA-F]{24}$/)

    try {
        if (checkId) {
            const updateS = await Subscription.findByIdAndUpdate(id, req.body)
            return updateS === null
                ? res.status(400).json({ msg: 'Subscription could not be updated' })
                : res.status(200).json({ msg: "Subscription updated" })
        } else {
            return res.status(200).json({ msg: 'Id does not match' })
        }

    } catch (error) {
        return res.status(400).json({ msg: 'Error in the server, place verify in few moments' })

    }
}

const getAllSubscriptions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId: string = req.userId
        const allSubscription = await Subscription.find({ user: userId })
        return res.status(200).json(allSubscription)
    } catch (error) {
        return res.status(400).json({ msg: 'Error in the server, place verify in few moments' })
    }
}

const getSubscriptionById = async (req: Request, res: Response): Promise<Response> => {
    const { id = '0' } = req.params
    const checkId: RegExpMatchArray | null = id.match(/^[0-9a-fA-F]{24}$/)
    try {
        if (checkId) {
            const subscriptionById = await Subscription.findById(id)

            return subscriptionById === null
                ? res.status(404).json({ msg: 'Subscription not found' })
                : res.status(200).json(subscriptionById)
        } else {
            return res.status(200).json({ msg: 'Id does not match' })

        }

    } catch (error) {
        return res.status(400).json({ msg: 'Error in the server, place verify in few moments' })
    }
}

export {
    createSubscription,
    deleteSubscription,
    updateSubscription,
    getAllSubscriptions,
    getSubscriptionById
}