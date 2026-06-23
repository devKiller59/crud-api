# 🚀 KillerCoreAPI

Esta es una API RESTful desarrollada en Node.js y Express para la gestión completa de usuarios. Cuenta con almacenamiento persistente y escalable en la nube utilizando MongoDB Atlas y está desplegada de forma continua en Render.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js** - Entorno de ejecución para JavaScript.
* **Express.js** - Framework web para la construcción de las rutas de la API.
* **MongoDB Atlas** - Base de datos NoSQL alojada en la nube.
* **Mongoose** - Modelado de objetos para transiciones y consultas eficientes a MongoDB.
* **Render** - Plataforma en la nube para el alojamiento y despliegue del servidor.

---

## 📋 Características Principales

* **Operaciones CRUD Completas:** Crear, Leer, Actualizar y Eliminar registros de usuarios.
* **Timestamps Automatizados:** Seguimiento en tiempo real de las fechas exactas de registro (`createdAt`) y modificaciones (`updatedAt`).
* **IDs Criptográficos:** Indexación única controlada mediante la estructura `ObjectId` nativa de MongoDB.
* **Autenticación y Autorización:** Autenticación de usuarios mediante Tokens de Identidad Unificada (JWT) y autorización de acceso mediante roles y permisos.
* **Seguridad y Protección:** Almacenamiento seguro de contraseñas encriptadas mediante algoritmos de hashing y encriptación de datos.
* **Estado de Servicio:** Monitorización y gestión de estado de servicio para el despliegue y mantenimiento del servidor.

---

## 🛣️ Endpoints de la API

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **GET** | `/users` | Obtiene la lista completa de usuarios registrados. |
| **POST** | `/users` | Registra un nuevo usuario en la base de datos. |
| **PUT** | `/users/:id` | Modifica los datos de un usuario existente filtrado por su ID. |
| **DELETE** | `/users/:id` | Elimina permanentemente a un usuario del sistema por su ID. |
| **GET** | `/users/profile` | Obtiene los detalles del perfil del usuario autenticado. |
| **GET** | `/users/username/:username` | Obtiene los detalles del usuario por su nombre de usuario. |
| **POST** | `/users/login` | Envía los datos de un usuario para autenticarse. |
| **GET** | `/users/register` | Envía los datos de un usuario para registrarse. |

---

## 👤 Autor

Desarrollado con dedicación por **DevKiller59**.  
*¡Proyecto listo para seguir escalando a nuevos módulos y servicios!*