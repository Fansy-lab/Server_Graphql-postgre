const { gql } = require("apollo-server");
const { DateTime } = require("graphql-scalars");

const typeDefs = gql`
  scalar DateTime

  type Transaction {
    id: ID!
    accountId: ID!
    categoryId: ID
    category: Category
    reference: String!
    amount: Float!
    currency: String!
    date: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    color: String!
    transactions: [Transaction]
  }

  type Account {
    id: ID!
    name: String!
    bank: String!
    transactions: [Transaction]
  }
  type TransactionsResult {
    transactions: [Transaction]!
    totalCount: Int!
  }
  input DateInput {
    month: Int!
    year: Int!
  }
  type Query {
    searchTransactionsByAnyParam(
      search: String
      limit: Int
      offset: Int
    ): TransactionsResult!
    searchTransactionsByColumns(
      bank: String
      accountIds: [ID]
      dateRange: [DateInput]
      limit: Int
      offset: Int
    ): TransactionsResult!

    allUniqueBanks: [String!]!
    allUniqueAccounts: [String!]!
    categories: [Category!]!
    accounts: [Account!]!
  }
`;

module.exports = typeDefs;
