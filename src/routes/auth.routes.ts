import { Router } from 'express'
const router = Router()

//Validaciones
import { showErrors, createValidationForRoute } from '../validations/validationsUserAuth'

/* Controladores */
import { signIn, signUp, signOut } from '../controllers/user.auth.controller'

/* 
    createValidationForRoute(...) se encarga de cargar todas las validaciones que tenga cada ruta,
    mandando como parámetro el nombre de la ruta, para que pueda reconocer en un mismo archivo que 
    tipo de funciones se van a encargra de evaluar
*/

router.route('/SignUp')
    .post(
        createValidationForRoute('SignUp'),
        showErrors,
        signUp
    )

router.route('/SignIn')
    .post(
        createValidationForRoute('SignIn'),
        showErrors,
        signIn
    )

router.route('/SignOut')
    .get(signOut)

export { router as UserRouter }