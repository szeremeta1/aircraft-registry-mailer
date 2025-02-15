import csv
import re

MANUFACTURER_MAPPINGS = {
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
}

def standardize_manufacturer_name(manufacturer):
    upper_manufacturer = manufacturer.upper()
    for key, value in MANUFACTURER_MAPPINGS.items():
        if key in upper_manufacturer:
            return value
    return manufacturer

def format_model_name(manufacturer, model):
    standardized_mfr = standardize_manufacturer_name(manufacturer)
    trimmed_model = model.strip()
    model_without_mfr = re.sub(re.escape(manufacturer), '', trimmed_model, flags=re.IGNORECASE).strip()
    return f"{standardized_mfr} {model_without_mfr}"

def convert_pending_to_postgrid(pending_file, postgrid_file):
    with open(pending_file, 'r', newline='', encoding='utf-8') as infile, \
         open(postgrid_file, 'w', newline='', encoding='utf-8') as outfile:

        # Skip lines until reaching the actual header row
        while True:
            pos = infile.tell()
            line = infile.readline()
            if line.startswith("N-Number,"):
                infile.seek(pos)
                break

        reader = csv.DictReader(infile)
        fieldnames = [
            "Description", "First Name", "Last Name", "Email", "Phone Number",
            "Company Name", "Job Title", "Address", "Address 2", "City",
            "Province or State", "Postal or Zip", "Country Code", "months", "body"
        ]
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            n_number = row.get("N-Number", "").strip()
            name = row.get("Name", "").strip()
            city_state_zip = row.get("City, State Zip", "").strip()
            owner = row.get("Name", "").strip()
            manufacturer = row.get("Make", "").strip()
            model = row.get("Model", "").strip()
            year_manufactured = row.get("Manufacture Year", "").strip()

            # Skip if missing critical data
            if not n_number or not city_state_zip or not owner or not manufacturer:
                continue

            # Skip if not an allowed manufacturer
            if not any(mfr in manufacturer.upper() for mfr in MANUFACTURER_MAPPINGS):
                continue

            # Skip if status indicates active transaction
            if owner in ['SALE REPORTED', 'REGISTRATION PENDING', '&nbsp;', 'None']:
                continue

            name_parts = name.split(maxsplit=1)
            city_state_zip_parts = city_state_zip.split(',')
            city = city_state_zip_parts[0].strip() if len(city_state_zip_parts) > 0 else ""
            state_zip = city_state_zip_parts[1].strip() if len(city_state_zip_parts) > 1 else ""
            state_zip_parts = state_zip.split()
            state = state_zip_parts[0] if len(state_zip_parts) > 0 else ""
            zip_code = state_zip_parts[1] if len(state_zip_parts) > 1 else ""

            writer.writerow({
                "Description": f"N{n_number}",
                "First Name": name_parts[0] if name_parts else "",
                "Last Name": name_parts[1] if len(name_parts) > 1 else "",
                "Email": "",
                "Phone Number": "",
                "Company Name": "",
                "Job Title": "",
                "Address": row.get("Address", "").strip(),
                "Address 2": "",
                "City": city,
                "Province or State": state,
                "Postal or Zip": zip_code,
                "Country Code": "US",
                "months": "",
                "body": ""
            })

# Example usage:
convert_pending_to_postgrid("PendingCancellation02-15-2025.csv", "PendingCancellation02-15-2025-POSTGRID.csv")