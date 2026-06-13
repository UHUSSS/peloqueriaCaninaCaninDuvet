require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/database/connection');
require('./src/models'); // Inicializar asociaciones

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ───────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Aumentar límite para imágenes en base64
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ─── Rutas ─────────────────────────────────────────────────
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/owners', require('./src/routes/owners'));
app.use('/api/pets', require('./src/routes/pets'));
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/stylists', require('./src/routes/stylists'));

// Health check - útil para Cloud Run
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'peluqueria-canina-api' });
});

app.get('/', (req, res) => {
  res.json({ message: '🐾 API Peluquería Canina v1.0', docs: '/health' });
});

// ─── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', detail: err.message });
});

// ─── Conectar DB y arrancar servidor ──────────────────────
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL correctamente');
    return sequelize.sync({ alter: false }); // No altera tablas en producción
  })
  .then(async () => {
    // Sembrar administrador por defecto si no existe ningún usuario
    try {
      const { User } = require('./src/models');
      const count = await User.count();
      if (count === 0) {
        await User.create({
          name: 'Administrador',
          email: 'admin@peluqueria.com',
          password: 'admin', // Se encripta automáticamente con el hook beforeCreate
          role: 'admin'
        });
        console.log('🌱 Usuario administrador creado por defecto: admin@peluqueria.com / admin');
      }
    } catch (err) {
      console.error('⚠️ Error al auto-sembrar el usuario administrador:', err.message);
    }
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${PORT}`);
      console.log(`🗄️  Base de datos: ${process.env.DB_NAME} en ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MySQL:', err.message);
    console.error('   Asegúrate de que XAMPP esté corriendo y la BD exista.');
    process.exit(1);
  });
