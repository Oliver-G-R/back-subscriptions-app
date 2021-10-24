import { User } from '../models/User'
import { Request, Response } from 'express'
import { Subscription } from '../models/Subscriptions';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error. Please try again in a few moments. '
        })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    const { id = '0' } = req.params
    const checkId: RegExpMatchArray | null = id.match(/^[0-9a-fA-F]{24}$/)

    try {
        if (checkId) {
            const user = await User.findById(id)
            if (user) {
                return res.status(200).json(user)
            } else {
                return res.status(404).json({ msg: 'User not found' })
            }
        }
        return res.status(400).json({ msg: 'Id does not match' })

    } catch (error) {
        return res.status(404).send('User not found')
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const id = req.userId
    try {
        const user = await User.findByIdAndDelete(id)
        const deleSubs = await Subscription.deleteMany({ user: id })

        return user && deleSubs
            ? res.status(200).json({ msg: 'User deleted' })
            : res.status(404).json({ msg: 'User not deleted' })

    }
    catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error. Please try again in a few moments. '
        })
    }
}

export const updateEmail = async (req: Request, res: Response): Promise<Response> => {
    const id = req.userId
    const { email } = req.body

    try {
        const user = await User.findByIdAndUpdate(id, { email }, { new: true })
        return res.status(200).json({ user })

    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error. Please try again in a few moments. '
        })
    }
}

export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
    const id = req.userId
    const { currentPassword, password } = req.body

    try {
        const user = await User.findById(id)
        if (user) {
            const isMatch = await user.comparePassword(currentPassword)
            if (isMatch) {
                const newPassword = await user.encryptPassword(password)
                await User.findByIdAndUpdate(id, { password: newPassword }, { new: true })
                return res.status(200).json({ msg: 'Password updated' })
            }
            return res.status(400).json({ msg: 'Password does not match' })
        }
        return res.status(404).json({ msg: 'User not found' })

    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error. Please try again in a few moments. '
        })
    }
}