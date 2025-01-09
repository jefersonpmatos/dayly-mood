-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "mood" TEXT NOT NULL,
    "note" TEXT,
    "imgs" TEXT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_entries" ("createdAt", "date", "day", "id", "imgs", "month", "mood", "updatedAt", "userId", "week", "year") SELECT "createdAt", "date", "day", "id", "imgs", "month", "mood", "updatedAt", "userId", "week", "year" FROM "entries";
DROP TABLE "entries";
ALTER TABLE "new_entries" RENAME TO "entries";
CREATE INDEX "entries_userId_year_idx" ON "entries"("userId", "year");
CREATE INDEX "entries_userId_year_month_idx" ON "entries"("userId", "year", "month");
CREATE INDEX "entries_userId_year_week_idx" ON "entries"("userId", "year", "week");
CREATE INDEX "entries_userId_year_month_day_idx" ON "entries"("userId", "year", "month", "day");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
