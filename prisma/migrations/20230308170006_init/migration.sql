-- AlterTable
ALTER TABLE "Accounts" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Accounts_id_seq";

-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Categories_id_seq";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "date" DROP NOT NULL;
DROP SEQUENCE "Transactions_id_seq";
