-- Deploy batala:3.1.create_table.sql to pg

BEGIN;

-- DROP IF EXISTS
DROP DOMAIN IF EXISTS "postal_code_fr";
DROP DOMAIN IF EXISTS email_validator;
DROP DOMAIN IF EXISTS name_validator;
DROP DOMAIN IF EXISTS phone_validator;

DROP TYPE IF EXISTS "gender";
DROP TYPE IF EXISTS "size";
DROP TYPE IF EXISTS "role";
DROP TYPE IF EXISTS "level";

DROP TABLE IF EXISTS pupitre CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "instrument" CASCADE;
DROP TABLE IF EXISTS "suit" CASCADE;
DROP TABLE IF EXISTS "user_has_suit" CASCADE;
DROP TABLE IF EXISTS password_reset_requests CASCADE;




-- DOMAIN
CREATE DOMAIN "postal_code_fr" AS text
CHECK(
    VALUE ~ '^0[1-9][0-9]{3}$'
    OR VALUE ~ '^[1-8][0-9]{4}$'
    OR VALUE ~ '^9[0-6]\d{3}$'
    OR VALUE ~ '^97[1-8][0-9]{2}$'
    OR VALUE ~ '^98[46-9][0-9]{2}$'
);

CREATE DOMAIN email_validator AS text
CHECK(
     value ~ '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'
);

CREATE DOMAIN name_validator AS TEXT CHECK (
    VALUE ~ '^[A-Za-zéèêç-]+$'
);

CREATE DOMAIN phone_validator AS TEXT CHECK (
    VALUE ~ '^(?:(?:\+|00)33[\s.]{0,3}(?:\(0\)[\s.]{0,3})?|0)[1-9](?:(?:[\s.]?\d{2}){4}|\d{2}(?:[\s.]?\d{3}){2})$'
);

-- TYPE
CREATE TYPE "gender" AS ENUM('F', 'M');
CREATE TYPE "size" AS ENUM('XS','S','M','L','XL','XXL+');
CREATE TYPE "role" AS ENUM('member', 'board', 'admin');
CREATE TYPE "level" AS ENUM('confirmed', 'noob');


-- TABLE

CREATE TABLE pupitre(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT
);

CREATE TABLE "user"(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "image" TEXT,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "nickname" TEXT,
    "email" email_validator NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "birthdate" DATE,
    "phone" phone_validator NOT NULL,
    "address" TEXT NOT NULL,
    "address_2" TEXT,
    "zip_code" postal_code_fr NOT NULL,
    "city" TEXT NOT NULL,
    "gender" gender,
    "top_size" size,
    "bottom_size" size,
    "subscription" BOOLEAN DEFAULT false,
    "deposit" BOOLEAN DEFAULT false,
    "role" role,
    "level" level NOT NULL,
    "observation" TEXT,
    "pupitre_id" INT REFERENCES "pupitre" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "instrument"(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "code" TEXT NOT NULL,
    "pupitre_id" INT REFERENCES "pupitre" ("id") ON DELETE SET NULL,
    "observation" TEXT,
    "depth" INT,
    "rods" INT,
    "weight" FLOAT,
    "sticker" BOOLEAN,
    "user_id" INT REFERENCES "user" ("id") ON DELETE SET NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "suit"(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL,
    "image" TEXT,
    "observation" TEXT,
    "quantity_xs" INT,
    "quantity_s" INT,
    "quantity_m" INT,
    "quantity_l" INT,
    "quantity_xl" INT,
    "quantity_xxl+" INT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_suit" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT REFERENCES "user"("id") ON DELETE SET NULL,
    "suit_id" INT REFERENCES "suit"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE password_reset_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
  reset_token TEXT UNIQUE NOT NULL,
  expiration TIMESTAMPTZ NOT NULL
);


COMMIT;
