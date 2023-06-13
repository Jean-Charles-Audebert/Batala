BEGIN;

SELECT * FROM users_by_pupitre();
SELECT * FROM unassigned_instruments();

COMMIT;
