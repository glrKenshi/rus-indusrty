const fs = require('fs');
let content = fs.readFileSync('src/pages/HonestMark.tsx', 'utf8');
const bad = /(\{scanning \? t\("honestMark\.scanningDesc"\) : t\("honestMark\.validDesc"\)\}).*?\}/s;
content = content.replace(bad, '$1');
fs.writeFileSync('src/pages/HonestMark.tsx', content);
console.log('Fixed');
