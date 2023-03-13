const { PrismaClient } = require("@prisma/client");
const { DateTimeResolver } = require("graphql-scalars");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const resolvers = {
  Query: {
    searchTransactionsByColumns: async (
      _,
      { bank, accountIds, dateRange, limit, offset }
    ) => {
      const where = {};

      if (accountIds && accountIds.length > 0) {
        where.accountId = { in: accountIds };
      }

      if (bank) {
        where.account = { bank };
      }

      if (dateRange && dateRange.length > 1) {
        const fromDate = new Date(dateRange[0].year, dateRange[0].month, 1);
        const toDate = new Date(dateRange[1].year, dateRange[1].month, 0);
        where.date = { gte: fromDate, lte: toDate };
      }

      const transactions = await prisma.transactions.findMany({
        where,
        include: { category: true, account: true },
        take: limit,
        skip: offset,
      });

      const totalCount = prisma.transactions.count({
        where: { OR: where },
      });

      return { transactions, totalCount };
    },
    searchTransactionsByAnyParam: async (_, { search, limit, offset }) => {
      const whereConditions = [
        { reference: { contains: search, mode: "insensitive" } },
        { id: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
        { account: { name: { contains: search, mode: "insensitive" } } },
        { account: { bank: { contains: search, mode: "insensitive" } } },
        { currency: { equals: search, mode: "insensitive" } },
      ];

      const [transactions, count] = await Promise.all([
        prisma.transactions.findMany({
          where: { OR: whereConditions },
          include: { category: true, account: true },
          take: limit,
          skip: offset,
        }),
        prisma.transactions.count({
          where: { OR: whereConditions },
        }),
      ]);
      return { transactions, totalCount: count };
    },

    allUniqueBanks: async () => {
      const accounts = await prisma.accounts.findMany();
      const banks = new Set();
      accounts.forEach((account) => banks.add(account.bank));
      return Array.from(banks);
    },
    allUniqueAccounts: async () => {
      const accounts = await prisma.accounts.findMany();
      const accsToReturn = new Set();
      accounts.forEach((account) => accsToReturn.add(account.name));
      return Array.from(accsToReturn);
    },
    categories: async () => {
      return prisma.categories.findMany();
    },
    accounts: async () => {
      return prisma.accounts.findMany();
    },
  },
};

module.exports = resolvers;
