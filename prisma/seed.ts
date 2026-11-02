import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('demo123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.app' },
    update: {},
    create: {
      email: 'admin@taskflow.app',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: 'demo@taskflow.app' },
    update: {},
    create: {
      email: 'demo@taskflow.app',
      name: 'Demo User',
      password: userPassword,
      role: 'user',
    },
  })

  const project = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete redesign of the company marketing site',
      status: 'active',
      ownerId: demo.id,
      tasks: {
        create: [
          {
            title: 'Design homepage mockups',
            description: 'Create high-fidelity designs for the new homepage',
            status: 'in_progress',
            priority: 'high',
            assigneeId: demo.id,
          },
          {
            title: 'Implement responsive layout',
            status: 'todo',
            priority: 'medium',
            assigneeId: demo.id,
          },
          {
            title: 'Write content for about page',
            status: 'done',
            priority: 'low',
          },
        ],
      },
    },
  })

  console.log('Seed completed')
  console.log({ admin: admin.email, demo: demo.email, project: project.name })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
