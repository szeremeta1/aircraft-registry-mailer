# Aircraft Registry Mailer

A Node.js/TypeScript application that processes FAA aircraft registry data to generate personalized letters for aircraft owners with expired registrations.

## Overview

This application:
1. Reads FAA aircraft registry data from CSV files
2. Identifies aircraft with expired certificates/pending cancellations 
3. Generates personalized letters to aircraft owners using a template
4. Saves letters as Word documents (.docx) with registration numbers as filenames

## Project Structure

```
aircraft-processing/
├── src/
│   ├── index.ts           # Application entry point
│   ├── fileProcessor.ts   # CSV parsing and data processing
│   ├── letterGenerator.ts # Letter generation using docx templates  
│   ├── types.ts          # TypeScript type definitions
│   └── db.ts             # Database operations (if needed)
├── data/                  # FAA registry data files
├── Outgoing-Letters/     # Generated letter output folder
├── package.json
└── tsconfig.json
```

## Getting Started

1. Modify letterGenerator.ts to your liking
```bash
// You must first modify the contents of letterGenerator.ts
// to your liking. Right now, it just generates each letter with
// my shitty script and default contact info.
```

2. cd into folder Install dependencies:
```bash
cd aircraft-registry-mailer
npm install
```

3. Build the TypeScript files:
```bash
npx tsc
```

4. Run the application:
```bash
cd dist
node ./index.js
```

Generated letters will be saved in the `Outgoing-Letters` folder as `N{REGISTRATION}.docx` files.

## Data Files

Place updated FAA registry files in the `data` directory:
- ACFTREF.csv - Aircraft reference data
- PendingCancellationXX-XX-20XX.csv - Current pending registration cancellations
- DEALER.csv - Aircraft dealer information
- ENGINE.csv - Aircraft engine reference data

## Letter Template

The letter template uses:
- Garamond font
- 1.5 line spacing
- Blue underlined contact information

## Output Format

The application generates:
- Individual .docx files for each aircraft owner
- Filenames based on registration numbers (e.g., N1234.docx)
- Personalized content including:
  - Owner's name and address
  - Aircraft details (year, make, model)
  - Registration number

## Processing Results

From the last run:
- Records processed: 624
- Valid records found: 73
- Skipped manufacturers: 232
- Letters generated: 73

## Contributing

Feel free to submit issues and pull requests for any improvements.
