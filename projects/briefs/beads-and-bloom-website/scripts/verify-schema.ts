import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function verify() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log("Connecting to database...");

  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log("\nTables found:");
  for (const row of tables) {
    console.log(`  - ${row.table_name}`);
  }

  const expected = ["charity_totals", "customers", "order_items", "orders", "products"];
  const found = tables.map((r) => r.table_name as string);
  const missing = expected.filter((t) => !found.includes(t));

  if (missing.length > 0) {
    console.error(`\nMISSING TABLES: ${missing.join(", ")}`);
    process.exit(1);
  }

  // Check enums
  const enums = await sql`
    SELECT typname, enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE typname IN ('order_status', 'availability')
    ORDER BY typname, enumsortorder;
  `;

  console.log("\nEnums found:");
  for (const row of enums) {
    console.log(`  - ${row.typname}: ${row.enumlabel}`);
  }

  const hasConfirmed = enums.some(
    (e) => e.typname === "order_status" && e.enumlabel === "confirmed"
  );
  if (!hasConfirmed) {
    console.error("\nMISSING: 'confirmed' value in order_status enum");
    process.exit(1);
  }

  console.log("\nSchema verification PASSED");
}

verify().catch((err) => {
  console.error("Schema verification FAILED:", err.message);
  process.exit(1);
});
