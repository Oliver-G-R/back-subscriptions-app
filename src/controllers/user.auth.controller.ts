import { IUser } from './../interfaces/modelsInterfaces';
import { createToken } from './../tokens/createToken';
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { sendEmail } from '../helpers/email';
import crypto from 'crypto';

const signUp = async (req: Request, res: Response): Promise<Response> => {
    const {
        email,
        password,
    } = req.body as IUser

    if (!email || !password) return res.status(400).json({
        msg: "Please, send your email and password"
    })

    try {
        const newUser = new User(req.body)
        const saveUser = await newUser.save()

        /* Creando un token al registra el usuario */
        const token: string = createToken(saveUser)
        res.header('Authorization', `Bearer ${token} `)

        return res.status(201).json(saveUser)

    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "Failed to register user" })
    }
}

const signIn = async (req: Request, res: Response): Promise<Response> => {
    const {
        email,
        password
    } = req.body as IUser

    if (!email || !password) return res.status(400).json({
        msg: "Please, send your email and password"
    })

    try {
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({
            msg: "The user does not excist"
        })

        const isMatch: Boolean = await user.comparePassword(password)

        if (isMatch) {
            const token: string = createToken(user)

            res.header('Authorization', `Bearer ${token} `)

            return res.status(201).json(user)

        } else {
            return res.status(400).json({ msg: 'Email or password not excist' })

        }
    } catch (error) {
        return res.status(500).json({ msg: 'Internal Server Error. Please try again in a few moments. ' })
    }
}

const signOut = (req: Request, res: Response, next: NextFunction): void => {
    req.logOut()
}

const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (user) {
            const randomToken = user.createRandomToken()
            await user.save({ validateBeforeSave: false })

            const URL = `${req.protocol}://${req.get('host')}/User/ResetPassword/${randomToken}`

            const messsage = `Did you forget your password? click the link below to reset your password: ${URL}.\n
            If you do not want to reset your password, please ignore this email`

            try {
                await sendEmail({ email: user.email, subject: 'Reset your password', message: messsage })
                return res.status(200).json({ msg: 'Email sent' })
            } catch (error) {
                user.passwordResetToken = undefined
                user.passwordResetExpires = undefined
                await user.save({ validateBeforeSave: false })

                return res.status(400).json({ msg: error })
            }
        }

        return res.status(404).json({ msg: 'User not found' })

    } catch (error) {
        return res.status(500).json({
            msg: 'Internal Server Error. Please try again in a few moments. '
        })
    }
}

const resetPassword = async (req: Request, res: Response) => {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

    try {
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })

        if (!user) return res.status(400).json({ msg: 'Token is invalid or has expired' })

        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        const newToken: string = createToken(user)
        res.header('Authorization', `Bearer ${newToken} `)

        return res.status(200).json({ msg: 'Password updated' })

    } catch (error) {
        return res.status(500).json({ msg: 'Internal Server Error. Please try again in a few moments. ' })
    }
}

export {
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword
}
