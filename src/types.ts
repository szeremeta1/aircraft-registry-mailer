export interface Aircraft {
    // Common fields
    number: string; // N-NUMBER

    // MASTER.txt / DEREG.txt fields for registration number
    registrationNumber?: string; // SERIAL NUMBER (MASTER.txt) or SERIAL-NUMBER (DEREG.txt)

    // Owner information
    owner: string; // NAME
    ownerName?: string; // duplicate if needed

    // Manufacturer and model information
    mfrModelCode?: string; // MFR MDL CODE (MASTER.txt) or MFR-MDL-CODE (DEREG.txt)
    engMfrMdl?: string;   // ENG MFR MDL (MASTER.txt) or ENG-MFR-MDL (DEREG.txt)
    yearManufactured?: string; // YEAR-MFR

    // Registration type (available only in MASTER.txt)
    typeRegistrant?: string; // TYPE REGISTRANT

    // Address fields
    street?: string; // STREET (MASTER.txt) or STREET-MAIL (DEREG.txt)
    street2?: string; // STREET2 (MASTER.txt) or STREET2-MAIL (DEREG.txt)
    city?: string; // CITY (MASTER.txt) or CITY-MAIL (DEREG.txt)
    state?: string; // STATE (MASTER.txt) or STATE-ABBREV-MAIL (DEREG.txt)
    zipCode?: string; // ZIP CODE (MASTER.txt) or ZIP-CODE-MAIL (DEREG.txt)

    // Additional location and timing
    region?: string; // REGION
    county?: string; // COUNTY (MASTER.txt) or COUNTY-MAIL (DEREG.txt)
    country?: string; // COUNTRY (MASTER.txt) or COUNTRY-MAIL (DEREG.txt)
    lastActionDate?: string; // LAST ACTION DATE (MASTER.txt) or LAST-ACT-DATE (DEREG.txt)
    certIssueDate?: string; // CERT ISSUE DATE (MASTER.txt) or CERT-ISSUE-DATE (DEREG.txt)

    // Certification and aircraft details
    certification?: string; // CERTIFICATION
    typeAircraft?: string;  // TYPE AIRCRAFT
    typeEngine?: string;    // TYPE ENGINE
    status?: string;        // STATUS CODE (MASTER.txt) or STATUS-CODE/STATUS CODE (DEREG.txt)
    modeSCode?: string;     // MODE S CODE (MASTER.txt and DEREG.txt)
    fractOwner?: string;    // FRACT OWNER

    // Date fields
    airWorthDate?: string;       // AIR WORTH DATE (MASTER.txt) or AIR-WORTH-DATE (DEREG.txt)
    expirationDate?: string;     // EXPIRATION DATE (MASTER.txt)
    certificateExpiration?: Date; // (Optional) parsed expiration date if needed

    // Other names
    otherNames1?: string; // OTHER NAMES(1) or OTHER-NAMES(1)
    otherNames2?: string; // OTHER NAMES(2) or OTHER-NAMES(2)
    otherNames3?: string; // OTHER NAMES(3) or OTHER-NAMES(3)
    otherNames4?: string; // OTHER NAMES(4) or OTHER-NAMES(4)
    otherNames5?: string; // OTHER NAMES(5) or OTHER-NAMES(5)

    // Additional fields
    uniqueId?: string;    // UNIQUE ID
    kitMfr?: string;      // KIT MFR
    kitModel?: string;    // KIT MODEL
    modeSCodeHex?: string; // MODE S CODE HEX
}