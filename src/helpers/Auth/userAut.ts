import { User } from './../../models/User';

type Iroute = 'SignIn' | 'SignUp'

//Valida si el correo ya está en uso y si está registrado
const validateEqualEmail = async (email:string, route:Iroute):Promise<boolean> => {
    try {
        const user = await User.findOne({email: email.toLowerCase()})

        if (!user && route === 'SignIn')  return Promise.reject('This user is not registered')
        if (user && route === 'SignUp')  return Promise.reject('You cannot register this user')
    
        return true

    } catch (error) {
        return Promise.reject('Error in the server')
    }
}

export {
    validateEqualEmail
}