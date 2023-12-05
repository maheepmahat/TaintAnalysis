import csv
from datetime import datetime
from .taint import Tainted
import os

def write_changes_to_csv():
    file_name = 'tainted_variables.csv'

    # Read existing headers or initialize if the file doesn't exist
    existing_headers = []
    if os.path.exists(file_name):
        with open(file_name, 'r', newline='') as file:
            reader = csv.reader(file)
            existing_headers = next(reader, [])

    # Ensure 'Timestamp' is the first header
    headers = ['Timestamp'] if 'Timestamp' not in existing_headers else existing_headers
    new_headers = set(Tainted.changes.keys()) - set(headers)
    headers.extend(new_headers)

    # Read existing data and update with new changes
    existing_data = {}
    if existing_headers:
        with open(file_name, 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                existing_data[row['Timestamp']] = row

    # Update existing data with new changes
    for name, changes in Tainted.changes.items():
        for ts, value in changes:
            ts_str = ts.strftime('%Y-%m-%d %H:%M:%S')
            if ts_str not in existing_data:
                existing_data[ts_str] = {header: None for header in headers}
                existing_data[ts_str]['Timestamp'] = ts_str
            existing_data[ts_str][name] = value

    # Write the updated data back to the CSV file
    with open(file_name, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        for row in sorted(existing_data.values(), key=lambda x: x['Timestamp']):
            writer.writerow(row)

    # Clear the changes after writing
    Tainted.changes.clear()
