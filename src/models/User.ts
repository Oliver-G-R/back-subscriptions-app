import mongoose from 'mongoose'
const { Schema , model } = mongoose
import bcrypt  from 'bcrypt'

import { IUser } from './../interfaces/modelsInterfaces';
import { requiredString } from './types models/types';

const UserSchema = new Schema<IUser>({
    name: requiredString,
    lastName: requiredString,
    email: {
        ...requiredString,
        lowercase: true, 
        unique: true,
        trim: true
    },
    password: requiredString,
}, {
    versionKey: false,
    timestamps: true,
})

/* 
    Antes de guardar la contraseña se hace un hash de la misma para después cambiar esa contraseña por la que ya está encriptada. 
*/

UserSchema.pre<IUser>('save', async function(next) {
    const user = this
    if (!user.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
    next()
})

/*
    Comprueba si la contraseña guardada coincide con la que manda el usuario
*/

UserSchema.methods.comparePassword = async function (password:string): Promise<Boolean> {
    return await bcrypt.compare(password, this.password)
}

/* 
    Se retornan las propiedades del schema y otras se eliminan 
*/
UserSchema.set('toJSON', {
    transform: (document, returnedObjet) => {
        returnedObjet.id = returnedObjet._id,
            delete returnedObjet._id
            delete returnedObjet.__v
            delete returnedObjet.password
    }
})

export const User = model<IUser>('User', UserSchema)