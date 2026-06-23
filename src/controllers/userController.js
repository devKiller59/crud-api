const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Función auxiliar para generar el Token de Identidad Unificada
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // El token expira en 7 días
    );
};

// 1. REGISTRO DE USUARIO (POST)
const registerUser = async (req, res, next) => {
    try {
        const { first_name, last_name, username, email, password, birthday } = req.body;

        // Verificar si el email o username ya existen
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'El correo electrónico ya está registrado' });

        const usernameExists = await User.findOne({ username });
        if (usernameExists) return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });

        // Crear usuario (el hook del modelo se encargará de encripter la contraseña)
        const newUser = new User({ first_name, last_name, username, email, password, birthday });
        await newUser.save();

        // Generar token para que entre logueado automáticamente al registrarse
        const token = generateToken(newUser);

        res.status(201).json({
            message: '🚀 Usuario registrado con éxito en KillerCore',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor durante el registro', error: error.message });
    }
};

// 2. INICIO DE SESIÓN (LOGIN)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por correo electrónico
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Credenciales inválidas (Correo no encontrado)' });

        // Verificar si el usuario está activo en el ecosistema de devKiller59
        if (!user.isActive) return res.status(403).json({ message: 'Esta cuenta ha sido suspendida globalmente' });

        // Comparar contraseña encriptada usando el método que creamos en el modelo
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas (Contraseña incorrecta)' });

        // Si todo está bien, otorgar el Token
        const token = generateToken(user);

        res.status(200).json({
            message: `¡Bienvenido de vuelta, ${user.first_name}!`,
            token,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor durante el login', error: error.message });
    }
};

// 3. OBTENER PERFIL (GET) (Ruta Protegida de ejemplo)
const getUserProfile = async (req, res) => {
    try {
        // req.user vendrá inyectado desde el middleware de autenticación que crearemos abajo
        if (!req.user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({
            message: 'Perfil de usuario obtenido correctamente',
            user: {
                id: req.user.id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        }
        );
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
};

// 4. ACTUALIZAR USUARIO (PUT)
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Si se ha modificado la contraseña, encriptar
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        const userUpdated = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password'); // Actualizar usuario y excluir contraseña por seguridad

        if (!userUpdated) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json({ message: 'Usuario actualizado correctamente', userUpdated });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

// 5. ELIMINAR USUARIO (DELETE)
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id); // Elimina el usuario de MongoDB
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// 6. OBTENER TODOS LOS USUARIOS (GET)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer los usuarios' });
    }
};

// 7. OBTENER USUARIO POR USUARIO (GET)
const getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;

        // Verificar si el usuario existe, ignorando mayúsculas y minúsculas
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
};

// 8. OBTENER USUARIO POR ID (GET)
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // Excluir contraseña por seguridad
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    getUserByUsername
};