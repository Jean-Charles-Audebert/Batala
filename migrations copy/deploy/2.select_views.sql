BEGIN;

DROP VIEW IF EXISTS  users_by_pupitre;
DROP VIEW IF EXISTS  unassigned_instruments;

--------------------------------------
------------ VIEWS -------------------
--------------------------------------

-- Select users by pupitre
CREATE VIEW users_by_pupitre AS
SELECT 
    pupitre.label AS pupitre, 
    count("user".id) AS total,
    array_agg(CONCAT("user".firstname, ' ', COALESCE("user".nickname, "user".lastname))) AS names
FROM "user"
JOIN pupitre ON "user".pupitre_id = pupitre.id
GROUP BY pupitre.label
ORDER BY pupitre.label;

-- Select available instruments
CREATE VIEW unassigned_instruments AS
SELECT 
    pupitre.label AS pupitre, 
    count(instrument.id) AS total,
    array_agg(instrument.code) AS instruments
FROM instrument
JOIN pupitre ON instrument.pupitre_id = pupitre.id
WHERE instrument.user_id IS NULL
GROUP BY pupitre.label
ORDER BY pupitre.label;

COMMIT;