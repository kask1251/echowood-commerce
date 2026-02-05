const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Flutes', slug: 'flutes' },
    { name: 'Harmonium', slug: 'harmonium' },
    { name: 'Tabla', slug: 'tabla' },
    { name: 'Guitar', slug: 'guitar' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  console.log("Seeding Categories...");
  
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Done!");
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });