-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "google_user_id" TEXT,
    "google_user_name" TEXT,
    "access_token" TEXT,
    "access_token_expiry_date" DATETIME,
    "refresh_token" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_google_user_id_key" ON "User"("google_user_id");
