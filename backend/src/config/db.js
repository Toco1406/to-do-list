import mongoose from 'mongoose'

export async function connectDb(uri) {
    await mongoose.connect(uri)
}

export async function disconnectDb() {
    await mongoose.disconnect();
}