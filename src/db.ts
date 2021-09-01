import mongoose, { ConnectOptions } from 'mongoose'
import configDatabase from './config/config'

const {
    USER_NAME,
    PASSWORD,
    DBNAME,
    NAME_CLUSTER,
    URL_MONGO_DEVELOPMENT = "mongodb://localhost/subscriptionsGeek",
    NODE_ENV = "development"
} = configDatabase.DB

//url de producción
const URL_MONGO_PRODUCTION = `mongodb+srv://${USER_NAME}:${PASSWORD}@${NAME_CLUSTER}.bqot5.mongodb.net/${DBNAME}?retryWrites=true&w=majority`

//tipo de conexión 
const connectionUrl:string = NODE_ENV 
    === 'development' ? URL_MONGO_DEVELOPMENT
    : URL_MONGO_PRODUCTION


const connection = mongoose.connection
const connectionOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

mongoose.connect(connectionUrl, connectionOptions)

connection.once('open', () => {
    console.log('mongodb is connected')
})

connection.on('error', err => {
    console.error(err)
    process.exit(0)
})