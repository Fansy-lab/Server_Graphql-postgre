const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function loadTableFromFile(filename, tableName, rowMappingFunction) {
  const rowsToInsert = [];
  fs.createReadStream(filename)
    .pipe(
      csv({
        separator: ",",
        quote: '"',
        escape: '"',
        strict: true,
      })
    )
    .on("data", (row) => {
      rowsToInsert.push(rowMappingFunction(row));
    })
    .on("end", async () => {
      try {
        await prisma[tableName].createMany({ data: rowsToInsert });
        console.log(`${tableName} table seeded`);
      } catch (error) {
        console.error(`Error seeding ${tableName} table:`, error);
      }
    })
    .on("error", (error) => {
      console.error(`Error reading ${filename}:`, error);
    });
}

async function main() {
  try {
    //load accounts
    await loadTableFromFile("./seeds/accounts.csv", "accounts", (row) => ({
      id: row[Object.keys(row)[0]],
      name: row.name,
      bank: row.bank,
    }));

    //load categories
    await loadTableFromFile("./seeds/categories.csv", "categories", (row) => ({
      id: row[Object.keys(row)[0]],
      name: row.name,
      color: row.color,
    }));

    //load transactions
    await loadTableFromFile(
      "./seeds/transactions.csv",
      "transactions",
      (row) => ({
        id: row[Object.keys(row)[0]],
        accountId: row.accountId,
        categoryId: row.categoryId ? row.categoryId : null,
        reference: row.reference,
        amount: parseFloat(row.amount),
        currency: row.currency,
        date: row.date ? new Date(`${row.date} UTC`).toISOString() : null,
      })
    );
  } catch (error) {
    console.error("Error seeding tables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => console.error(e));
