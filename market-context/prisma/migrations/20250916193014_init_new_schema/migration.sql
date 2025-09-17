/*
  Warnings:

  - You are about to drop the column `date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `direct` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `isBinary` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `isRecurring` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `events` table. All the data in the column will be lost.
  - Added the required column `category` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tickerId" TEXT,
    "title" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT,
    "category" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "links" TEXT,
    "notes" TEXT,
    "externalId" TEXT,
    CONSTRAINT "events_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "tickers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_events" ("createdAt", "id", "links", "notes", "source", "tickerId", "title", "updatedAt") SELECT "createdAt", "id", "links", "notes", "source", "tickerId", "title", "updatedAt" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
