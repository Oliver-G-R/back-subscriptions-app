import { validateEqualEmail } from '../helpers/Auth/userAut'
import { check, ValidationChain, validationResult} from 'express-validator'
import { NextFunction, Request, Response } from 'express'

//Rutas que solo se pueden leer en este archivo para mandar las respectivas funciones de validación
type TRoute = 'SignIn' | 'SignUp'

//Array con las validaciones
const validateSignIn:ValidationChain[] = [
    check('email')
        .custom(email => validateEqualEmail(email, 'SignIn'))
]

const validateSignUp:ValidationChain[] = [
    check('email')
        .custom(email => validateEqualEmail(email, 'SignUp'))
        .isLength({ min: 3, max: 34 })
        .withMessage('The maximum is 34 characters and the minimum 3')
        .trim()
        .matches(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        )
        .withMessage('That is not a valid email'),
    
    check('password')
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('Must contain a number')

]

//Los errores se muestran en un array dando un código de error
const showErrors = (req:Request, res:Response, next:NextFunction) => {
    const error = validationResult(req).formatWith(({ msg }) => msg)
    const hasError = !error.isEmpty()

    hasError ? res.status(422).json({ error: error.array() })
        : next()

}

//Se agregan los arrays con las funciones de validación segun sea el nombre de la ruta que se mande
const createValidationForRoute = (route:TRoute):ValidationChain[] => {
    const routeOptions = {
        SignIn: validateSignIn,
        SignUp: validateSignUp,
    }

    return routeOptions[route]
}

export {
    createValidationForRoute,
    showErrors
}