/*
  Warnings:

  - You are about to drop the `BouquetOrderDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BouquetOrderDetailShipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BouquetOrderDetail` DROP FOREIGN KEY `BouquetOrderDetail_bouquetOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `BouquetOrderDetail` DROP FOREIGN KEY `BouquetOrderDetail_flowerId_fkey`;

-- DropForeignKey
ALTER TABLE `BouquetOrderDetailShipment` DROP FOREIGN KEY `BouquetOrderDetailShipment_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `BouquetOrderDetailShipment` DROP FOREIGN KEY `BouquetOrderDetailShipment_orderDetailId_fkey`;

-- DropForeignKey
ALTER TABLE `BouquetOrderDetailShipment` DROP FOREIGN KEY `BouquetOrderDetailShipment_orderShipmentId_fkey`;

-- DropTable
DROP TABLE `BouquetOrderDetail`;

-- DropTable
DROP TABLE `BouquetOrderDetailShipment`;

-- CreateTable
CREATE TABLE `BouquetOrderShipmentDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderShipmentId` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `shippedQuantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BouquetOrderShipmentDetail` ADD CONSTRAINT `BouquetOrderShipmentDetail_orderShipmentId_fkey` FOREIGN KEY (`orderShipmentId`) REFERENCES `BouquetOrderShipment`(`bouquetOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderShipmentDetail` ADD CONSTRAINT `BouquetOrderShipmentDetail_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `FlowerInventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
