const csv      = require('csvtojson');
const request  = require('request');
const mongoose = require('mongoose');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();    
} 

const DATA_URL = process.env.DATA_URL;
const DB_URL = process.env.DB_URL || 'mongodb://bain:bain@ds113835.mlab.com:13835/provider-db';

const conn = mongoose.connect(DB_URL, { useMongoClient: true });
const Provider = require('../model/provider');
mongoose.Promise = global.Promise;

let runDataSync = (url) => {
    csv()
        .fromStream(request.get(url))
        .on('csv', row => {

            const [
                dRGDefinition,
                providerId,
                providerName,
                providerStreetAddress,
                providerCity,
                providerState,
                providerZipCode,
                hospitalReferralRegionDescription,
                totalDischarges,
                averageCoveredCharges,
                averageTotalPayments,
                averageMedicarePayments
            ] = row;

            const provider = new Provider({
                dRGDefinition,
                providerId,
                providerName,
                providerStreetAddress,
                providerCity,
                providerState,
                providerZipCode: providerZipCode.match(/[\d.]+/g)[0],
                hospitalReferralRegionDescription,
                totalDischarges: totalDischarges.match(/[\d.]+/g)[0],
                averageCoveredCharges: averageCoveredCharges.match(/[\d.]+/g)[0],
                averageMedicarePayments: averageMedicarePayments.match(/[\d.]+/g)[0],
                averageMedicarePayments: averageMedicarePayments.match(/[\d.]+/g)[0],
            });

            provider.save()
                .then(doc => console.log(`==> adding provider: ${providerName} `))
                .catch(err => console.error);
        })
        .on('done', error => {
            process.exit();
        });
}

Provider.db.dropDatabase((err, row) => {
    if (err) {
        console.log('==> error ', err);
        return;
    }
    console.log(`==> Dropping provider collection`)
    runDataSync(DATA_URL);
});