-- Verify batala:3.1.create_table.sql on pg

BEGIN;

SELECT * FROM pupitre;
SELECT * FROM "user";
SELECT * FROM suit;
SELECT * FROM instrument;
SELECT * FROM user_has_suit;

ROLLBACK;