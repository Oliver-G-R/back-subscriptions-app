import { requiredString, requiredNumber } from './types models/types';
import mongoose, { model } from 'mongoose'

import { ISubscriptions } from '../interfaces/modelsInterfaces'
const { Schema } = mongoose

const subscriptionSchema = new Schema<ISubscriptions>({
    name: requiredString,
    description: {
        type: String,
        trim: true
    },
    colorSubscription: requiredString,
    typeSubscription: requiredString,
    price: requiredNumber,
    every: requiredNumber,
    everyTime: {
        ...requiredString,
        default: 'days'
    },
    fristPayment: {
        type: Date,
        default: new Date(),
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,
})

subscriptionSchema.set('toJSON', {
    transform: (document, returnedObjet) => {
        returnedObjet.id = returnedObjet._id,
            delete returnedObjet._id
    }
})

export const Subscription = model<ISubscriptions>('Subscription', subscriptionSchema)
