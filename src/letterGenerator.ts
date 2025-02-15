import fs from 'fs';
import path from 'path';
import pkg from 'docx';
const { Document: DocxDocument, Packer, Paragraph, TextRun } = pkg;
import { Aircraft } from './types'; // Use the unified Aircraft type from types.ts

export async function generateLetters(aircraftData: Aircraft[], outputFolder: string) {
    // Generate individual letters
    for (const aircraft of aircraftData) {
        const letter = createLetter(aircraft);
        const fileName = `N${aircraft.number}.docx`;
        const filePath = path.join(outputFolder, fileName);
        await saveLetter(letter, filePath);
    }

    // Generate mailing list CSV
    await generateMailingList(aircraftData, outputFolder);
}

export async function generateMailingList(aircraftData: Aircraft[], outputFolder: string) {
    // Update header to use single name column
    const csvRows = ['name,address,address2,city,state,zip,country,file'];
    
    for (const aircraft of aircraftData) {
        // Build CSV row with sanitized data and add USA as country
        const row = [
            aircraft.owner.replace(/,/g, ''),  // Keep full name as one field
            (aircraft.street || '').replace(/,/g, ''),
            (aircraft.street2 || '').replace(/,/g, ''),
            (aircraft.city || '').replace(/,/g, ''),
            aircraft.state || '',
            aircraft.zipCode || '',
            'USA',  // Add country code
            `N${aircraft.number}.docx`
        ].join(',');
        
        csvRows.push(row);
    }

    // Write CSV file
    const csvContent = csvRows.join('\n');
    const csvPath = path.join(outputFolder, 'mailing-addresses.csv');
    fs.writeFileSync(csvPath, csvContent);
}

function createLetter(aircraft: Aircraft): InstanceType<typeof DocxDocument> {
    const addressParagraphs = [
        new Paragraph({
            children: [
                new TextRun({
                    text: `${aircraft.owner}`,
                    font: "Garamond"
                })
            ],
            spacing: { line: 360 } // 1.5 line spacing (240 = 1.0, 360 = 1.5)
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: `${aircraft.street || ''}`,
                    font: "Garamond"
                })
            ],
            spacing: { line: 360 }
        })
    ];

    // Rest of the address formatting...
    if (aircraft.street2) {
        addressParagraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: aircraft.street2,
                        font: "Garamond"
                    })
                ],
                spacing: { line: 360 }
            })
        );
    }

    addressParagraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `${aircraft.city || ''}, ${aircraft.state || ''} ${aircraft.zipCode || ''}`,
                    font: "Garamond"
                })
            ],
            spacing: { line: 360 }
        })
    );

    return new DocxDocument({
        sections: [{
            children: [
                ...addressParagraphs,
                new Paragraph({ text: '', spacing: { line: 360 } }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Dear ${aircraft.owner},`,
                            font: "Garamond"
                        })
                    ],
                    spacing: { line: 360 }
                }),
                new Paragraph({ text: '', spacing: { line: 360 } }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `I came across FAA records showing that your plane, N${aircraft.number}, has an expired certificate and is pending registration cancellation. I'm a passionate student pilot based out of Central Jersey, currently working on my Private Pilot's License & Instrument Rating. My deepest passion of all, however, is technology, and discovering well-loved airplanes with various avionics systems fuels them both. Your ${aircraft.yearManufactured || ''} ${aircraft.mfrModelCode || ''} caught my eye, and I wanted to reach out to see if you still have it. If so and if she's airworthy, I'd love to learn more about her history and condition. If you've considered selling or donating, I'd be very interested in discussing that. I look forward to hearing from you!`,
                            font: "Garamond"
                        })
                    ],
                    spacing: { line: 360 }
                }),
                new Paragraph({ text: '', spacing: { line: 360 } }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Thanks,',
                            font: "Garamond"
                        })
                    ],
                    spacing: { line: 360 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Alex S.',
                            font: "Garamond"
                        })
                    ],
                    spacing: { line: 360 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'alex@monmouthpilot.com',
                            font: "Garamond",
                            color: '0000FF',
                            underline: {}
                        })
                    ],
                    spacing: { line: 360 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: '(848) 342-5656',
                            font: "Garamond",
                            color: '0000FF',
                            underline: {}
                        })
                    ],
                    spacing: { line: 360 }
                })
            ]
        }]
    });
}

async function saveLetter(doc: InstanceType<typeof DocxDocument>, filePath: string): Promise<void> {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);
}