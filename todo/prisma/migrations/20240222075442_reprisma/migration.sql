/*
  Warnings:

  - Added the required column `Author` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "Author" TEXT NOT NULL;
