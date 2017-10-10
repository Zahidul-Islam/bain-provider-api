const express      = require('express');
const app          = express();
const mongoose     = require('mongoose');

const port         = process.env.PORT || 8000;
const Provider     = require('./model/provider');
const queryBuilder = require('./util/queryBuilder');
const appRouter    = express.Router();

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();    
}

const DB_URL = process.env.DB_URL;

mongoose.Promise   = global.Promise;
mongoose.connect(DB_URL, { useMongoClient: true });


appRouter.get('/', (req, res) => res.json({ message: `Welcome to API. Please try example GET /providers?max_discharges=500
                                                    &min_discharges=100&max_average_covered_charges=50000&min_average_covered_charges=40000
                                                    &min_average_medicare_payments=6000&max_average_medicare_payments=10000&state=GA` }));

appRouter.get('/providers', (req, res) => {
    const {
        max_discharges,
        min_discharges,
        max_average_covered_charges,
        min_average_covered_charges,
        min_average_medicare_payments,
        max_average_medicare_payments,
        state,
    } = req.query;
    
    const query = queryBuilder.build(req.query, Provider.find());
    query.exec()
        .then(providers => providers.map(item => ({
            'Provider Name': item.providerName,
            'Provider Street Address': item.providerStreetAddress,
            'Provider City': item.providerCity,
            'Provider State': item.providerState,
            'Provider Zip Code': item.providerZipCode,
            'Hospital Referral Region Description': item.hospitalReferralRegionDescription,
            'Total Discharges': item.totalDischarges,
            'Average Covered Charges': item.averageCoveredCharges,
            'Average Total Payments': item.averageTotalPayments,
            'Average Medicare Payments': item.averageMedicarePayments
        })))
        .then(providers => res.json(providers))
        .catch(err => res.json({ message: 'error', err }));
});

app.use(appRouter);
app.listen(port, () => console.log('API server is running on port: ' + port));


module.exports = app;
