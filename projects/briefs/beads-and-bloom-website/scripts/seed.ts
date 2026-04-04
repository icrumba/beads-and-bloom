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
      "Our signature heishi clay bead bracelet in dreamy ocean blues. Each bead is hand-selected for the perfect gradient from deep sea to sky. Finished with a tiny gold-filled wave charm.",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-2_beo6po",
    ],
    colors: ["Ocean Blue", "Sea Foam", "Pearl White", "Sky Blue"],
    customizable: true,
    availability: "made_to_order" as const,
    inStock: true,
    featured: true,
    materials: "Heishi clay beads, gold-filled wave charm, stretch cord",
    careInfo:
      "Avoid water and perfume. Store flat in a cool, dry place. Remove before swimming or showering.",
    sortOrder: 1,
  },
  {
    name: "Sunset Glow Bracelet",
    slug: "sunset-glow-bracelet",
    description:
      "Warm sunset tones that capture golden hour at the beach. Hand-strung heishi clay beads in coral, peach, and gold with a tiny sun charm. Perfect for stacking.",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-5_kbjkkj",
    ],
    colors: ["Coral", "Peach", "Gold", "Warm Sand"],
    customizable: true,
    availability: "made_to_order" as const,
    inStock: true,
    featured: false,
    materials: "Heishi clay beads, gold-filled sun charm, stretch cord",
    careInfo:
      "Avoid water and perfume. Store flat in a cool, dry place. Remove before swimming or showering.",
    sortOrder: 2,
  },
  {
    name: "Pearl Tide Bracelet",
    slug: "pearl-tide-bracelet",
    description:
      "Delicate freshwater pearls paired with a gold sea turtle charm. A timeless piece that goes from beach to brunch. Each pearl is unique -- no two bracelets are exactly alike.",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-3_ghlzs5",
    ],
    colors: ["Pearl White", "Champagne"],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: true,
    materials: "Freshwater pearls, 14K gold-filled sea turtle charm, stretch cord",
    careInfo:
      "Pearls are delicate -- avoid water, perfume, and harsh chemicals. Store in a soft pouch. Wipe gently with a dry cloth.",
    sortOrder: 3,
  },
  {
    name: "Coral Reef Stack",
    slug: "coral-reef-stack",
    description:
      "A set of 3 stackable clay bead bracelets in coordinated ocean tones. Mix and match or wear them all together for the ultimate beach stack. Pick your own color palette!",
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
    materials: "Heishi clay beads, gold-filled accent beads, stretch cord (set of 3)",
    careInfo:
      "Avoid water and perfume. Store flat in a cool, dry place. Remove before swimming or showering.",
    sortOrder: 4,
  },

  // --- Necklaces ---
  {
    name: "Sea Turtle Charm Necklace",
    slug: "sea-turtle-charm-necklace",
    description:
      "A dainty gold chain featuring our bestselling sea turtle charm. The turtle represents our love for the ocean and the charity mission behind every piece we make.",
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
    materials: "14K gold-filled chain, gold sea turtle charm",
    careInfo:
      "Remove before showering or swimming. Store in a dry place. Polish with a soft jewelry cloth.",
    sortOrder: 5,
  },
  {
    name: "Starfish & Pearl Necklace",
    slug: "starfish-pearl-necklace",
    description:
      "A gold chain adorned with a starfish charm and a single freshwater pearl drop. Effortlessly elegant -- the kind of necklace you never want to take off.",
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
    materials: "14K gold-filled chain, starfish charm, freshwater pearl drop",
    careInfo:
      "Remove before showering or swimming. Store in a dry place. Polish with a soft jewelry cloth. Handle pearl gently.",
    sortOrder: 6,
  },
  {
    name: "Plumeria Drop Bracelet",
    slug: "plumeria-drop-bracelet",
    description:
      "Our plumeria flower charm bracelet -- a little piece of the islands wherever you go. Lightweight and perfect for everyday wear.",
    price: "6.00",
    category: "bracelets",
    images: [
      "colored-bracelets-4_drbipz",
    ],
    colors: ["White", "Pink"],
    customizable: false,
    availability: "ready_to_ship" as const,
    inStock: true,
    featured: false,
    materials: "14K gold-filled chain, plumeria flower charm",
    careInfo:
      "Remove before showering or swimming. Store in a dry place. Polish with a soft jewelry cloth.",
    sortOrder: 7,
  },

  // --- Accessories ---
  {
    name: "Ocean Charm Anklet",
    slug: "ocean-charm-anklet",
    description:
      "A dainty gold chain anklet with tiny shell and starfish charms that jingle as you walk. Adjustable length fits most ankles. Summer essential!",
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
    materials:
      "14K gold-filled chain, shell charm, starfish charm, adjustable lobster clasp",
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
    totalDonated: "0",
    orderCount: 0,
  });

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
