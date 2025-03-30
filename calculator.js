/**
 * Calculate tax using progressive rates for 2025/26 tax year
 * @param {number} taxableIncome - Net chargeable income
 * @returns {number} - Tax amount calculated using progressive rates
 */
function calculateProgressiveTax(taxableIncome) {
    let tax = 0;
    
    // 2025/26 progressive tax rates
    if (taxableIncome <= 0) {
        return 0;
    }
    
    if (taxableIncome <= 50000) {
        tax = taxableIncome * 0.02;
    } else if (taxableIncome <= 100000) {
        tax = 50000 * 0.02 + (taxableIncome - 50000) * 0.06;
    } else if (taxableIncome <= 150000) {
        tax = 50000 * 0.02 + 50000 * 0.06 + (taxableIncome - 100000) * 0.1;
    } else if (taxableIncome <= 200000) {
        tax = 50000 * 0.02 + 50000 * 0.06 + 50000 * 0.1 + (taxableIncome - 150000) * 0.14;
    } else {
        tax = 50000 * 0.02 + 50000 * 0.06 + 50000 * 0.1 + 50000 * 0.14 + (taxableIncome - 200000) * 0.17;
    }
    
    return tax;
}

/**
 * Calculate tax using standard rate for 2025/26 tax year
 * @param {number} netIncome - Net income
 * @returns {number} - Tax amount calculated using standard rate
 */
function calculateStandardTax(netIncome) {
    // 2025/26 standard tax rate
    if (netIncome <= 5000000) {
        return netIncome * 0.15;
    } else {
        return 5000000 * 0.15 + (netIncome - 5000000) * 0.16;
    }
}

/**
 * Calculate provisional tax for the next year
 * Based on current year's tax before rebate
 * @param {number} currentTax - Current year's tax before rebate
 * @returns {number} - Provisional tax amount
 */
function calculateProvisionalTax(currentTax) {
    return currentTax;
}
