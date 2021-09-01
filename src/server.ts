import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import passport from 'passport'
import passportMiddleware from './middlewares/pasport'

//Import routes
import { UserRouter } from './routes/auth.routes'
import { subscriptionsRoutes } from './routes/secure/subscriptions.routes'

//Iniciando express
const app = express()

//Establece un puerto 
app.set('port', process.env.PORT || 3000)

//Usando middlewares
app.use(morgan('dev'))
app.use(cors({exposedHeaders: 'Authorization'}))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
passport.use(passportMiddleware)

//Usando rutas
app.get('/', (req, res) => {
    return res.send(`App is running on the port ${app.get('port')}`)
})

app.use('/User', UserRouter)

/* Rutas protegidas */
app.use('/subscriptions', subscriptionsRoutes)

export default app 