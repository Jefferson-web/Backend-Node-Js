import mongoose, { ConnectOptions } from 'mongoose';

export default function connectDB() {
    const options: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };
    mongoose.connect(String(process.env.MONGO_URI), options)
        .then(() => {
            console.log('Database connected');
        })
        .catch(() => {
            console.log('An error ocurred with the database');
        });
}
