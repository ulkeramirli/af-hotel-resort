const text = 'WELCOME TO <br> AF HOTEL';
const normalizedText = text.replace(/<br\s*\/?>/gi, '\n');
const words = normalizedText.split(/(\n|\s+)/).filter(w => w.trim().length > 0 || w === '\n');
console.log("Words:");
words.forEach(w => console.log(`[${w}]`));
