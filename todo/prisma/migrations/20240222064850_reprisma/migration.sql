/*
  Warnings:

  - You are about to drop the column `body` on the `post` table. All the data in the column will be lost.
  - Added the required column `description` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "body",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;
