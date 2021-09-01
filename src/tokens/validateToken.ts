import jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express"
import config from '../config/config';

/*
    Las propiedaes pueden variar, esto depende de la cantidad de parámetros
    que se le pasen al momento de crear el token, excluyendo solo iat y exp, 
    que son datos que ya vienen con el payload del token
*/

interface IPayload {
    id: string,
    email: string, 
    iat: number,
    exp: number
}

/*
    La función para validar el token, recupera dicho datos desde los headers con 
    req.header('aut-token'), lo cual lo almacena para después
    evaluar si se está mandando, seguido de esto se almacea la información del payload
    que proviene de verificar un token existente. 

    **req.userId = payload.id**

    Para poder compartir el id del usuario en todas las rutas, se agrega una nueva propiedad
    al request, req.userId, a la cual se le da el valor del payload.id, de esta forma en todas
    las rutas se encontrara esta propiedad con valor accesible.

    **IMPORTANTE**
    Para poder agregar la propiedad userId a la interface Request se uso el concepto
    fusión de declaraciones, el cual consiste en extender una interface, en este caso 
    Request para que pueda soportar una propiedad personalizada.
    De este modo solo se crea dicho algoritmo y se agrega a la propiedad typeRoots del
    tsconfig.json, para que pueda ser operada desde culauiqer lugar que se llame.

*/

export const validateToken = (req: Request, res: Response, next:NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) 
        return res
          .status(403)
          .send({ message: "Access denied" });
      

    const token = authorization.split(" ")[1]

    try {
        const payload = jwt.verify(token, config.jwtSecret) as IPayload
        req.userId = payload.id

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }
    next()
}