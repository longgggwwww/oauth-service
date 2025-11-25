-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "familyName" TEXT,
ADD COLUMN     "givenName" TEXT,
ADD COLUMN     "locale" TEXT,
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "timezone" TEXT;
