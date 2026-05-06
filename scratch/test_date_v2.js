function parseDate(date) {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return String(date).slice(0, 10);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const dateFromGrayMatter = new Date('2026-05-04');
console.log('Date from gray-matter (unquoted):', dateFromGrayMatter);

const parsed = parseDate(dateFromGrayMatter);
console.log('Parsed date (ISO string):', parsed);

const formatted = formatDate(parsed);
console.log('Formatted date (UI):', formatted);

if (formatted === 'May 4, 2026') {
    console.log('SUCCESS: Date is correct!');
} else {
    console.log('FAILURE: Date is still wrong:', formatted);
}
