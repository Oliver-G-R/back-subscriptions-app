import { IUser } from './../interfaces/modelsInterfaces';
import { createToken } from './../tokens/createToken';
import  {Request, Response, NextFunction} from 'express'
import { User } from '../models/User'

const signUp = async (req:Request, res:Response):Promise<Response> => {
    const {
        email,
        password,
    } = req.body as IUser

    if(!email || !password) return res.status(400).json({
        msg: "Please, send your email and password"
    })

    try {
        const newUser = new User(req.body)
        const saveUser = await newUser.save()

        /* Creando un token al registra el usuario */
        const token:string = createToken(saveUser)
        res.header('Authorization', `Bearer ${token} `)

        return res.status(201).json(saveUser)

    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: "Failed to register user"})
    }
}

const signIn = async (req:Request, res:Response):Promise<Response> => {
    const {
        email,
        password
    } = req.body as IUser

    if(!email || !password) return res.status(400).json({
        msg: "Please, send your email and password"
    })
    
   try {
        const user = await User.findOne({email})

        if (!user) return res.status(400).json({
            msg: "The user does not excist"
        })
    
        const isMatch:Boolean = await user.comparePassword(password)
    
        if(isMatch){
            const token:string = createToken(user)

            res.header('Authorization', `Bearer ${token} `)

            return res.status(201).json(user)

        } else{
            return res.status(400).json({msg: 'Email or password not excist'})
    
        }
   } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error. Please try again in a few moments. '})
   }
}

const signOut = (req:Request, res:Response, next:NextFunction):void => {
    req.logOut()
}

export {
    signUp,
    signIn,
    signOut
}
