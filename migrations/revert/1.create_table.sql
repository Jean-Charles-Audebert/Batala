-- Revert batala:3.1.create_table.sql from pg

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


COMMIT;