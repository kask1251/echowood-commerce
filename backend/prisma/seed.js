// /prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting the seed process...");

  // 1. Clean up existing data to ensure a fresh start
  console.log("Cleaning up the database...");
  // Delete in reverse order of creation to respect foreign key constraints
  await prisma.productImage.deleteMany();
  // We need to disconnect relations before deleting the related models.
  // Prisma handles this implicitly for one-to-many, but for many-to-many, we clear the relation first.
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
      await prisma.product.update({
          where: { id: product.id },
          data: { collections: { set: [] } },
      });
  }
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany({ where: { parentId: { not: null } } }); // Delete children first
  await prisma.category.deleteMany({ where: { parentId: null } }); // Then delete parents
  
  console.log("Database cleaned.");

  // 2. Seed Collections
  console.log("Seeding Collections...");
  const beginnerSeries = await prisma.collection.create({
    data: {
      name: "Beginner Series",
      slug: "beginner-series",
      description: "Perfect instruments for those starting their musical journey.",
      imageUrl: "https://placehold.co/800x400?text=Beginner+Series",
    },
  });

  const concertGrade = await prisma.collection.create({
    data: {
      name: "Concert Grade",
      slug: "concert-grade",
      description: "High-quality, professional instruments for stage performance.",
      imageUrl: "https://placehold.co/800x400?text=Concert+Grade",
    },
  });

  const masterLuthier = await prisma.collection.create({
    data: {
      name: "Master Luthier Edition",
      slug: "master-luthier-edition",
      description: "Exquisite, handcrafted instruments from renowned artisans.",
      imageUrl: "https://placehold.co/800x400?text=Master+Luthier",
    },
  });
  console.log("Collections seeded.");

  // 3. Seed Categories (with parent-child relationships)
  console.log("Seeding Categories...");
  const parentStrings = await prisma.category.create({
    data: { name: "Strings", slug: "strings" },
  });

  const parentWind = await prisma.category.create({
    data: { name: "Wind", slug: "wind" },
  });
  
  const parentPercussion = await prisma.category.create({
    data: { name: "Percussion", slug: "percussion" },
  });

  const childSitar = await prisma.category.create({
    data: {
      name: "Sitar",
      slug: "sitar",
      parentId: parentStrings.id,
    },
  });

  const childBansuri = await prisma.category.create({
    data: {
      name: "Bansuri",
      slug: "bansuri",
      parentId: parentWind.id,
    },
  });
    const childTabla = await prisma.category.create({
    data: {
      name: "Tabla",
      slug: "tabla",
      parentId: parentPercussion.id,
    },
  });
  console.log("Categories seeded.");

  // 4. Seed Products
  console.log("Seeding Products...");
  await prisma.product.create({
    data: {
      name: "Ravi Shankar Style Sitar",
      slug: "ravi-shankar-style-sitar",
      description: "A full-sized, professional sitar crafted from aged teak wood, delivering a deep and resonant tone.",
      price: 799.99,
      stock: 15,
      isFeatured: true,
      specs: { "Wood": "Teak", "Strings": "7 Main + 13 Tarab", "Style": "Kharaj Pancham" },
      categoryId: childSitar.id,
      collections: {
        connect: [{ id: concertGrade.id }, { id: masterLuthier.id }],
      },
      images: {
        create: [
          { url: "https://placehold.co/600x400/A52A2A/FFFFFF?text=Sitar+Front", altText: "Front view of the Sitar", isPrimary: true },
          { url: "https://placehold.co/600x400/A52A2A/FFFFFF?text=Sitar+Head", altText: "Detail of the Sitar's headstock" },
          { url: "https://placehold.co/600x400/A52A2A/FFFFFF?text=Sitar+Tumba", altText: "Close-up of the Sitar's main gourd (tumba)" },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Professional E Bass Bansuri",
      slug: "professional-e-bass-bansuri",
      description: "A concert-grade Bansuri flute, precisely tuned to E Bass, made from a single piece of premium Assam bamboo.",
      price: 149.50,
      stock: 40,
      isFeatured: true,
      specs: { "Key": "E Bass", "Material": "Assam Bamboo", "Holes": "7" },
      audioUrl: "https://example.com/audio/e-bass-bansuri.mp3",
      categoryId: childBansuri.id,
      collections: {
        connect: [{ id: concertGrade.id }],
      },
      images: {
        create: [
          { url: "https://placehold.co/600x400/DEB887/000000?text=Bansuri+Full", altText: "Full length view of the Bansuri", isPrimary: true },
          { url: "https://placehold.co/600x400/DEB887/000000?text=Bansuri+Holes", altText: "Close-up of the finger holes" },
        ],
      },
    },
  });
  
    await prisma.product.create({
    data: {
      name: "Classic Dayan Bayan Tabla Set",
      slug: "classic-dayan-bayan-tabla",
      description: "A complete tabla set, perfect for students and intermediate players. Includes a sheesham wood dayan and a copper bayan.",
      price: 220.00,
      stock: 30,
      specs: { "Dayan Wood": "Sheesham", "Bayan Metal": "Copper", "Head": "Goat Skin" },
      categoryId: childTabla.id,
      collections: {
        connect: [{ id: beginnerSeries.id }],
      },
      images: {
        create: [
          { url: "https://placehold.co/600x400/8B4513/FFFFFF?text=Tabla+Set", altText: "The complete Tabla set", isPrimary: true },
          { url: "https://placehold.co/600x400/8B4513/FFFFFF?text=Dayan+Top", altText: "Top view of the Dayan drum" },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Amjad Ali Khan Style Sarod",
      slug: "amjad-ali-khan-style-sarod",
      description: "A fretless stringed instrument crafted from teak wood, known for its deep, introspective sound.",
      price: 950.00,
      stock: 8,
      specs: { "Wood": "Teak", "Resonator": "Goat Skin", "Strings": "25" },
      categoryId: parentStrings.id, // Assigning to the parent category
      collections: {
        connect: [{ id: masterLuthier.id }],
      },
      images: {
        create: [
          { url: "https://placehold.co/600x400/CD853F/FFFFFF?text=Sarod", altText: "Full view of the Sarod", isPrimary: true },
          { url: "https://placehold.co/600x400/CD853F/FFFFFF?text=Sarod+Pegs", altText: "Tuning pegs of the Sarod" },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Student Harmonium",
      slug: "student-harmonium",
      description: "A portable, 2.5-octave harmonium perfect for learning, with two sets of reeds.",
      price: 350.00,
      stock: 50,
      specs: { "Reeds": "2 Sets (Bass, Male)", "Bellows": "7-Fold", "Octaves": "2.5" },
      // This category does not exist, to demonstrate adding a product without a category for flexibility
      // categoryId: null,
      collections: {
        connect: [{ id: beginnerSeries.id }],
      },
      images: {
        create: [
          { url: "https://placehold.co/600x400/F4A460/000000?text=Harmonium", altText: "Portable student harmonium", isPrimary: true },
        ],
      },
    },
  });

  console.log("Products seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed process finished successfully.");
  })
  .catch(async (e) => {
    console.error("An error occurred during the seed process:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });