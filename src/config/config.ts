import { config } from 'dotenv'
config()

export default {
    jwtSecret: process.env.JWT_SECRET || 'Mysecrettoken',
    DB: {
        PORT: process.env.PORT,
        USER_NAME: process.env.USER_NAME,
        NAME_CLUSTER: process.env.NAME_CLUSTER,
        URL_MONGO_DEVELOPMENT: process.env.URL_MONGO_DEVELOPMENT,
        PASSWORD: process.env.PASSWORD,
        DBNAME: process.env.DBNAME,
        NODE_ENV: process.env.NODE_ENV
    }
}