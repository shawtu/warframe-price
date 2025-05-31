/**
 * Loads and parses a TSV file into an array of objects.
 * @param {string} tsvUrl - Path to the TSV file.
 * @returns {Promise<Array>} - Array of row objects.
 */
export async function loadTSV(tsvUrl) {
  const response = await fetch(tsvUrl);
  if (!response.ok) throw new Error('Failed to load: ' + tsvUrl);
  const tsvString = await response.text();
  const lines = tsvString.trim().split('\n');
  if (!lines.length) return [];
  const headers = lines[0].split('\t').map(h => h.trim());
  return lines.slice(1).filter(Boolean).map(line => {
    const values = line.split('\t');
    const row = {};
    headers.forEach((header, i) => {
      row[header] = (values[i] ?? '').trim();
    });
    return row;
  });
}