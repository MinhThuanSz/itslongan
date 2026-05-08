const fs = require('fs');
const file = 'c:/Users/ACER/Desktop/itslongan/fontend/dashboard.html';
let html = fs.readFileSync(file, 'utf8');

// Replace visual disable checks for MANAGER to only target STAFF
// Original: `['MANAGER', 'STAFF'].includes(user.role)` -> `user.role === 'STAFF'`
html = html.replace(/\['MANAGER', 'STAFF'\]\.includes\(user\.role\)/g, "user.role === 'STAFF'");

fs.writeFileSync(file, html);
