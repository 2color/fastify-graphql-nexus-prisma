/*
  Warnings:

  - You are about to drop the `_UserPostLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserPostLikes" DROP CONSTRAINT "_UserPostLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserPostLikes" DROP CONSTRAINT "_UserPostLikes_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_UserPostLikes";
