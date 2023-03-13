/*
  Warnings:

  - The primary key for the `Accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `categoryId` on table `Transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reference` on table `Transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_categoryId_fkey";

-- AlterTable
ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "accountId" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ALTER COLUMN "reference" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
