-- AlterTable
ALTER TABLE "AppUser" RENAME CONSTRAINT "User_pkey" TO "AppUser_pkey";

-- RenameForeignKey
ALTER TABLE "AppUser" RENAME CONSTRAINT "User_tenantId_fkey" TO "AppUser_tenantId_fkey";
