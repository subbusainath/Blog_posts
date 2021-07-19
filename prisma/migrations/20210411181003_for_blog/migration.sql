-- CreateTable
CREATE TABLE "forensicDetails" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "Criminal" TEXT,
    "Blood_group" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "Evidence" TEXT,

    PRIMARY KEY ("id")
);
