import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products, charityTotals } from "../src/db/schema";

const client = neon(process.env.DATABASE_URL!);
const db = drizzle({ client });

const PRODUCTS = [
  // --- Bracelets ---
  {
    name: "Ocean Breeze Bracelet",
    slug: "ocean-breeze-bracelet",
    description:
      "Cute clay bead bracelet in ocean blue tones on stretchy cord. Comes with a little wave charm. Handmade by us!",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-2_beo6po",
    ],
    colors: [],
    customizable: false,
    availability: "made_to_order" as const,
    inStock: true,
    featured: true,
    materials: "Clay beads, charm, stretch cord",
    careInfo:
      "Avoid water and perfume. Store flat in a cool, dry place. Remove before swimming or showering.",
    sortOrder: 1,
  },
  {
    name: "Sunset Glow Bracelet",
    slug: "sunset-glow-bracelet",
    description:
      "Warm sunset-colored clay bead bracelet with coral, peach, and gold beads on stretchy cord. Great for stacking!",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-5_kbjkkj",
    ],
    colors: [],
    customizable: false,
    availability: "made_to_order" as const,
    inStock: true,
    featured: false,
    materials: "Clay beads, charm, stretch cord",
    careInfo:
      "Avoid water and perfume. Store flat in a cool, dry place. Remove before swimming or showering.",
    sortOrder: 2,
  },
  {
    name: "Pearl Tide Bracelet",
    slug: "pearl-tide-bracelet",
    description:
      "Pearl bead bracelet with a cute sea turtle charm and starfish bead. Super pretty and goes with everything!",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-3_ghlzs5",
    ],
    colors: [],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: true,
    materials: "Pearl beads, turtle charm, starfish bead, stretch cord",
    careInfo:
      "Pearls are delicate -- avoid water, perfume, and harsh chemicals. Store in a soft pouch. Wipe gently with a dry cloth.",
    sortOrder: 3,
  },
  {
    name: "Coral Reef Stack",
    slug: "coral-reef-stack",
    description:
      "A set of 3 matching clay bead bracelets you can stack together. Pick your own colors or choose one of our combos!",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets_nzyvgb",
    ],
    colors: ["Ocean Mix", "Sunset Mix", "Tropical Mix", "Custom -- Pick Your Own"],
    customizable: true,
    availability: "made_to_order" as const,
    inStock: true,
    featured: false,
    materials: "Clay beads, accent beads, stretch cord (set of 3)",
    careInfo:
      "Avoid water and perfume. Store flat in a cool, dry place. Remove before swimming or showering.",
    sortOrder: 4,
  },

  // --- Necklaces ---
  {
    name: "Sea Turtle Charm Necklace",
    slug: "sea-turtle-charm-necklace",
    description:
      "Gold chain necklace with ocean-themed charms -- starfish, shell, flower, and more. Lightweight and cute for everyday wear.",
    price: "6.00",
    category: "necklaces",
    images: [
      "golf-necklace_zbhbzb",
    ],
    colors: ["Gold"],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: true,
    materials: "Gold-tone chain, ocean charms",
    careInfo:
      "Remove before showering or swimming. Store in a dry place. Polish with a soft jewelry cloth.",
    sortOrder: 5,
  },
  {
    name: "Starfish & Pearl Necklace",
    slug: "starfish-pearl-necklace",
    description:
      "Gold chain with a starfish charm and a pearl bead. Simple and pretty -- perfect for layering or wearing on its own.",
    price: "6.00",
    category: "necklaces",
    images: [
      "golf-necklace_zbhbzb",
    ],
    colors: ["Gold"],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: false,
    materials: "Gold-tone chain, starfish charm, pearl bead",
    careInfo:
      "Remove before showering or swimming. Store in a dry place. Polish with a soft jewelry cloth. Handle pearl gently.",
    sortOrder: 6,
  },
  {
    name: "Plumeria Drop Bracelet",
    slug: "plumeria-drop-bracelet",
    description:
      "White bead bracelet with a cute plumeria flower charm. Simple, clean, and easy to wear with anything.",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-4_drbipz",
    ],
    colors: [],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: false,
    materials: "White beads, plumeria flower charm, stretch cord",
    careInfo:
      "Remove before showering or swimming. Store in a dry place. Polish with a soft jewelry cloth.",
    sortOrder: 7,
  },

  // --- Accessories ---
  {
    name: "Ocean Charm Anklet",
    slug: "ocean-charm-anklet",
    description:
      "Gold chain anklet with little shell and starfish charms. Adjustable length so it fits most ankles. So cute for summer!",
    price: "6.00",
    category: "accessories",
    images: [
      "golf-necklace_zbhbzb",
    ],
    colors: ["Gold"],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: false,
    materials: "Gold-tone chain, shell charm, starfish charm, adjustable clasp",
    careInfo:
      "Remove before showering or swimming. Rinse with fresh water if exposed to saltwater. Store in a dry place.",
    sortOrder: 8,
  },
];

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(charityTotals);
  await db.delete(products);

  console.log("Seeding products...");
  await db.insert(products).values(PRODUCTS);
  console.log(`  Inserted ${PRODUCTS.length} products`);

  console.log("Initializing charity counter...");
  await db.insert(charityTotals).values({
    totalDonated: "17",
    orderCount: 17,
  });

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
