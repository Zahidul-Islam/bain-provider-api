exports.build = (queryString, provider) => {
    const {
        max_discharges,
        min_discharges,
        max_average_covered_charges,
        min_average_covered_charges,
        min_average_medicare_payments,
        max_average_medicare_payments,
        state,
    } = queryString;
    
    // total discharges
    if(max_discharges && min_discharges) {
        provider.where('totalDischarges').lte(max_discharges).gte(min_discharges);
    }

    if(max_discharges && !min_discharges) {
        provider.where('totalDischarges').lte(max_discharges);
    }
    
    if(!max_discharges && min_discharges) {
        provider.where('totalDischarges').gte(min_discharges);
    }

    // average covered charges
    if(max_average_covered_charges && min_average_covered_charges) {
        provider.where('averageCoveredCharges').lte(max_average_covered_charges).gte(min_average_covered_charges);
    }

    if(max_average_covered_charges && !min_average_covered_charges) {
        provider.where('averageCoveredCharges').lte(max_average_covered_charges);
    }
    if(!max_average_covered_charges && min_average_covered_charges) {
        provider.where('averageCoveredCharges').gte(min_average_covered_charges);
    }

    // min_average_medicare_payments
    if(max_average_medicare_payments && min_average_medicare_payments) {
        provider.where('averageMedicarePayments').lt(max_average_medicare_payments).gt(min_average_medicare_payments);
    }

    if(max_average_medicare_payments && !min_average_medicare_payments) {
        provider.where('averageMedicarePayments').lt(max_average_medicare_payments);
    }
    if(!max_average_medicare_payments && min_average_medicare_payments) {
        provider.where('averageMedicarePayments').gt(min_average_medicare_payments);
    }

    //state
    if(state) {
        provider.where('providerState').equals(state);
    }

    return provider;
}