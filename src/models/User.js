const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: { 
      type: String, 
      required: [true, 'El nombre es obligatorio'], 
      trim: true 
    },
    last_name: { 
      type: String, 
      required: [true, 'El apellido es obligatorio'], 
      trim: true 
    },
    username: { 
      type: String, 
      required: [true, 'El nombre de usuario es obligatorio'], 
      unique: true, // Solo permite un usuario con el mismo nombre de usuario
      trim: true, 
      lowercase: true 
    },
    email: { 
      type: String, 
      required: [true, 'El email es obligatorio'], 
      unique: true, // Solo permite un usuario con el mismo email
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: [true, 'La contraseña es obligatoria'], 
      minlength: 8, // La contraseña debe tener al menos 8 caracteres
    },
    birthday: { 
      type: Date, 
      required: false 
    },
    role: { 
      type: String, 
      required: false, 
      enum: ['user', 'moderator', 'admin'], // Permite los roles 'user', 'moderator' y 'admin'
      default: 'user' // Por defecto, el usuario tiene el rol 'user'
    },
    isActive: { 
      type: Boolean, 
      default: true // Por defecto, el usuario está activo
    }
}, {
    timestamps: true // Para que Mongoose crea las fechas de creación y actualización automáticamente
});

// Métodos de validación
UserSchema.pre('save', async function () {
  // Si la contraseña no se ha modificado, salta la encriptación
  if (!this.isModified('password')) return;

  try {
    // Encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  } catch (error) {
    throw error;
  }
});

// Método personalizado para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);