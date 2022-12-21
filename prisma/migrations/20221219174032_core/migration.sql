-- CreateTable
CREATE TABLE "user_data" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "pwhash" VARCHAR(128) NOT NULL,
    "salt" VARCHAR(32) NOT NULL,
    "totpsecret" VARCHAR(16),
    "businessName" VARCHAR(30) NOT NULL,
    "street" VARCHAR(40) NOT NULL,
    "houseNumber" VARCHAR(10) NOT NULL,
    "city" VARCHAR(40) NOT NULL,
    "zip" INTEGER NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "iban" VARCHAR(34) NOT NULL,
    "bic" VARCHAR(11) NOT NULL,
    "taxNumber" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "clientNumber" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "fullName" VARCHAR(60) NOT NULL,
    "careOf" VARCHAR(30),
    "street" VARCHAR(40) NOT NULL,
    "houseNumber" VARCHAR(10) NOT NULL,
    "city" VARCHAR(40) NOT NULL,
    "zip" INTEGER NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "userDataId" TEXT NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkHours" (
    "id" TEXT NOT NULL,
    "hours" SMALLINT NOT NULL,
    "rate" SMALLINT NOT NULL,
    "date" DATE NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "WorkHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_username_key" ON "user_data"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_data_businessName_key" ON "user_data"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "client_userDataId_clientNumber_key" ON "client"("userDataId", "clientNumber");

-- CreateIndex
CREATE UNIQUE INDEX "client_userDataId_name_key" ON "client"("userDataId", "name");

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_userDataId_fkey" FOREIGN KEY ("userDataId") REFERENCES "user_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkHours" ADD CONSTRAINT "WorkHours_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
