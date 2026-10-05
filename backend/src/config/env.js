import 'dotenv/config'

export const config = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    corsOrigin: process.env.CORS_ORIGIN,
}