-- Verify batala:4.2.select_views.sql on pg

BEGIN;

SELECT * FROM users_by_pupitre();
SELECT * FROM unassigned_instruments();

COMMIT;
