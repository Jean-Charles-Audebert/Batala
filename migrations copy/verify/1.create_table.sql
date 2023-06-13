BEGIN;

SELECT * FROM pupitre;
SELECT * FROM "user";
SELECT * FROM suit;
SELECT * FROM instrument;
SELECT * FROM user_has_suit;

ROLLBACK;