import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
const MANUFACTURER_MAPPINGS = {
    'BEECH': 'Beechcraft',
    'CESSNA': 'Cessna',
    'CIRRUS': 'Cirrus',
    'MOONEY': 'Mooney',
    'MOONEY AIRCRAFT CORP.': 'Mooney',
    'GATES LEARJET CORP.': 'LearJet',
    'LEARJET INC': 'LearJet',
    'GULFSTREAM AEROSPACE': 'Gulfstream',
    'HAWKER BEECHCRAFT CORP': 'Hawker',
    'BOMBARDIER INC': 'Bombardier',
};
const standardizeManufacturerName = (manufacturer) => {
    const upperManufacturer = manufacturer.toUpperCase();
    for (const [key, value] of Object.entries(MANUFACTURER_MAPPINGS)) {
        if (upperManufacturer.includes(key)) {
            return value;
        }
    }
    return manufacturer;
};
const formatModelName = (manufacturer, model) => {
    const standardizedMfr = standardizeManufacturerName(manufacturer);
    const trimmedModel = model.trim();
    // Remove manufacturer name from model if it's repeated
    const modelWithoutMfr = trimmedModel.replace(new RegExp(manufacturer, 'i'), '').trim();
    return `${standardizedMfr} ${modelWithoutMfr}`;
};
export const processFiles = async (directory) => {
    const potentialAircraft = [];
    let processedCount = 0;
    let validCount = 0;
    let skippedManufacturers = 0;
    try {
        const filePath = path.join(directory, 'PendingCancellation02-15-2025.csv');
        if (!fs.existsSync(filePath)) {
            throw new Error('PendingCancellation02-15-2025.csv not found');
        }
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
            columns: false,
            skip_empty_lines: true,
            relax_quotes: true
        });
        records.slice(5).forEach((record, index) => {
            try {
                processedCount++;
                const nNumber = (record[0] || '').toString().trim();
                const cityStateZip = (record[9] || '').toString().trim();
                const owner = (record[7] || '').toString().trim();
                const manufacturer = (record[3] || '').toString().trim();
                const model = (record[4] || '').toString().trim();
                const yearManufactured = (record[5] || '').toString().trim();
                // Skip if missing critical data
                if (!nNumber || !cityStateZip || !owner || !manufacturer) {
                    console.debug(`Skipping record ${index + 6}: Missing required data`);
                    return;
                }
                // Skip if not an allowed manufacturer
                if (!Object.keys(MANUFACTURER_MAPPINGS).some(mfr => manufacturer.toUpperCase().includes(mfr))) {
                    skippedManufacturers++;
                    return;
                }
                // Skip if status indicates active transaction
                if (owner === 'SALE REPORTED' ||
                    owner === 'REGISTRATION PENDING' ||
                    owner === '&nbsp;' ||
                    owner === 'None') {
                    return;
                }
                validCount++;
                // Parse location data
                const zip = cityStateZip.match(/\d{5}(-\d{4})?/)?.[0] || '';
                const stateMatch = cityStateZip.match(/,\s*([A-Z]{2})\s/);
                const state = stateMatch ? stateMatch[1] : '';
                const city = cityStateZip.split(/,\s*[A-Z]{2}/)[0].trim();
                // Create aircraft record with sanitized and standardized data
                potentialAircraft.push({
                    number: nNumber,
                    registrationNumber: (record[1] || '').toString().trim(),
                    owner: owner,
                    mfrModelCode: formatModelName(manufacturer, model),
                    engMfrMdl: '',
                    yearManufactured: yearManufactured === 'None' ? '' : yearManufactured,
                    typeRegistrant: '',
                    street: (record[8] || '').toString().trim(),
                    street2: '',
                    city: city,
                    state: state,
                    zipCode: zip,
                    expirationDate: ''
                });
                console.log(`Found potential aircraft: ${nNumber} - ${formatModelName(manufacturer, model)} (${city}, ${state})`);
            }
            catch (err) {
                console.warn(`Error processing record ${index + 6}:`, err);
            }
        });
        console.log(`\nProcessing Summary:`);
        console.log(`Records processed: ${processedCount}`);
        console.log(`Valid records: ${validCount}`);
        console.log(`Skipped manufacturers: ${skippedManufacturers}`);
    }
    catch (error) {
        console.error('Error processing PendingCancellation02-15-2025.csv:', error);
        throw error;
    }
    return potentialAircraft;
};
