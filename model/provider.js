const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerSchema = new Schema({
    dRGDefinition: String,
    providerId: Number,
    providerName: String,
    providerStreetAddress: String,
    providerCity: String,
    providerState: String,
    providerZipCode: String,
    hospitalReferralRegionDescription: String, 
    totalDischarges: Number, 
    averageCoveredCharges: Number, 
    averageTotalPayments: Number,
    averageMedicarePayments: Number
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;