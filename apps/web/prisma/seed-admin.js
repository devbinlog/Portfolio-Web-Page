const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

async function main() {
  const prisma = new PrismaClient()
  const hash = await bcrypt.hash('Rlaxoqls38@', 10)
  await prisma.adminUser.upsert({
    where: { email: 'devbinlog8@gmail.com' },
    update: { passwordHash: hash },
    create: { email: 'devbinlog8@gmail.com', passwordHash: hash },
  })
  console.log('Admin account created: devbinlog8@gmail.com')
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
