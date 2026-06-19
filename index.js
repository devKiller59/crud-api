// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose'); // <-- Importamos Mongoose para conectar con MongoDB

const app = express();
const PORT = process.env.PORT || 5000;
const FILE_PATH = path.join(__dirname, 'users.json');

// MIDDLEWARES
app.use(cors()); // <-- ¡Esto soluciona el error de CORS permanentemente en local!
app.use(express.json()); // Permite a Express entender JSON en el cuerpo de las peticiones

const MONGO_URI = process.env.MONGO_URI; // Usamos la variable de entorno para la URI de MongoDB

// Conectar a MongoDB usando Mongoose
mongoose.connect(MONGO_URI)
    .then(() => console.log('¡Conectado exitosamente a MongoDB Atlas!'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema y modelo de usuario (aunque no lo usaremos en este ejemplo, es para futuras mejoras)
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: true }
}, { 
  timestamps: true // <-- Para que Mongoose crea las fechas de creación y actualización automáticamente
});

const User = mongoose.model('User', userSchema);

// --- RUTAS DEL CRUD ---

// 1. OBTENER TODOS LOS USUARIOS (GET)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer los usuarios' });
    }
});

// 2. CREAR UN USUARIO (POST)
app.post('/users', async (req, res) => {
    try {
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            birthday: req.body.birthday
        });
        await newUser.save(); // Guarda el nuevo usuario en MongoDB
        res.status(201).json({ message: 'Usuario creado correctamente', newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el usuario' });
    }
});

// 3. ELIMINAR UN USUARIO (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id); // Elimina el usuario de MongoDB
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

// 4. ACTUALIZAR UN USUARIO (PUT)
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true }); // Actualiza el usuario en MongoDB
        res.json({ message: 'Usuario actualizado correctamente', userUpdated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

// Encender el servidor
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});