import { Document } from "mongoose";

export interface IUser extends Document {
    email: string
    password: string
    name: string
    lastName: string
    comparePassword: (password: string) => Promise<Boolean>
    encryptPassword: (password: string) => Promise<string>
}

export interface ISubscriptions {
    name: string,
    description: string,
    colorSubscription: string,
    typeSubscription: string,
    price: number,
    every: number,
    everyTime: string,
    fristPayment: Date
    user: string
}