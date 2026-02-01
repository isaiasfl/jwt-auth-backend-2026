import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Hash de contraseñas
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dwec.com',
      passwordHash: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@dwec.com',
      passwordHash: userPassword,
      name: 'Usuario Normal',
      role: 'USER',
    },
  });

  // Crear tareas para el usuario normal
  await prisma.task.createMany({
    data: [
      {
        title: 'Aprender React',
        completed: false,
        userId: user.id,
      },
      {
        title: 'Conectar frontend con backend',
        completed: false,
        userId: user.id,
      },
      {
        title: 'Implementar autenticación JWT',
        completed: true,
        userId: user.id,
      },
    ],
  });

  console.log('✅ Seed completado exitosamente');
  console.log('\n📝 Usuarios creados:');
  console.log('Admin: admin@dwec.com / admin123');
  console.log('User: user@dwec.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
