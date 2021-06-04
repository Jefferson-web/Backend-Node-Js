import mongoose, { model, SchemaOptions } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const options: SchemaOptions = { collection: 'users' };

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const userRoutes = new mongoose.Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    rol: { type: String, required: [true, 'El rol es necesario'], default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }
}, options);

userRoutes.plugin(uniqueValidator, { message: 'Error, se espera que el {PATH} sea único.' });

export default model('User', userRoutes);