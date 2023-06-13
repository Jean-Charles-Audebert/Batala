import pool from '../services/pg.js';

import { instruments } from './instruments.js';
import { pupitres } from './pupitres.js';
import { suits } from './suits.js';
import { password, generateUsers } from './users.js';
import { userHasSuits } from './user_has_suits.js';

function pgQuoteEscape(row) {
    const newRow = {};
    Object.entries(row).forEach(([prop, value]) => {
        if (typeof value !== 'string') {
            newRow[prop] = value;
            return;
        }
        newRow[prop] = value.replaceAll("'", "''");
    });
    return newRow;
}

async function insertPupitres() {
    const pupitresToInsert = pupitres.map((pupitre) => {
        const data = {
            "label": pupitre[0]
        };
        return data;
    });

    await pool.query('TRUNCATE TABLE "pupitre" RESTART IDENTITY CASCADE');

    const pupitresValues = pupitresToInsert.map((pupitre) => {
        const newPupitre = pgQuoteEscape(pupitre);
        return `(
            '${newPupitre.label}'
        )`;
    });

    const queryStr = `
        INSERT INTO "pupitre"
            (
                "label"
            )
        VALUES
            ${pupitresValues}
            RETURNING id
        `;

    const result = await pool.query(queryStr);
    console.log("✴.·´¯ Données \"pupitres\" insérées dans la table Pupitres¯´·.✴");
    return result.rows;
}

async function insertUsers(users) {
    await pool.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
    const usersValues = users.map((user) => {
        const newUser = pgQuoteEscape(user);
        return `(
            '${newUser.image}',
            '${newUser.lastname}',
            '${newUser.firstname}',
            '${newUser.nickname}',
            '${newUser.email}',
            '${newUser.password}',
            '${newUser.birthdate}',
            '${newUser.phone}',
            '${newUser.address}',
            '${newUser.address_2}',
            '${newUser.zip_code}',
            '${newUser.city}',
            '${newUser.gender}',
            '${newUser.top_size}',
            '${newUser.bottom_size}',
            '${newUser.subscription}',
            '${newUser.deposit}',
            '${newUser.role}',
            '${newUser.level}',
            '${newUser.observation}',
            '${newUser.pupitre_id}'
        )`;
    });

    const queryStr = `
    INSERT INTO "user"
    (
        "image",
        "lastname",
        "firstname",
        "nickname",
        "email",
        "password",
        "birthdate",
        "phone",
        "address",
        "address_2",
        "zip_code",
        "city",
        "gender",
        "top_size",
        "bottom_size",
        "subscription",
        "deposit",
        "role",
        "level",
        "observation",
        "pupitre_id"
    )
    VALUES
    (
        '',
        'Norris',
        'Chuck',
        'CN',
        'cn@email.com',
        '${password}',
        '1970-01-01',
        '06 95 58 58 12',
        '2 rue de la piscine',
        '',
        '17000',
        'La Rochelle',
        'M',
        'L',
        'L',
        'true',
        'true',
        'admin',
        'confirmed',
        '',
        '4'
    ), --superpass
        ${usersValues}
        RETURNING id
    `;
    const result = await pool.query(queryStr);
    console.log('✴.·´¯ Données "user" insérées dans la table Users ¯´·.✴');
    return result.rows;
}

async function insertInstruments(usersIds = [], pupitreIds = []) {

    if (!usersIds.length) {
        throw new Error('Pas d\'utilisateurs passés en paramètres ou tableau vide');
    }

    const intrumentToInsert = instruments.map(instrument => {
        const data = {
            "code": instrument[0],
            "pupitre_id": instrument[1],
            "observation": instrument[2],
            "depth": instrument[3],
            "rods": instrument[4],
            "weight": instrument[5],
            "sticker": instrument[6],
            "user_id": instrument[7]
        };

        return data;
    });

    const instrumentValues = intrumentToInsert.map(instrument => {
        const newInstrument = pgQuoteEscape(instrument);
        return `(
            '${newInstrument.code}',
            '${newInstrument.pupitre_id}',
            '${newInstrument.observation}',
            ${newInstrument.depth},
            ${newInstrument.rods},
            ${newInstrument.weight},
            '${newInstrument.sticker}',
            ${newInstrument.user_id || 'NULL'}
        )`;

    });
    const queryStr = `
    INSERT INTO "instrument" (
        "code",
        "pupitre_id",
        "observation",
        "depth",
        "rods",
        "weight",
        "sticker",
        "user_id"
    )
    VALUES
        ${instrumentValues}
    `;
    const result = await pool.query(queryStr);
    console.log("✴.·´¯ Données \"instruments\" insérées dans la table Instruments ¯´·.✴ ");
    return result.rows;
}

