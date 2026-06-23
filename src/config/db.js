const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🚀 KillerCore DB conectada exitosamente a MongoDB Atlas');
      } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        process.exit(1); // <-- Para que el script se detenga en caso de error
      }
};

module.exports = connectDB;