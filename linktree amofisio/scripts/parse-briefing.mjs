import fs from 'fs';

export function parseCSV(text) {
  const rows = [];
  let row = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(currentToken);
      currentToken = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(currentToken);
      currentToken = '';
      if (row.length > 1) rows.push(row);
      row = [];
    } else {
      currentToken += c;
    }
  }
  if (currentToken || row.length > 0) {
    row.push(currentToken);
    rows.push(row);
  }
  return rows;
}
