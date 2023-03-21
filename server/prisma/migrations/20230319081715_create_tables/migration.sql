-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `customerCredentialId` INTEGER NOT NULL,

    UNIQUE INDEX `Customer_customerCredentialId_key`(`customerCredentialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerCredential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isEmailVerified` BOOLEAN NOT NULL,

    UNIQUE INDEX `CustomerCredential_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bouquet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bouquetCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Bouquet_bouquetCode_key`(`bouquetCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BouquetDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bouquetId` INTEGER NOT NULL,
    `flowerId` INTEGER NOT NULL,
    `flowerQuantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flower` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `deliveryDays` INTEGER NOT NULL,
    `purchaseQuantity` INTEGER NOT NULL,
    `maintanableDays` INTEGER NOT NULL,

    UNIQUE INDEX `Flower_flowerCode_key`(`flowerCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerId` INTEGER NOT NULL,
    `arrivalDate` DATE NOT NULL,

    UNIQUE INDEX `FlowerInventory_flowerId_arrivalDate_key`(`flowerId`, `arrivalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BouquetOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `senderName` VARCHAR(191) NOT NULL,
    `bouquetId` INTEGER NOT NULL,
    `deliveryDate` DATE NOT NULL,
    `deliveryAddress1` VARCHAR(191) NOT NULL,
    `deliveryAddress2` VARCHAR(191) NULL,
    `deliveryMessage` VARCHAR(191) NULL,
    `totalAmount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BouquetOrderDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bouquetOrderId` INTEGER NOT NULL,
    `flowerId` INTEGER NOT NULL,
    `flowerName` VARCHAR(191) NOT NULL,
    `flowerCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BouquetOrderShipment` (
    `bouquetOrderId` INTEGER NOT NULL,
    `shippedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`bouquetOrderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BouquetOrderDetailShipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderShipmentId` INTEGER NOT NULL,
    `orderDetailId` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `shippedQuantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deliveryDate` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerOrderDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerOrderId` INTEGER NOT NULL,
    `flowerId` INTEGER NOT NULL,
    `orderQuantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerOrderArrival` (
    `flowerOrderId` INTEGER NOT NULL,
    `arrivedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`flowerOrderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerOrderDetailArrival` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerOrderArrivalId` INTEGER NOT NULL,
    `flowerOrderDetailId` INTEGER NOT NULL,
    `arrivedQuantity` INTEGER NOT NULL,
    `flowerInventoryId` INTEGER NOT NULL,

    UNIQUE INDEX `FlowerOrderDetailArrival_flowerOrderDetailId_key`(`flowerOrderDetailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerDisposal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerInventoryId` INTEGER NOT NULL,
    `disposedCount` INTEGER NOT NULL,
    `disposedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_customerCredentialId_fkey` FOREIGN KEY (`customerCredentialId`) REFERENCES `CustomerCredential`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetDetail` ADD CONSTRAINT `BouquetDetail_bouquetId_fkey` FOREIGN KEY (`bouquetId`) REFERENCES `Bouquet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetDetail` ADD CONSTRAINT `BouquetDetail_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerInventory` ADD CONSTRAINT `FlowerInventory_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrder` ADD CONSTRAINT `BouquetOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrder` ADD CONSTRAINT `BouquetOrder_bouquetId_fkey` FOREIGN KEY (`bouquetId`) REFERENCES `Bouquet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderDetail` ADD CONSTRAINT `BouquetOrderDetail_bouquetOrderId_fkey` FOREIGN KEY (`bouquetOrderId`) REFERENCES `BouquetOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderDetail` ADD CONSTRAINT `BouquetOrderDetail_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderShipment` ADD CONSTRAINT `BouquetOrderShipment_bouquetOrderId_fkey` FOREIGN KEY (`bouquetOrderId`) REFERENCES `BouquetOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderDetailShipment` ADD CONSTRAINT `BouquetOrderDetailShipment_orderShipmentId_fkey` FOREIGN KEY (`orderShipmentId`) REFERENCES `BouquetOrderShipment`(`bouquetOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderDetailShipment` ADD CONSTRAINT `BouquetOrderDetailShipment_orderDetailId_fkey` FOREIGN KEY (`orderDetailId`) REFERENCES `BouquetOrderDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetOrderDetailShipment` ADD CONSTRAINT `BouquetOrderDetailShipment_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `FlowerInventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerOrderDetail` ADD CONSTRAINT `FlowerOrderDetail_flowerOrderId_fkey` FOREIGN KEY (`flowerOrderId`) REFERENCES `FlowerOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerOrderDetail` ADD CONSTRAINT `FlowerOrderDetail_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerOrderArrival` ADD CONSTRAINT `FlowerOrderArrival_flowerOrderId_fkey` FOREIGN KEY (`flowerOrderId`) REFERENCES `FlowerOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerOrderDetailArrival` ADD CONSTRAINT `FlowerOrderDetailArrival_flowerOrderArrivalId_fkey` FOREIGN KEY (`flowerOrderArrivalId`) REFERENCES `FlowerOrderArrival`(`flowerOrderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerOrderDetailArrival` ADD CONSTRAINT `FlowerOrderDetailArrival_flowerOrderDetailId_fkey` FOREIGN KEY (`flowerOrderDetailId`) REFERENCES `FlowerOrderDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerOrderDetailArrival` ADD CONSTRAINT `FlowerOrderDetailArrival_flowerInventoryId_fkey` FOREIGN KEY (`flowerInventoryId`) REFERENCES `FlowerInventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerDisposal` ADD CONSTRAINT `FlowerDisposal_flowerInventoryId_fkey` FOREIGN KEY (`flowerInventoryId`) REFERENCES `FlowerInventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
