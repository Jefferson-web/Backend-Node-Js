import { Schema, model, SchemaOptions } from 'mongoose';

const options: SchemaOptions = { collection: 'medicos' }

const medicoRoutes = new Schema({
    name: { type: String, required: true },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true }
}, options)

export default model('Medico', medicoRoutes);