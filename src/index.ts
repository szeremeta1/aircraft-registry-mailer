import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processFiles } from './fileProcessor.js';
import { generateLetters } from './letterGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.join(__dirname, '../data');
const outgoingLettersDirectory = path.join(__dirname, '../Outgoing-Letters');

const main = async () => {
    try {
        fs.mkdirSync(outgoingLettersDirectory, { recursive: true });
        
        console.log('Processing aircraft registry files...');
        const potentialAircraft = await processFiles(dataDirectory);
        console.log(`Potential aircraft found: ${potentialAircraft.length}`);

        if (!potentialAircraft.length) {
            console.warn('No potential aircraft found in records.');
            return;
        }
        
        await generateLetters(potentialAircraft, outgoingLettersDirectory);
        console.log('Processing complete. Letters generated successfully.');

        // Show example entries
        if (potentialAircraft.length > 0) {
            console.log('\nExample entries:');
            potentialAircraft.slice(0, 3).forEach(aircraft => {
                console.log(`- ${aircraft.registrationNumber}: ${aircraft.owner} (${aircraft.city}, ${aircraft.state})`);
            });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
};

main();