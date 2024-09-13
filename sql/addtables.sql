CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "pet_type" VARCHAR(255) NULL DEFAULT 'dog',
    "image_pet" VARCHAR(255) NULL,
    "pet_breeds" VARCHAR(255) NULL,
    "gender" VARCHAR(255) NULL DEFAULT 'male',
    "name" VARCHAR(255) NULL,
    "age" INTEGER NULL,
    "city" VARCHAR(255) NULL,
    "bio" VARCHAR(255) NULL
);
CREATE TABLE "messages"(
    "id" SERIAL PRIMARY KEY,
    "message" VARCHAR(255) NULL
);
CREATE TABLE "matches"(
    "id" SERIAL PRIMARY KEY,
    "status" VARCHAR(255) NOT NULL DEFAULT 'pending'
);
ALTER TABLE
    "messages" ADD CONSTRAINT "fk_matches_id" FOREIGN KEY("id") REFERENCES "matches"("id");
ALTER TABLE
    "messages" ADD CONSTRAINT "fk_sender_id" FOREIGN KEY("id") REFERENCES "users"("id");
ALTER TABLE
    "matches" ADD CONSTRAINT "fk_users_id_1" FOREIGN KEY("id") REFERENCES "users"("id");
ALTER TABLE
    "matches" ADD CONSTRAINT "fk_users_id_2" FOREIGN KEY("id") REFERENCES "users"("id");
