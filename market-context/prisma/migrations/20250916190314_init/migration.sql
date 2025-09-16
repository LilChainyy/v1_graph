-- CreateTable
CREATE TABLE "tickers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tickerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "eventType" TEXT NOT NULL,
    "direct" BOOLEAN NOT NULL,
    "isBinary" BOOLEAN NOT NULL,
    "isRecurring" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "links" TEXT,
    "notes" TEXT,
    CONSTRAINT "events_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "tickers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tickers_symbol_key" ON "tickers"("symbol");
