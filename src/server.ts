import app from './app.js';
import { env } from './config/env.js';
import prisma from './config/prisma.js';

const PORT = parseInt(env.PORT);

async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL');

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📝 Entorno: ${env.NODE_ENV}`);
      console.log(`🌐 CORS habilitado para: ${env.CORS_ORIGIN}`);
      console.log(`\n💡 Healthcheck: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
