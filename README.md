# Batala
Rest API version of Batala project

## Install

### NPM

Install all mandatory packages, in a first time :

```shell
npm install
```

### Database

Sqitch is used for database versioning [official documentation](https://sqitch.org/download/).

We used a script as an interface, thanks to Kevin Hesse [github](https://github.com/Kevin-HESSE/auto_sqitch_script). The database can be build with the following command :

```shell
npm run db:prod:build
```

Follow and fill the prompts.

After creating the user and the database, you need to deploy All (answer 1).

#### Updating the database : 
```shell
batch sqitch_script.sh
```
3) add => fill the filename without extension and add your comment

This will create files to write into the directories (deploy, revert, verify) and add references to requested files

Then code in the created files

#### Seeding
```shell
npm run db:seed
```

### .env file

Duplicate `.env.example` file to a `.env` file and fill your values.

### Server

To start in normal mode, execute :

```shell
npm run start
```

To start in dev mode, execute :

```shell
npm run dev
```
