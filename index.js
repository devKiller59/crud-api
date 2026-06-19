const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const FILE_PATH = path.join(__dirname, 'users.json');

// MIDDLEWARES
app.use(cors()); // <-- ¡Esto soluciona el error de CORS permanentemente en local!
app.use(express.json()); // Permite a Express entender JSON en el cuerpo de las peticiones

// Función auxiliar para leer usuarios
const readUsers = () => {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
};

// Función auxiliar para escribir usuarios
const writeUsers = (users) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
};

// --- RUTAS DEL CRUD ---

// 1. OBTENER TODOS LOS USUARIOS (GET)
app.get('/users', (req, res) => {
    try {
        const users = readUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer los usuarios' });
    }
});

// 2. CREAR UN USUARIO (POST)
app.post('/users', (req, res) => {
    try {
        const users = readUsers();
        const newUser = {
            id: Date.now(), // ID único basado en el tiempo
            name: req.body.name,
            email: req.body.email
        };
        
        users.push(newUser);
        writeUsers(users);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el usuario' });
    }
});

// 3. ELIMINAR UN USUARIO (DELETE)
app.delete('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        let users = readUsers();
        
        // Filtramos para eliminar el usuario con el ID correspondiente
        users = users.filter(user => user.id !== parseInt(id));
        writeUsers(users);
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

// Encender el servidor
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});