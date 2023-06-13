import { fakerFR as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const password = bcrypt.hashSync('chuckpass', 10);

export async function generateUsers(nbUsers) {
    const users = [];

    for (let i = 0; i < nbUsers; i += 1) {
        const user = {
            image: faker.image.avatar(),
            lastname: faker.person.lastName(),
            firstname: faker.person.firstName(),
            nickname: faker.person.firstName().slice(0, 3),
            email: faker.internet.email(),
            password: password,
            birthdate: faker.date.birthdate({min:18, max:70, mode: 'age' }).toISOString().slice(0, 10),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
            address_2: faker.location.secondaryAddress(),
            zip_code: faker.location.zipCode('17###'),
            city: faker.location.city(),
            gender: faker.helpers.arrayElement(['F', 'M']),
            top_size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL+']),
            bottom_size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL+']),
            subscription: faker.datatype.boolean(),
            deposit: faker.datatype.boolean(),
            role: faker.helpers.arrayElement(['member', 'board', 'admin']),
            level: faker.helpers.arrayElement(['confirmed', 'noob']),
            observation: 'null',
            pupitre_id: faker.helpers.arrayElement([1,2,3,4,5])
        };
        users.push(user);
    }

    return users;
}
