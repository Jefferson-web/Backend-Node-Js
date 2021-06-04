import { Schema, model, SchemaOptions } from 'mongoose';

const options: SchemaOptions = { collection: 'hospitals' }

const hospitalSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, options)

export default model('Hospital', hospitalSchema);