import openpyxl
from openpyxl.utils import get_column_letter, range_boundaries, column_index_from_string
from openpyxl.styles import PatternFill
from openpyxl.comments import Comment
import json
import sys
from io import BytesIO
import re

def extract_merged_ranges(sheet, column_letter, start_row):
    merged_ranges = []
    for merged_cell_range in sheet.merged_cells.ranges:
        min_col, min_row, _, max_row = range_boundaries(str(merged_cell_range))
        if min_row > start_row and get_column_letter(min_col) == column_letter:
            merged_ranges.append((min_row, max_row))
    return merged_ranges

def extract_row_data(sheet, start_row, end_row, last_col):
    row_data = []
    for row in sheet.iter_rows(min_row=start_row, max_row=end_row, min_col=1, max_col=last_col, values_only=False):
        row_values = {}
        for cell in row:
            cell_address = f"{get_column_letter(cell.column)}{cell.row}"
            row_values[cell_address] = {
                "value": cell.value,
                "color": get_cell_color(cell),
                "comments": get_cell_comment(cell)
            }
        row_data.append(row_values)
    return row_data

def find_last_column(sheet, start_row):
    for col in range(1, sheet.max_column + 1):
        if sheet.cell(row=start_row, column=col).value is None:
            return col - 1
    return sheet.max_column

def get_cell_color(cell):
    try:
        if cell.fill and cell.fill.fgColor:
            if cell.fill.fgColor.type == "rgb" and cell.fill.fgColor.rgb:
                return cell.fill.fgColor.rgb
            elif cell.fill.fgColor.type == "indexed" and cell.fill.fgColor.indexed is not None:
                return f"indexed={cell.fill.fgColor.indexed}"
            elif cell.fill.fgColor.type == "theme" and cell.fill.fgColor.theme is not None:
                return f"theme={cell.fill.fgColor.theme}"
    except Exception as e:
        print(f"Error in get_cell_color: {e}", file=sys.stderr)
        return None

def get_cell_comment(cell):
    if cell.comment and isinstance(cell.comment, Comment):
        return cell.comment.text
    return None

def extract_data(sheet, start_row, end_row):
    try:
        last_col_idx = find_last_column(sheet, start_row)
        last_col_letter = get_column_letter(last_col_idx)
        print(f"Last Column is printe: {last_col_letter}, Index: {last_col_idx}", file=sys.stderr)
        headers = extract_headers(sheet, start_row, end_row)
        print(f"headers: {headers}", file=sys.stderr)

        data = []
        merged_ranges = extract_merged_ranges(sheet, 'A', end_row)  # Assuming the first column is 'A'
        print(f"MERGE RANGES: {merged_ranges}", file=sys.stderr)

        for merged_range in merged_ranges:
            start, end = merged_range
            row_data = extract_row_data(sheet, start, end, last_col_idx)
            merged_data = merge_row_data(row_data, headers)
            camel_cased_data = convert_keys_to_camel_case(merged_data)
            data.append(camel_cased_data)
        
        # Process non-merged cells
        # Assuming there's logic here to process non-merged cells similarly
        # Add the processing here and ensure camel_cased_data is appended to data

        return data
    except Exception as e:
        print(f"Error in extract_data: {e}", file=sys.stderr)
        return []

def merge_row_data(data, headers):
    merged_data = {}
    try:
        for row in data:
            for cell_address, cell_data in row.items():
                col_letter = ''.join(filter(str.isalpha, cell_address))
                col_idx = column_index_from_string(col_letter) - 1
                if col_idx < len(headers):
                    header = headers[col_idx]
                    if cell_data['value'] is not None:
                        if header not in merged_data:
                            merged_data[header] = []
                        merged_data[header].append(cell_data)
    except Exception as e:
        print(f"Error in merge_row_data: {e}", file=sys.stderr)
    return merged_data

def get_column_letter_to_index(letter):
    return openpyxl.utils.column_index_from_string(letter)

def extract_headers(sheet, start_row, end_row):
    headers = []
    for i in range(start_row, end_row + 1):
        row_values = [cell.value for cell in sheet[i]]
        headers.append(row_values)
    merged_headers = merge_headers(headers)
    return merged_headers

def merge_headers(headers):
    merged = []
    for i in range(len(headers[0])):
        column_header = []
        for header in headers:
            column_header.append(header[i] if header[i] is not None else "")
        merged.append("\n".join(filter(None, column_header)))
    return merged

def convert_keys_to_camel_case(obj):
    new_obj = {}
    for key, value in obj.items():
        camel_case_key = re.sub(r'(_[a-z])', lambda x: x.group(1)[1].upper(), key)
        if isinstance(value, dict):
            new_obj[camel_case_key] = convert_keys_to_camel_case(value)
        else:
            new_obj[camel_case_key] = value
    return new_obj

# Example usage
if __name__ == "__main__":
    try:
        input_stream = BytesIO(sys.stdin.buffer.read())
        wb = openpyxl.load_workbook(input_stream)
        sheet = wb.active
        result = extract_data(sheet, 1, 3)  # Assuming headers are in rows 1 to 3
        result_length = len(result)
        print("Result Length:", result_length, file=sys.stderr)
        print(json.dumps(result, indent=4, default=str))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
