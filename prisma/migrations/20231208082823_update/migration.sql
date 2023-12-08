/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `amount` to the `OrderLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount";

-- AlterTable
ALTER TABLE "OrderLine" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;
