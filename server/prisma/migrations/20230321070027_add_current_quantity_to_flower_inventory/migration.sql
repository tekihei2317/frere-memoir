/*
  Warnings:

  - Added the required column `currentQuantity` to the `FlowerInventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FlowerInventory` ADD COLUMN `currentQuantity` INTEGER UNSIGNED NOT NULL;
