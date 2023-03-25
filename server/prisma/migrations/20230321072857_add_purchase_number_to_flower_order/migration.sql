/*
  Warnings:

  - Added the required column `purchaseNumber` to the `FlowerOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FlowerOrder` ADD COLUMN `purchaseNumber` VARCHAR(191) NOT NULL;
