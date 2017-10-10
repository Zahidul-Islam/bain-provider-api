# Bain Provider API

An internal API test for a national healthcare provider

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)

### Installing

To install Bain Providers API clone the GitHub repository

```
git clone https://github.com/Zahidul-Islam/bain-provider-api.git
cd bain-provider-api
npm install
```

## Update environment variables

Rename ```.env.template``` file to ```.env``` using ```mv .env.template .env```

Update properties in **.env** file

```
DB_URL=<MongoDB URL>
DATA_URL=<Data Set URL>
```

## Sync Database

Run ```npm run sync``` command which will download providers data from the given **URL** ```DATA_URL```

Example:

```
DATA_URL=https://s3-us-west-2.amazonaws.com/bain-coding-challenge/Inpatient_Prospective_Payment_System__IPPS__Provider_Summary_for_the_Top_100_Diagnosis-Related_Groups__DRG__-_FY2011.csv
```

## Run

Development mode with **[nodemon](https://nodemon.io/)** (reload automatically)

```
npm run dev
```
Without ```nodemon```

```
npm start
```

## Running the tests

```
npm test
```

## Deployment

API is hosted in Heroku. Here is the [demo]().

## Built With

* [Express.js](https://expressjs.com/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Mongoose](http://mongoosejs.com/) - Mongodb ORM for Node.js
* [CSVTOJSON](https://github.com/Keyang/node-csvtojson) - Node.js csv parser
* [dotenv](https://rometools.github.io/rome/) - Used to loads environment variables from a ```.env``` file

## Versioning

I use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