async function insertSuits() {
    const suitsToInsert = suits.map((suit) => {
        const data = {
            "label": suit[0],
            "image": suit[1],
            "observation": suit[2],
            "quantity_xs": suit[3],
            "quantity_s": suit[4],
            "quantity_m": suit[5],
            "quantity_l": suit[6],
            "quantity_xl": suit[7],
            "quantity_xxl": suit[8]
        };
        return data;
    });

    await pool.query('TRUNCATE TABLE "suit" RESTART IDENTITY CASCADE');

    const suitsValues = suitsToInsert.map((suit) => {
        const newSuit = pgQuoteEscape(suit);
        return `(
            '${newSuit.label}',
            '${newSuit.image}',
            '${newSuit.observation}',
            '${newSuit.quantity_xs}',
            '${newSuit.quantity_s}',
            '${newSuit.quantity_m}',
            '${newSuit.quantity_l}',
            '${newSuit.quantity_xl}',
            '${newSuit.quantity_xxl}' 
        )`;
    });
    const queryStr = `
    INSERT INTO "suit"
        (
            "label",
            "image",
            "observation",
            "quantity_xs",
            "quantity_s",
            "quantity_m",
            "quantity_l",
            "quantity_xl",
            "quantity_xxl+"
        )
        VALUES
            ${suitsValues}
            RETURNING id
    `;
    const result = await pool.query(queryStr);
    console.log("✴.·´¯ Données \"costumes\" insérées dans la table Suits¯´·.✴");
    return result.rows;
}


async function insertUserHasSuit(usersIds = [], suitsIds = []) {

    if (!usersIds.length || !suitsIds.length) {
        throw new Error('Pas d\'utilisateurs ou de costumes passés en paramètres ou tableau vide');
    }
    const userHasSuitsToInsert = userHasSuits.map(userHasSuit => {
        const data = {
            "user_id": userHasSuit[0],
            "suit_id": userHasSuit[1],
        };
        return data;
    });

    await pool.query('TRUNCATE TABLE "user_has_suit" RESTART IDENTITY CASCADE');

    const userHasSuitsValues = userHasSuitsToInsert.map((userHasSuit) => {
        const newUserHasSuit = pgQuoteEscape(userHasSuit);
        return `(
            '${newUserHasSuit.user_id}',
            '${newUserHasSuit.suit_id}'
        )`;
    });
    const queryStr = `
    INSERT INTO "user_has_suit"
    (
        "user_id",
        "suit_id"
    )
    VALUES
        ${userHasSuitsValues}
        RETURNING id
`;
    const result = await pool.query(queryStr);
    console.log("✴.·´¯ Données \"utilisateurs a un costumes \" insérées dans la table User_has_suit¯´·.✴");
    return result.rows;
}

(async () => {
    try {
        const nb_users = 70;
        const insertedPupitres = await insertPupitres();
        const users = await generateUsers(nb_users);
        const insertedUsers = await insertUsers(users);
        const userIds = insertedUsers.map((user) => user.id);
        const pupitreIds = insertedPupitres.map((pupitre) => pupitre.id);
        const insertedInstruments = await insertInstruments(userIds, pupitreIds);
        const insertedSuits = await insertSuits();
        const suitIds = insertedSuits.map((suit) => suit.id);
        const insertedUsersHasSuits = await insertUserHasSuit(userIds, suitIds);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();