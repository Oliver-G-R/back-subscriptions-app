import { IUser } from './../interfaces/modelsInterfaces';
import jwt from 'jsonwebtoken'
import configJWT from '../config/config'

export const createToken = (user:IUser):string => {
    const {
        email,
        id,
    } = user
    
    return jwt.sign({id, email}, configJWT.jwtSecret, {
        expiresIn: '24h'
    })
}