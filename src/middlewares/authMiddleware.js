const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Verificar si el token está presente en la cabecera de la petición "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token de la cabecera
      token = req.headers.authorization.split(' ')[1];

      // Decodificar y verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- ¡Importante! Verificar el token con la clave secreta

      // Agregar el usuario a la petición (req.user) sin la contraseña
      req.user = await User.findById(decoded.id).select('-password'); // Excluir contraseña por seguridad

      if (!req.user) {
          return res.status(401).json({ message: 'No autorizado, token no válido' });
      }

      return next(); // Pasar al siguiente middleware
      } catch (error) {
          return res.status(401).json({ message: 'No autorizado, token no válido' });
      }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, token no presente' });
    }
  }
};

module.exports = {protect};