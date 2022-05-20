const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);
const readableStream = fs.createReadStream(filePath);

readableStream.pipe(process.stdout);
