-- Revert batala:4.2.select_views.sql from pg

BEGIN;

DROP VIEW IF EXISTS  users_by_pupitre;
DROP VIEW IF EXISTS  unassigned_instruments;

COMMIT;