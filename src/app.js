const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './public'))); // Servir archivos estáticos

// Ruta base informativa del ecosistema de la API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// Enlazar las rutas a las funciones
app.use('/api/users', usersRoutes);

module.exports = app;