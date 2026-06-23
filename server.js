require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`⚡ KillerCore API corriendo en http://localhost:${PORT}`);
    });
};

startServer();