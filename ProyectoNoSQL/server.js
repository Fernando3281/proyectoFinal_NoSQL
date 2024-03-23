//server.js
// Importa el módulo de express
const express = require('express');
const { connectToDatabase } = require('./src/repositories/conexionRepository');
const authRoutes = require('./src/routes/routes');

const app = express();

const PORT = 44301;
let database;
connectToDatabase().then(db => {
  database = db; // Almacena la instancia de la base de datos para usarla en otras partes del código
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Salir del proceso si no se puede conectar a MongoDB
});

// Middleware para servir archivos estáticos
app.use(express.static(__dirname + '/public'));

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes entrantes como URL-encoded
app.use(express.urlencoded({ extended: true }));


app.use('/api', authRoutes);

app.get('/api/publicaciones', async (req, res) => {
  try {
    // Verificar si la conexión a la base de datos se estableció correctamente
    if (!database) {
      return res.status(500).json({ error: 'Error en el servidor: conexión a la base de datos no establecida' });
    }

    // Obtener todas las publicaciones desde MongoDB, incluyendo los comentarios asociados a cada una
    const publicaciones = await database.collection('publicacion').aggregate([
      {
        $lookup: {
          from: 'comentario',
          localField: '_id',
          foreignField: 'publicacion_id',
          as: 'comentarios'
        }
      }
    ]).toArray();

    // Devolver las publicaciones al cliente
    res.json({ publicaciones });
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Iniciar el servidor y escuchar en el puerto especificado
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${server.address().port}`);
});