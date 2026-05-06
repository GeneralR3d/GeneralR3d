const date = new Date('2026-05-04');
console.log('Original Date:', date);
console.log('String(date):', String(date));
console.log('String(date).slice(0, 10):', String(date).slice(0, 10));
const sliced = String(date).slice(0, 10);
const newDate = new Date(sliced);
console.log('new Date(sliced):', newDate);
console.log('newDate.toLocaleDateString("en-US"):', newDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
}));
